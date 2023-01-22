const Responses = require('../common/Responses');
const { checkAdObject } = require('../common/utils');

module.exports.createAd = async event => {
  if (event.httpMethod !== 'POST') {
    return Responses._405({ message: 'Must use POST Method to add a user.' })
  }
  const ad = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  const validAdObject = checkAdObject(ad)
  if (!validAdObject) {
    return Responses._400({ message: 'Ad properties were incorrect. Cannot add user to database.' })
  }

}