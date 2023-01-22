const Responses = require('../common/Responses');
const { checkAdObject } = require('../common/utils');
const DynamoDB = require('../common/Dynamo');

const adTable = process.env.AD_TABLE

module.exports.createAd = async event => {
  if (event.httpMethod !== 'POST') {
    return Responses._405({ message: 'Must use POST Method to add a user.' })
  }
  const ad = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  const validAdObject = checkAdObject(ad)
  if (!validAdObject) {
    return Responses._400({ message: 'Ad properties were incorrect. Cannot add user to database.' })
  }
  const dynamo = new DynamoDB(adTable)
  const response = dynamo.insertItem(ad)
  if (!response) {
    return Responses._500({ message: 'Error inserting item into Dynamo Table' })
  }

}