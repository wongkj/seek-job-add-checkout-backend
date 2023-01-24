const { checkAdObject, createResponse } = require('../common/utils');
const DynamoDB = require('../common/Dynamo');
const { MethodIncorrectError, BadRequestError, PageNotFoundError, InternalServerError } = require('../common/errors')

const adTable = process.env.AD_TABLE

module.exports.createAd = async (event, context, callback) => {

  if (event.httpMethod !== 'POST') throw new MethodIncorrectError('Must use POST Method to add an add.')

  const ad = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  const validAdObject = checkAdObject(ad)
  if (!validAdObject) throw new BadRequestError('Ad properties were incorrect. Cannot create new ad.')

  const dynamo = new DynamoDB(adTable)
  const res = await dynamo.insertItem(ad)

  if (!res) throw new InternalServerError('Error inserting item into Dynamo Table')

  callback(null, createResponse(200, { message: 'Successfully inserted new Ad into the Ad Table.' }))
}


module.exports.getAd = async (event, context, callback) => {

  if (event.httpMethod !== 'GET') throw new MethodIncorrectError('Must use GET Method to get an add.')
  if (!event.pathParameters || !event.pathParameters.id) throw new BadRequestError('Missing the id from the path.')
  
  const { id } = event.pathParameters
  const dynamo = new DynamoDB(adTable)
  const ad = await dynamo.getItem(id)

  if (!ad) throw new PageNotFoundError('Error getting ad from Dynamo Table.')
  callback(null, createResponse(200, { ad }))

}