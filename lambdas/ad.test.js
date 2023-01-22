const { createAd } = require('./ad');
const { checkAdObject: mockCheckAdObject } = require('../common/utils');
const DynamoDB = require('../common/Dynamo')

jest.mock('../common/utils')
jest.mock('../common/Dynamo')


describe('createAd', () => {
  beforeEach(() => {

  })
  describe('successfully creating a new ad in the adTable', () => {
    test('correct arguments returns a 200 Ok', () => {

    })
  })
  describe('failed to create a new ad in the adTable', () => {
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

    beforeEach(() => {
      jest.resetAllMocks()
    })
    test('checkAdObject returning a false returns a 400 Bad Request', async () => {
      const expectedResponse = {
        statusCode: 400,
        statusType: 'Bad Request',
        body: JSON.stringify({ message: 'Ad properties were incorrect. Cannot add user to database.' })        
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
        body: JSON.stringify({ message: 'Must use POST Method to add a user.' })
      }
      const response = await createAd(eventNotPostMethod)
      expect(response).toMatchObject(expectedResponse)

    })
    test('put action in the Dynamo adTable causing an error then 500 Internal Server Error is returned', async () => {
      mockCheckAdObject.mockReturnValue(true)
      DynamoDB.insertItem = jest.fn()
      DynamoDB.insertItem.mockImplementation(() => {
        throw new Error()
      })
      const expectedResponse = {
        statusCode: 500,
        statusType: 'Internal Server Error',
        body: JSON.stringify({ message: 'Error sending message to SQS queue' })        
      }         
      const response = createAd(event)
      expect(response).toMatchObject(expectedResponse)

    })
  })
})
