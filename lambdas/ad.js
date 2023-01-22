const Responses = require('../common/Responses');
const { checkAdObject } = require('../common/utils');
const DynamoDB = require('../common/Dynamo');

const adTable = process.env.AD_TABLE

module.exports.createAd = async event => {
  if (event.httpMethod !== 'POST') {
    return Responses._405({ message: 'Must use POST Method to add an add.' })
  }
  const ad = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  const validAdObject = checkAdObject(ad)
  if (!validAdObject) {
    return Responses._400({ message: 'Ad properties were incorrect. Cannot create new ad.' })
  }
  const dynamo = new DynamoDB(adTable)
  const response = await dynamo.insertItem(ad)
  console.log(`response: ${response}`)
  if (!response) {
    return Responses._500({ message: 'Error inserting item into Dynamo Table' })
  }
  return Responses._200({ message: 'Successfully inserted new Ad into the Ad Table.' })
}

module.exports.getAd = async event => {
  if (event.httpMethod !== 'GET') {
    return Responses._405({ message: 'Must use GET Method to get an add.' })
  }
  if (!event.pathParameters || !event.pathParameters.id) {
    return Responses._400({ message: 'missing the id from the path' });
  }
  const dynamo = new DynamoDB(adTable)
  const ad = await dynamo.getItem(id)
  if (!ad) {
    return Responses._500({ message: 'Error getting ad from Dynamo Table' })
  }
  return Responses._200({ ad })
}