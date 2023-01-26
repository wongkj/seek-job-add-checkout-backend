const { checkSaleObject, createResponse, computeSale } = require('../common/utils');
const DynamoDB = require('../common/Dynamo');
const { MethodIncorrectError, BadRequestError, PageNotFoundError } = require('../common/errors')

const discountTable = process.env.DISCOUNT_TABLE
const adTable = process.env.AD_TABLE

module.exports.calculateSale = async (event, context, callback) => {
  if (event.httpMethod !== 'POST') {
    throw new MethodIncorrectError('Must use POST Method to calculate.')
  }
  // Check event object to match structure
  const sale = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  const validSaleObject = checkSaleObject(sale)
  if (!validSaleObject) {
    throw new BadRequestError('Sale properties were incorrect. Cannot calculate the sale.')
  }

  // Search for the ad type
  const dynamoAd = new DynamoDB(adTable)
  const ads = await dynamoAd.scanAds(sale)

  if (!ads.Items) {
    throw new PageNotFoundError('Sale properties were incorrect. Cannot calculate the sale.')
  }

  const dynamoDiscount = new DynamoDB(discountTable)
  const discounts = await dynamoDiscount.scanDiscounts(sale)

  let totalPrice

  if (ads.Count != 0) {
    if (discounts.Count > 0) {                            
      totalPrice = computeSale(sale, ads, discounts)
    } else {
      totalPrice = computeSale(sale, ads)
    }
  }

  callback(null, createResponse(200, { totalPrice }))
}