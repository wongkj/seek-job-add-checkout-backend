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
        ID: id
      }
    }
    const data = await this.#documentClient
      .get(params)
      .promise()

    if (!data || !data.Item) throw new Error(`There was an error fetching the data for ID of ${id} from ${TableName}`);

    console.log(data);
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

}

module.exports = DynamoDB