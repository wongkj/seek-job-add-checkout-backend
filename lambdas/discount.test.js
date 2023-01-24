const { createDiscount, getDiscount } = require('./discount');
const { checkDiscountObject: mockCheckDiscountObject } = require('../common/utils');
const DynamoDB = require('../common/Dynamo');
const { MethodIncorrectError, BadRequestError, PageNotFoundError, InternalServerError } = require('../common/errors')

jest.mock('../common/utils')
jest.mock('../common/Dynamo')

describe('createDiscount', () => {
  const tableName = 'discountTable'
  const eventReducedCharge = {
    resource: '/',
    path: '/ad',
    httpMethod: 'POST',
    body: {
        companyName: 'NAB',
        adType: "Classic Ad",
        qty: 7
    },
    queryStringParameters: null,
    pathParameters: null
  }  
  describe('successfully created a Discount', () => {
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
  describe('failed to create a Discount', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    test('checkDiscountObject returning a false returns a 400 Bad Request', async () => {
      mockCheckDiscountObject.mockReturnValue(false)
      await expect(createDiscount(eventReducedCharge)).rejects.toThrow(new BadRequestError("Discount properties were incorrect. Cannot create new discount."))
    })
    test('incorrect HTTP Method returns a 405 Method Not Allowed', async () => {
      const eventNotPostMethod = {
        ...eventReducedCharge,
        httpMethod: 'GET'
      }
      await expect(createDiscount(eventNotPostMethod)).rejects.toThrow(new MethodIncorrectError('Must use POST Method to add a discount.'))
    })
    test.only('put action in the Dynamo adTable causing an error then 500 Internal Server Error is returned', async () => {

      expect(DynamoDB).not.toHaveBeenCalled();

      const dynamodb = new DynamoDB(tableName)
      mockCheckDiscountObject.mockReturnValue(true)
      dynamodb.scanDiscounts = jest.fn()
      dynamodb.scanDiscounts.mockImplementation(() => {
        () => {
          return { Count: 1 }
        }
      })
      dynamodb.insertItem = jest.fn()
      dynamodb.insertItem.mockImplementation(() => {
        throw new Error()
      })
      expect(DynamoDB).toHaveBeenCalledTimes(1)
      await expect(createDiscount(eventReducedCharge)).rejects.toThrow(new InternalServerError("Discount properties were incorrect. Cannot create new discount."))

    })
  })
})

describe('getDiscount', () => {
  const tableName = 'discountTable'
  const event = {
    resource: '/',
    path: '/discount',
    httpMethod: 'GET',
    queryStringParameters: null,
    pathParameters: {
      id: "112233"
    }
  }  
  describe('successfully creating a new discount in the discountTable', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })    
    test('correct arguments returns a 200 Ok', async () => {
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
  describe('failed to get discount from discountTable', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    test('incorrect HTTP Method returns a 405 Method Not Allowed', async () => {
      const eventNotGetMethod = {
        ...event,
        httpMethod: 'POST'
      }
      await expect(getDiscount(eventNotGetMethod)).rejects.toThrow(new MethodIncorrectError("Must use GET Method to get a discount."))
    })
    test('no id returns a 400 Bad Request.', async () => {
      const eventNoId = {
        ...event,
        pathParameters: null
      }
      await expect(getDiscount(eventNoId)).rejects.toThrow(new BadRequestError("Missing the id from the path."))
    })    
    test('get action in the Dynamo discountTable causing an error then 500 Internal Server Error is returned', async () => {
      expect(DynamoDB).not.toHaveBeenCalled()
      const dynamodb = new DynamoDB(tableName)
      mockCheckDiscountObject.mockReturnValue(true)
      dynamodb.getItem = jest.fn()
      dynamodb.getItem.mockImplementation(() => {
        throw new Error()
      })
      expect(DynamoDB).toHaveBeenCalledTimes(1)
      await expect(getDiscount(event)).rejects.toThrow(new PageNotFoundError("Error getting discount from Dynamo Table."))
    })
  })
})
