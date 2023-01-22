const Responses = require('../common/Responses');
const { checkSaleObject } = require('../common/utils');

module.exports.calculateSale = async event => {
  if (event.httpMethod !== 'POST') {
    return Responses._405({ message: 'Must use POST Method to calculate.' })
  }
  // Check event object to match structure
  const sale = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  const validSaleObject = checkSaleObject(sale)
  // Search for company name in the Discount Table

  // If discount exists then implement it

  // Do final calculation of sale
}