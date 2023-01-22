const { createAd } = require('./ad');

describe('createAd', () => {
  beforeEach(() => {

  })
  describe('successfully creating a new ad in the adTable', () => {
    test('correct arguments returns a 200 Ok', () => {

    })
  })
  describe('failed to create a new ad in the adTable', () => {

    beforeEach(() => {

    })
    test('checkAdObject returning a false returns a 400 Bad Request', () => {

    })
    test('incorrect HTTP Method returns a 405 Method Not Allowed', () => {

    })
    test('put action in the Dynamo adTable causing an error then 500 Internal Server Error is returned', () => {

    })
  })
})
