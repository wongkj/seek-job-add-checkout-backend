const { checkAdObject, checkDiscountObject, checkSaleObject, getDiscountIdIfAdTypeExists, computeSale } = require('./utils')

describe('checkAdObject', () => {
  const ad = {
    name: 'New Ad Type',
    price: 400.00,
    description: 'This is a new ad type.'
  }
  test('correct ad object returns a true', () => {
    const result = checkAdObject(ad)
    expect(result).toBeTruthy()
  })
  test('incorrect ad object returns a false', () => {
    const incorrectAd = {
      favouriteColour: 'black',
      nickName: 'wongkj',
      statement: 'hello world'
    }
    const result = checkAdObject(incorrectAd)
    expect(result).toBeFalsy()
  })
})

describe('checkDiscountObject', () => {
  const reducedChargeDiscount = {
    companyName: 'NAB',
    discountType: 'Reduced Charge',
    adType: "Classic Ad",
    qtyBought: 3,
    qtyCharged: 2
  }
  const reducedPriceDiscount = {
    companyName: 'NAB',
    discountType: 'Reduced Price',
    adType: "Classic Ad",
    newPrice: 300.00
  }
  const incorrectDiscountObject = {
    companyName: 'NAB',
    discountType: 'Reduced Charge',
    adType: "Classic Ad",
    errorPrice: 300.00
  }
  test('correct reduced charge discount object returns a true', () => {
    const result = checkDiscountObject(reducedChargeDiscount)
    expect(result).toBeTruthy()
  })
  test('correct reduced price discount object returns a true', () => {
    const result = checkDiscountObject(reducedPriceDiscount)
    expect(result).toBeTruthy()
  })
  test('incorrect discount object returns a false', () => {
    const result = checkDiscountObject(incorrectDiscountObject)
    expect(result).toBeFalsy()
  })
  test('incorrect discountType data type returns a false', () => {
    const errorReducedChargeDiscount = {
      companyName: 'NAB',
      discountType: 1,
      adType: "Classic Ad",
      qtyBought: 3,
      qtyCharged: 2
    }
    const result = checkDiscountObject(errorReducedChargeDiscount)
    expect(result).toBeFalsy()
  })
  test('incorrect qtyBought data type returns a false', () => {
    const errorReducedChargeDiscount = {
      companyName: 'NAB',
      discountType: "Reduced Charge",
      adType: "Classic Ad",
      qtyBought: '3',
      qtyCharged: 2
    }
    const result = checkDiscountObject(errorReducedChargeDiscount)
    expect(result).toBeFalsy()
  })
})

describe('checkSaleObject', () => {
  const sale = {
    companyName: 'NAB',
    adType: "Classic Ad",
    qty: 3
  }
  test('correct sale object returns a true', () => {
    const result = checkSaleObject(sale)
    expect(result).toBeTruthy()
  })
  test('incorrect sale object returns a false', () => {
    const incorrectSale = {
      companyName: 'NAB',
      adType: "Classic Ad",
      qty: "3"
    }
    const result = checkSaleObject(incorrectSale)
    expect(result).toBeFalsy()
  })
})

describe('getDiscountIdIfAdTypeExists', () => {

  const doesItemExist = {
    Items: [
      {
        companyName: "Coles",
        discountType: "Reduced Price",
        adType: "Classic Ad",
        qtyBought: 4,
        qtyCharged: 2,
        id: '1111111111'
    }
    ],
    Count: 1
  }

  const discountObj = {
    companyName: "Coles",
    discountType: "Reduced Price",
    adType: "Classic Ad",
    qtyBought: 5,
    qtyCharged: 3
  }

  describe('success', () => {
    test('the discount id is returned when there item does exist', () => {
      const result = getDiscountIdIfAdTypeExists(doesItemExist, discountObj)
      expect(result).toBe('1111111111')
    })
  })

  describe('failure', () => {
    const discountPremiumAd = {
      ...discountObj,
      adType: "Premium Ad"
    }
    test('the discount id is not returned when the item does not exist', () => {
      const result = getDiscountIdIfAdTypeExists(doesItemExist, discountPremiumAd)
      expect(result).toBe("")
    })
  })
})
