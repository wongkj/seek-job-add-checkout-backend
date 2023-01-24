const { calculateSale } = require('./sale');
const { checkSaleObject: mockCheckSaleObject } = require('../common/utils');
const DynamoDB = require('../common/Dynamo');
const { MethodIncorrectError, BadRequestError, PageNotFoundError, InternalServerError } = require('../common/errors')

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
    beforeEach(() => {
      jest.resetAllMocks()
    })    
    test('successfully calculating a sale returns a 200 Ok', async () => {
      // const expectedResponse = {
      //   statusCode: 200,
      //   statusType: 'OK',
      //   body: JSON.stringify({ message: 'Successfully inserted new Ad into the Ad Table.' })        
      // }      
      // mockCheckAdObject.mockReturnValue(true)
      // const dynamodb = new DynamoDB(tableName)
      // dynamodb.insertItem = jest.fn()
      // dynamodb.insertItem.mockReturnValue(() => 1)
      // const response = await createAd(event)
      // expect(response).toMatchObject(expectedResponse)
    })
  })
  describe('failed to get an existing ad from the adTable', () => {
    beforeEach(() => {
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

    test('put action in the Dynamo adTable causing an error then 500 Internal Server Error is returned', async () => {
      expect(DynamoDB).not.toHaveBeenCalled()
      const dynamodb = new DynamoDB(tableName)
      mockCheckSaleObject.mockReturnValue(true)
      dynamodb.insertItem = jest.fn()
      dynamodb.insertItem.mockImplementation(() => {
        throw new Error()
      })
      expect(DynamoDB).toHaveBeenCalledTimes(1)
      await expect(calculateSale(event)).rejects.toThrow(new InternalServerError('Sale properties were incorrect. Cannot calculate the sale.'))
    })
  })
})
