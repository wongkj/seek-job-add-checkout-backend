const Responses = require('../common/Responses');
const { checkDiscountObject } = require('../common/utils');
const DynamoDB = require('../common/Dynamo');

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

module.exports.createDiscount = async event => {
  if (event.httpMethod !== 'POST') {
    return Responses._405({ message: 'Must use POST Method to add a discount.' })
  }
  const discount = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  const validDiscountObject = checkDiscountObject(discount)
  if (!validDiscountObject) {
    return Responses._400({ message: 'Discount properties were incorrect. Cannot create new discount.' })
  }
  const dynamo = new DynamoDB(discountTable)
  const doesCompanyExist = await dynamo.scanDiscounts(discount)
  console.log(`doesCompanyExist: ${JSON.stringify(doesCompanyExist, null, 2)}`)

  let response

  if (doesCompanyExist.Count === 0) {
    response = await dynamo.insertItem(discount)
  } else {
    const discountId = getDiscountIdIfAdTypeExists(doesCompanyExist, discount)
    response = discountId === '' ? await dynamo.insertItem(discount) : await dynamo.updateItems(discountId, discount)
  }
  
  if (!response) {
    return Responses._500({ message: 'Error inserting item into Dynamo Table' })
  }
  return Responses._200({ message: 'Successfully inserted new Discount into the Discount Table.' })
}

module.exports.getDiscount = async event => {
  if (event.httpMethod !== 'GET') {
    return Responses._405({ message: 'Must use GET Method to get a discount.' })
  }
  if (!event.pathParameters || !event.pathParameters.id) {
    return Responses._400({ message: 'Missing the id from the path.' });
  }
  console.log(`id: ${event.pathParameters.id}`)
  const { id } = event.pathParameters
  const dynamo = new DynamoDB(discountTable)
  const discount = await dynamo.getItem(id)

  if (!discount) {
    return Responses._500({ message: 'Error getting discount from Dynamo Table.' })
  }
  return Responses._200({ discount })
}
