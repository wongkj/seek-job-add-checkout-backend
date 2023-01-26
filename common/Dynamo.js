const AWS = require('aws-sdk')
const { v4: uuid4 } = require('uuid');

class DynamoDB {

  #documentClient
  #tableName

  constructor(tableName) {
    this.#documentClient = new AWS.DynamoDB.DocumentClient();
    this.#tableName = tableName
  }

  get tableName() {
    return this.#tableName;
  }

  set tableName(value) {
    if (typeof value != 'string') throw new Error('Table name must be a string')
    this.#tableName = value;
  }

  async getItem(id) {
    const params = {
      TableName: this.#tableName,
      Key: {
        id: id
      }
    }
    const data = await this.#documentClient
      .get(params)
      .promise()

    if (!data || !data.Item) throw new Error(`There was an error fetching the data for ID of ${id} from ${TableName}`);

    return data.Item;
  }

  async insertItem(data) {

    const id = uuid4()

    const newItem = {
      id,
      ...data
    }

    const params = {
      TableName: this.#tableName,
      Item: newItem
    }

    const res = await this.#documentClient.put(params).promise();
    if (!res) throw new Error(`There was an error inserting data into table ${this.#tableName}`)

    return data
  }

  async scanDiscounts(obj) {

    const { companyName } = obj;
    const params = {
      FilterExpression: "#companyName = :companyName",
      ExpressionAttributeNames: {
        "#companyName": "companyName"
      },
      ExpressionAttributeValues: {
        ":companyName": companyName
      },
      TableName: this.#tableName,
    };

    const res = await this.#documentClient.scan(params).promise();
    if (!res) throw new Error(`There was an error scanning for items in the table ${this.#tableName}`)

    return res    
  }

  async scanAds(obj) {

    const { adType: name } = obj;
    const params = {
      FilterExpression: "#name = :name",
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": name
      },
      TableName: this.#tableName,
    };

    const res = await this.#documentClient.scan(params).promise();
    if (!res) throw new Error(`There was an error scanning for items in the table ${this.#tableName}`)

    return res    
  }

  #buildUpdateExpression(item){
    const { companyName = '', discountType = '', adType = '', qtyBought = '', qtyCharged = '', newPrice = '' } = item;
    let expression = ''
    if (companyName !== '') expression += '#companyName = :companyName,';
    if (discountType !== '') expression += '#discountType = :discountType,';
    if (adType !== '') expression += '#adType = :adType,';
    if (qtyBought !== '') expression += '#qtyBought = :qtyBought,';
    if (qtyCharged !== '') expression += '#qtyCharged = :qtyCharged,';
    if (newPrice !== '') expression += '#newPrice = :newPrice,';
    return expression.substring(0, expression.length - 1);
  }

  #buildUpdateExpressionAttributeNames(item) {
    const { companyName = '', discountType = '', adType = '', qtyBought = '', qtyCharged = '', newPrice = '' } = item;
    let obj = {}
    if (companyName !== '') obj["#companyName"] = "companyName";
    if (discountType !== '') obj["#discountType"] = "discountType";
    if (adType !== '') obj["#adType"] = "adType";
    if (qtyBought !== '') obj["#qtyBought"] = "qtyBought";
    if (qtyCharged !== '') obj["#qtyCharged"] = "qtyCharged";
    if (newPrice !== '') obj["#newPrice"] = "newPrice";
    return obj;
  }

  #buildUpdateExpressionAttributeValues(item) {
    const { companyName = '', discountType = '', adType = '', qtyBought = '', qtyCharged = '', newPrice = '' } = item;
    let obj = {}
    if (companyName !== '') obj[":companyName"] = companyName;
    if (discountType !== '') obj[":discountType"] = discountType;
    if (adType !== '') obj[":adType"] = adType;
    if (qtyBought !== '') obj[":qtyBought"] = qtyBought;
    if (qtyCharged !== '') obj[":qtyCharged"] = qtyCharged;
    if (newPrice !== '') obj[":newPrice"] = newPrice;
    return obj;
  }

  async updateItems(discountId, item) {

    const params = {
      Key: {
        id: discountId
      },
      TableName: this.#tableName,
      UpdateExpression: `SET ${this.#buildUpdateExpression(item)}`,
      ExpressionAttributeNames: this.#buildUpdateExpressionAttributeNames(item),      
      ExpressionAttributeValues: this.#buildUpdateExpressionAttributeValues(item),
    };
    const res = await this.#documentClient.update(params).promise();
    if (!res) throw new Error(`There was an error updating items in the table ${this.#tableName}`)

    return res;
  }

}

module.exports = DynamoDB