const { createAd, getAd } = require('./ad');
const { checkAdObject: mockCheckAdObject } = require('../common/utils');
const DynamoDB = require('../common/Dynamo')

jest.mock('../common/utils')
jest.mock('../common/Dynamo')


describe('createAd', () => {
  const tableName = 'adTable'
  const event = {
    resource: '/',
    path: '/ad',
    httpMethod: 'POST',
    body: {
        name: 'New Ad Type',
        price: 400.00,
        description: 'This is a new ad type.'
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
        body: JSON.stringify({ message: 'Ad properties were incorrect. Cannot create new ad.' })        
      }      
      mockCheckAdObject.mockReturnValue(false)
      const response = await createAd(event)
      expect(response).toMatchObject(expectedResponse)

    })
    test('incorrect HTTP Method returns a 405 Method Not Allowed', async () => {
      const eventNotPostMethod = {
        ...event,
        httpMethod: 'GET'
      }
      const expectedResponse = {
        statusCode: 405,
        statusType: 'Method Not Allowed',
        body: JSON.stringify({ message: 'Must use POST Method to add an add.' })
      }
      const response = await createAd(eventNotPostMethod)
      expect(response).toMatchObject(expectedResponse)

    })
    test('put action in the Dynamo adTable causing an error then 500 Internal Server Error is returned', async () => {
      expect(DynamoDB).not.toHaveBeenCalled()
      const dynamodb = new DynamoDB(tableName)
      mockCheckAdObject.mockReturnValue(true)
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
      const response = await createAd(event)
      expect(response).toMatchObject(expectedResponse)

    })
  })
})

describe('getAd', () => {
  const tableName = 'adTable'
  const event = {
    resource: '/',
    path: '/ad',
    httpMethod: 'GET',
    queryStringParameters: null,
    pathParameters: {
      id: "112233"
    }
  }  
  describe('successfully creating a new ad in the adTable', () => {
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
  describe('failed to get ad from adTable', () => {
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
        body: JSON.stringify({ message: 'Must use GET Method to get an add.' })        
      }     
      const response = await getAd(eventNotGetMethod)
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
      const response = await getAd(eventNoId)
      expect(response).toMatchObject(expectedResponse)
    })    
    test('get action in the Dynamo adTable causing an error then 500 Internal Server Error is returned', async () => {
      expect(DynamoDB).not.toHaveBeenCalled()
      const dynamodb = new DynamoDB(tableName)
      mockCheckAdObject.mockReturnValue(true)
      dynamodb.getItem = jest.fn()
      dynamodb.getItem.mockImplementation(() => {
        throw new Error()
      })
      const expectedResponse = {
        statusCode: 500,
        statusType: 'Internal Server Error',
        body: JSON.stringify({ message: 'Error getting ad from Dynamo Table.' })        
      }
      expect(DynamoDB).toHaveBeenCalledTimes(1)
      console.log(`event jason: ${JSON.stringify(event, null, 2)}`)
      const response = await getAd(event)
      expect(response).toMatchObject(expectedResponse)

    })
  })
})
