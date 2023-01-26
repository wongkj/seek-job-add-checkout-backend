const { createDiscount, getDiscount } = require('./discount');
const { checkDiscountObject: mockCheckDiscountObject, getDiscountIdIfAdTypeExists: mockGetDiscountIdIfAdTypeExists } = require('../common/utils');
const DynamoDB = require('../common/Dynamo');
const { MethodIncorrectError, BadRequestError, PageNotFoundError } = require('../common/errors')

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

    let insertItemMock
    let scanDiscountsMock
    let updateItemMock
  
    beforeEach(() => {

      insertItemMock = jest
      .spyOn(DynamoDB.prototype, 'insertItem')
      .mockImplementation(() => {
        return true
      });

      scanDiscountsMock = jest
      .spyOn(DynamoDB.prototype, 'scanDiscounts')
      .mockImplementation(() => {
        return true
      })

      updateItemsMock = jest
      .spyOn(DynamoDB.prototype, 'updateItems')
      .mockImplementation(() => {
        return true
      })      
    })    

    afterEach(() => {
      jest.resetAllMocks()
    })

    test('createDiscount successfully completes', async () => {
      mockCheckDiscountObject.mockReturnValue(true)
      mockGetDiscountIdIfAdTypeExists.mockReturnValue(true)
      const context = {}
      const callback = jest.fn()
      const dynamodb = new DynamoDB(tableName)
      dynamodb.insertItem();
      dynamodb.scanDiscounts();
      dynamodb.updateItems();
      expect(scanDiscountsMock).toHaveBeenCalled()
      expect(insertItemMock).toHaveBeenCalled()
      expect(updateItemsMock).toHaveBeenCalled()
      await createDiscount(eventReducedCharge, context, callback)
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

    test('getDiscount successfully completes', async () => {
      mockCheckDiscountObject.mockReturnValue(true)
      const context = {}
      const callback = jest.fn()
      const dynamodb = new DynamoDB(tableName)
      dynamodb.getItem();
      expect(getItemMock).toHaveBeenCalled()
      await getDiscount(event, context, callback)
    })

  })
  describe('failed to get discount from discountTable', () => {
    afterEach(() => {
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
