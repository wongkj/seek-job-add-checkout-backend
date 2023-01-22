const { createDiscount, getDiscount } = require('./discount');
const { checkDiscountObject: mockCheckDiscountObject } = require('../common/utils');
const DynamoDB = require('../common/Dynamo')

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
    test('successfully getting an ad returns a 200 Ok', async () => {
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
    test('checkAdObject returning a false returns a 400 Bad Request', async () => {
      const expectedResponse = {
        statusCode: 400,
        statusType: 'Bad Request',
        body: JSON.stringify({ message: 'Discount properties were incorrect. Cannot create new discount.' })        
      }      
      mockCheckDiscountObject.mockReturnValue(false)
      const response = await createDiscount(eventReducedCharge)
      expect(response).toMatchObject(expectedResponse)

    })
    test('incorrect HTTP Method returns a 405 Method Not Allowed', async () => {
      const eventNotPostMethod = {
        ...eventReducedCharge,
        httpMethod: 'GET'
      }
      const expectedResponse = {
        statusCode: 405,
        statusType: 'Method Not Allowed',
        body: JSON.stringify({ message: 'Must use POST Method to add a discount.' })
      }
      const response = await createDiscount(eventNotPostMethod)
      expect(response).toMatchObject(expectedResponse)

    })
    test('put action in the Dynamo adTable causing an error then 500 Internal Server Error is returned', async () => {
      expect(DynamoDB).not.toHaveBeenCalled()
      const dynamodb = new DynamoDB(tableName)
      mockCheckDiscountObject.mockReturnValue(true)
      dynamodb.insertItem = jest.fn()
      dynamodb.insertItem.mockImplementation(() => {
        throw new Error()
      })
      const expectedResponse = {
        statusCode: 500,
        statusType: 'Internal Server Error',
        body: JSON.stringify({ message: 'Error inserting item into Dynamo Table' })        
      }
      expect(DynamoDB).toHaveBeenCalledTimes(1)
      const response = await createDiscount(eventReducedCharge)
      expect(response).toMatchObject(expectedResponse)

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
      const expectedResponse = {
        statusCode: 405,
        statusType: 'Method Not Allowed',
        body: JSON.stringify({ message: 'Must use GET Method to get a discount.' })        
      }     
      const response = await getDiscount(eventNotGetMethod)
      expect(response).toMatchObject(expectedResponse)
    })
    test('no id returns a 400 Bad Request.', async () => {
      const eventNoId = {
        ...event,
        pathParameters: null
      }
      const expectedResponse = {
        statusCode: 400,
        statusType: 'Bad Request',
        body: JSON.stringify({ message: 'Missing the id from the path.' })        
      }     
      const response = await getDiscount(eventNoId)
      expect(response).toMatchObject(expectedResponse)
    })    
    test('get action in the Dynamo discountTable causing an error then 500 Internal Server Error is returned', async () => {
      expect(DynamoDB).not.toHaveBeenCalled()
      const dynamodb = new DynamoDB(tableName)
      mockCheckDiscountObject.mockReturnValue(true)
      dynamodb.getItem = jest.fn()
      dynamodb.getItem.mockImplementation(() => {
        throw new Error()
      })
      const expectedResponse = {
        statusCode: 500,
        statusType: 'Internal Server Error',
        body: JSON.stringify({ message: 'Error getting discount from Dynamo Table.' })        
      }
      expect(DynamoDB).toHaveBeenCalledTimes(1)
      const response = await getDiscount(event)
      expect(response).toMatchObject(expectedResponse)

    })
  })
})
