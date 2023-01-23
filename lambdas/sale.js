const Responses = require('../common/Responses');
const { checkSaleObject } = require('../common/utils');
const DynamoDB = require('../common/Dynamo');

const discountTable = process.env.DISCOUNT_TABLE
const adTable = process.env.AD_TABLE

const calculateSale = (sale, ads, discounts = null) => {
  let price
  if (!discounts) {
    ads.Items.forEach(ad => {
      if (sale.adType === ad.name) {
        price =  sale.qty * ad.price
      }
    })    
  } else {
    discounts.Items.forEach(discount => {
      if (discount.adType === sale.adType) {
        discounts.Items.forEach(discount => {
          if (discount.adType === sale.adType) {
            price = discount.discountType === "Reduced Price" ? sale.qty * discount.newPrice : (Math.floor(qty / qtyBought) * qtyCharged) + (qty % qtyBought)
          }
        })
      }
    })
  }
  return price
}

module.exports.calculateSale = async event => {
  if (event.httpMethod !== 'POST') {
    return Responses._405({ message: 'Must use POST Method to calculate.' })
  }
  // Check event object to match structure
  const sale = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  const validSaleObject = checkSaleObject(sale)
  if (!validSaleObject) {
    return Responses._400({ message: 'Sale properties were incorrect. Cannot calculate the sale.' })
  }

  // Search for the ad type
  const dynamoAd = new DynamoDB(adTable)
  const ads = await dynamoAd.scanAds(sale)

  if (!ads.Items) {
    return Responses._400({ message: 'No ads of that type are being sold.' })
  }

  const dynamoDiscount = new DynamoDB(discountTable)
  const discounts = await dynamoDiscount.scanDiscounts(sale)

  let totalPrice

  if (ads.Count != 0) {
    if (discounts.Count > 0) {
      totalPrice = calculateSale(sale, ads, discounts)
    } else {
      totalPrice = calculateSale(sale, ads)
    }
  }

  return Responses._200({ totalPrice })
}