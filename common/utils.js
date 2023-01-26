
const checkAdObject = ad => {
  let result = true
  const keys = ['name', 'price', 'description']
  Object.entries(ad).forEach(([key, value], index) => {
    if (!keys.includes(key)) result = false
    if ((key === 'name' || key === 'description') && typeof value !== 'string') result = false
    if (key === 'price' && typeof value !== 'number') result = false
  })
  return result
}

const checkDiscountObject = discount => {
  if (!discount.discountType) return false;
  const { discountType } = discount;
  let result = true
  const reducedChargeKeys = ['companyName', 'discountType', 'adType', 'qtyBought', 'qtyCharged']
  const reducedPriceKeys = ['companyName', 'discountType', 'adType', 'newPrice']
  switch (discountType) {
    case 'Reduced Charge':
      Object.entries(discount).forEach(([key, value], index) => {
        if (!reducedChargeKeys.includes(key)) result = false
        if ((key === 'discountType' || key === 'adType') && typeof value !== 'string') result = false
        if ((key === 'qtyBought' || key === 'qtyCharged') && typeof value !== 'number') result = false
      })
      break;
    case 'Reduced Price':
      Object.entries(discount).forEach(([key, value], index) => {
        if (!reducedPriceKeys.includes(key)) result = false
        if ((key === 'discountType' || key === 'adType') && typeof value !== 'string') result = false
        if (key === 'newPrice' && typeof value !== 'number') result = false
      })      
      break;      
    default:
      result = false
      break;
  }
  return result
}

const checkSaleObject = sale => {
  let result = true
  const keys = ['companyName', 'adType', 'qty']
  Object.entries(sale).forEach(([key, value], index) => {
    if (!keys.includes(key)) result = false
    if ((key === 'companyName' || key === 'adType') && typeof value !== 'string') result = false
    if (key === 'qty' && typeof value !== 'number') result = false
  })
  return result
}

const getDiscountIdIfAdTypeExists = ({ Items }, discount) => {
  let discountId = ''
  Items.forEach(item => {
    if (item.adType === discount.adType) {
      discountId = item.id
    }
  })
  return discountId
}

const computeSale = (sale, ads, discounts = null) => {
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

const createResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }  
}

module.exports = { checkAdObject, checkDiscountObject, checkSaleObject, createResponse, getDiscountIdIfAdTypeExists, computeSale }