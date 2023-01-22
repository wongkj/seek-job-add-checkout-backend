
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

module.exports = { checkAdObject, checkDiscountObject, checkSaleObject }