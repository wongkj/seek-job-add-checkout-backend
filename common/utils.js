
const checkAdObject = ad => {
  let result = true
  const keys = ['name', 'price', 'description']
  Object.entries(ad).forEach(([key, value], index) => {
    if (!keys.includes(key)) result = false
    if ((key === 'name' || key === 'description') && typeof value !== 'string') result = false
    if (key === 'price' && typeof value !== 'number') result = false
  })
  console.log(`result: ${result}`)
  return result
}

const checkDiscountObject = discount => {
  console.log(`I was hit 1`)
  if (!discount.discountType) return false;
  console.log(`I was hit 2`)
  const { discountType } = discount;
  let result = true
  const reducedChargeKeys = ['companyName', 'discountType', 'adType', 'qtyBought', 'qtyCharged']
  const reducedPriceKeys = ['companyName', 'discountType', 'adType', 'newPrice']
  switch (discountType) {
    case 'Reduced Charge':
      Object.entries(discount).forEach(([key, value], index) => {
        if (!reducedChargeKeys.includes(key)) result = false
        console.log(`result wong 1: ${result}`)
        if ((key === 'discountType' || key === 'adType') && typeof value !== 'string') result = false
        console.log(`result wong 2: ${result}`)
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
  console.log(`result: ${result}`)
  return result
}

module.exports = { checkAdObject, checkDiscountObject }