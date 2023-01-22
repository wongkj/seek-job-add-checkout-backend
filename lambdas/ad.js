const Responses = require('../common/Responses');

module.exports.createAd = async event => {
  if (event.httpMethod !== 'POST') {
    return Responses._405({ message: 'Must use POST Method to add a user.' })
  }        
}