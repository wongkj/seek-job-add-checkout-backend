const { createAd, getAd } = require('./ad');
const { checkAdObject: mockCheckAdObject } = require('../common/utils');
const DynamoDB = require('../common/Dynamo')
const { MethodIncorrectError, BadRequestError, PageNotFoundError, InternalServerError } = require('../common/errors')

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

    let insertItemMock
  
    beforeEach(() => {
      insertItemMock = jest
      .spyOn(DynamoDB.prototype, 'insertItem')
      .mockImplementation(() => {
        return true
      });
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    test('createAd successfully completes', async () => {
      mockCheckAdObject.mockReturnValue(true)
      const context = {}
      const callback = jest.fn()
      const dynamodb = new DynamoDB(tableName)
      dynamodb.insertItem();
      expect(insertItemMock).toHaveBeenCalled()
      await createAd(event, context, callback)
    })
  })

  describe('failed to get an existing ad from the adTable', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    test('checkAdObject returning a false returns a 400 Bad Request', async () => {
      mockCheckAdObject.mockReturnValue(false)
      await expect(createAd(event)).rejects.toThrow(new BadRequestError("Ad properties were incorrect. Cannot create new ad."))
    })
    test('incorrect HTTP Method returns a 405 Method Not Allowed', async () => {
      const eventNotPostMethod = {
        ...event,
        httpMethod: 'GET'
      }
      await expect(createAd(eventNotPostMethod)).rejects.toThrow(new MethodIncorrectError("Must use POST Method to add an add."))
    })
    test('put action in the Dynamo adTable causing an error then 500 Internal Server Error is returned', async () => {
      expect(DynamoDB).not.toHaveBeenCalled()
      const dynamodb = new DynamoDB(tableName)
      mockCheckAdObject.mockReturnValue(true)
      dynamodb.insertItem = jest.fn()
      dynamodb.insertItem.mockImplementation(() => {
        throw new Error()
      })
      expect(DynamoDB).toHaveBeenCalledTimes(1)
      await expect(createAd(event)).rejects.toThrow(new InternalServerError("Error inserting item into Dynamo Table"))

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
  describe('successfully getting an ad from the adTable', () => {

    let getItemMock
  
    beforeEach(() => {
      getItemMock = jest
      .spyOn(DynamoDB.prototype, 'getItem')
      .mockImplementation(() => {
        return true
      });      
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    test('getAd successfully completes', async () => {
      mockCheckAdObject.mockReturnValue(true)
      const context = {}
      const callback = jest.fn()
      const dynamodb = new DynamoDB(tableName)
      dynamodb.getItem();
      expect(getItemMock).toHaveBeenCalled()
      await getAd(event, context, callback)
    })
  })
  describe('failed to get ad from adTable', () => {

    afterEach(() => {
      jest.resetAllMocks()
    })

    test('incorrect HTTP Method returns a 405 Method Not Allowed', async () => {
      const eventNotGetMethod = {
        ...event,
        httpMethod: 'POST'
      }
      await expect(getAd(eventNotGetMethod)).rejects.toThrow(new MethodIncorrectError("Must use GET Method to get an add."))
    })
    test('no id returns a 400 Bad Request.', async () => {
      const eventNoId = {
        ...event,
        pathParameters: null
      }
      await expect(getAd(eventNoId)).rejects.toThrow(new BadRequestError("Missing the id from the path."))
    })    
    test('get action in the Dynamo adTable causing an error then 500 Internal Server Error is returned', async () => {  
      expect(DynamoDB).not.toHaveBeenCalled()
      const dynamodb = new DynamoDB(tableName)
      mockCheckAdObject.mockReturnValue(true)
      dynamodb.getItem = jest.fn()
      dynamodb.getItem.mockImplementation(() => {
        throw new Error()
      })
      expect(DynamoDB).toHaveBeenCalledTimes(1)
      await expect(getAd(event)).rejects.toThrow(new PageNotFoundError("Error getting ad from Dynamo Table."))
    })
  })
})
