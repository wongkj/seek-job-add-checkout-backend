const Responses = require('../common/Responses');
const { checkAdObject, createResponse } = require('../common/utils');
const DynamoDB = require('../common/Dynamo');

const adTable = process.env.AD_TABLE

module.exports.createAd = async (event, context, callback) => {

  if (event.httpMethod !== 'POST') {
    callback(null, createResponse(405, { message: 'Must use POST Method to add an add.' }))
  }
  const ad = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  const validAdObject = checkAdObject(ad)
  if (!validAdObject) {
    callback(null, createResponse(400, { message: 'Ad properties were incorrect. Cannot create new ad.' }))
  }
  const dynamo = new DynamoDB(adTable)
  const res = await dynamo.insertItem(ad)

  if (!res) {
    callback(null, createResponse(500, { message: 'Error inserting item into Dynamo Table' }))
  }
  callback(null, createResponse(200, { message: 'Successfully inserted new Ad into the Ad Table.' }))
}

module.exports.getAd = async (event, context, callback) => {

  if (event.httpMethod !== 'GET') {
    callback(null, createResponse(405, { message: 'Must use GET Method to get an add.' }))
  }
  if (!event.pathParameters || !event.pathParameters.id) {
    callback(null, createResponse(400, { message: 'Missing the id from the path.' }))
  }

  const { id } = event.pathParameters
  const dynamo = new DynamoDB(adTable)
  const ad = await dynamo.getItem(id)

  if (!ad) {
    callback(null, createResponse(500, { message: 'Error getting ad from Dynamo Table.' }))
  }
  callback(null, createResponse(200, { ad }))
}