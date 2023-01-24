const { checkDiscountObject, createResponse } = require('../common/utils');
const DynamoDB = require('../common/Dynamo');
const { MethodIncorrectError, BadRequestError, PageNotFoundError, InternalServerError } = require('../common/errors')

const discountTable = process.env.DISCOUNT_TABLE

const getDiscountIdIfAdTypeExists = ({ Items }, discount) => {
  let discountId = ''
  Items.forEach(item => {
    if (item.adType === discount.adType) {
      discountId = item.id
    }
  })
  return discountId
}

module.exports.test = async (event, context, callback) => {

}

module.exports.createDiscount = async (event, context, callback) => {
  if (event.httpMethod !== 'POST') {
    throw new MethodIncorrectError('Must use POST Method to add a discount.')
  }
  const discount = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  const validDiscountObject = checkDiscountObject(discount)
  if (!validDiscountObject) {
    throw new BadRequestError('Discount properties were incorrect. Cannot create new discount.')
  }
  const dynamo = new DynamoDB(discountTable)
  const doesCompanyExist = await dynamo.scanDiscounts(discount)

  let response

  if (doesCompanyExist.Count === 0) {
    response = await dynamo.insertItem(discount)
  } else {
    const discountId = getDiscountIdIfAdTypeExists(doesCompanyExist, discount)
    response = discountId === '' ? await dynamo.insertItem(discount) : await dynamo.updateItems(discountId, discount)
  }
  
  if (!response) {
    throw new InternalServerError('Error inserting item into Dynamo Table')
  }
  callback(null, createResponse(200, { message: 'Successfully inserted new Discount into the Discount Table.' }))
}



module.exports.getDiscount = async (event, context, callback) => {
  if (event.httpMethod !== 'GET') {
    throw new MethodIncorrectError('Must use GET Method to get a discount.')
  }
  if (!event.pathParameters || !event.pathParameters.id) {
    throw new BadRequestError('Missing the id from the path.')
  }

  const { id } = event.pathParameters
  const dynamo = new DynamoDB(discountTable)
  const discount = await dynamo.getItem(id)

  if (!discount) {
    throw new PageNotFoundError('Error getting discount from Dynamo Table.')
  }
  callback(null, createResponse(200, { discount }))
}
