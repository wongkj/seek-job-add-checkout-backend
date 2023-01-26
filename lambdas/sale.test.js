const { calculateSale } = require('./sale');
const { checkSaleObject: mockCheckSaleObject, computeSale: mockComputeSale } = require('../common/utils');
const DynamoDB = require('../common/Dynamo');
const { MethodIncorrectError, BadRequestError } = require('../common/errors')

jest.mock('../common/utils')
jest.mock('../common/Dynamo')


describe('calculateSale', () => {
  const tableName = 'discountTable'
  const event = {
    resource: '/',
    path: '/sale',
    httpMethod: 'POST',
    body: {
        companyName: 'NAB',
        discountType: 'Reduced Charge',
        adType: "Classic Ad",
        qtyBought: 3,
        qtyCharged: 2
    },
    queryStringParameters: null,
    pathParameters: null
  }  
  describe('successfully creating a new ad in the adTable', () => {

    let scanAdsMock
    let scanDiscountsMock
  
    beforeEach(() => {

      scanAdsMock = jest
      .spyOn(DynamoDB.prototype, 'scanAds')
      .mockImplementation(() => {
        return {
          Items: []
        }
      });

      scanDiscountsMock = jest
      .spyOn(DynamoDB.prototype, 'scanDiscounts')
      .mockImplementation(() => {
        return {
          Items: []
        }
      });

    })   

    afterEach(() => {
      jest.resetAllMocks()
    })

    test('calculateSale successfully completes', async () => {
      mockCheckSaleObject.mockReturnValue(true)
      mockComputeSale.mockReturnValue(1)
      const context = {}
      const callback = jest.fn()
      const dynamodb = new DynamoDB(tableName)
      dynamodb.scanAds();
      dynamodb.scanDiscounts();
      expect(scanAdsMock).toHaveBeenCalled()
      expect(scanDiscountsMock).toHaveBeenCalled()
      await calculateSale(event, context, callback)
    })
  })

  describe('failed to get an existing ad from the adTable', () => {

    afterEach(() => {
      jest.resetAllMocks()
    })
  
    test('checkSaleObject returning a false returns a 400 Bad Request', async () => {
      mockCheckSaleObject.mockReturnValue(false)
      await expect(calculateSale(event)).rejects.toThrow(new BadRequestError('Sale properties were incorrect. Cannot calculate the sale.'))
    })
    test('incorrect HTTP Method returns a 405 Method Not Allowed', async () => {
      const eventNotPostMethod = {
        ...event,
        httpMethod: 'GET'
      }
      await expect(calculateSale(eventNotPostMethod)).rejects.toThrow(new MethodIncorrectError('Must use POST Method to calculate.'))
    })
  })
})
