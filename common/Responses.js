const Responses = {
    _200(data = {}) {
      return {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 200,
        statusType: 'Ok',
        statusDescription: 'Standard response for successful HTTP request',
        body: JSON.stringify(data)
      }
    },
    _201(data = {}) {
      return {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 201,
        statusType: 'Created',
        statusDescription: 'Request fulfilled. New resource created.',
        body: JSON.stringify(data)
      }
    },
    _202(data = {}) {
      return {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 202,
        statusType: 'Accepted',
        statusDescription: 'Request has been accepted but processing not completed.',
        body: JSON.stringify(data)
      }
    },
    _204(data = {}) {
      return {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 204,
        statusType: 'No Content',
        statusDescription: 'Request processed. No content returned.',
        body: JSON.stringify(data)
      }
    },    
    _400(data = {}) {
      return {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 400,
        statusType: 'Bad Request',
        statusDescription: 'Cannot process request due to client error.',
        body: JSON.stringify(data)
      }
    },
    _401(data = {}) {
      return {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 401,
        statusType: 'Unauthorized',
        statusDescription: 'Authentication is required but failed.',
        body: JSON.stringify(data)
      }
    },
    _403(data = {}) {
      return {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 403,
        statusType: 'Forbidden',
        statusDescription: 'Permissions required or prohibited action.',
        body: JSON.stringify(data)
      }
    },
    _404(data = {}) {
      return {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 404,
        statusType: 'Not Found',
        statusDescription: 'Requested resource could not be found.',
        body: JSON.stringify(data)
      }
    },
    _405(data = {}) {
      return {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 405,
        statusType: 'Method Not Allowed',
        statusDescription: 'Request Method not supported for the requested resource.',
        body: JSON.stringify(data)
      }
    },
    _500(data = {}) {
      return {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 500,
        statusType: 'Internal Server Error',
        statusDescription: 'Generic Error Message. Unexpected condition was encountered while trying to process request',
        body: JSON.stringify(data)
      }
    }   
  }
  
  module.exports = Responses;
  