const { checkAdObject } = require('./utils')

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
