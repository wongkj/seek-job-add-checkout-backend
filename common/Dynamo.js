const AWS = require('aws-sdk')

export default class DynamoDB {

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

  async getItem(ID) {
    const params = {
      TableName: this.#tableName,
      Key: {
        ID
      }
    }
    const data = await this.#documentClient
      .get(params)
      .promise()

    if (!data || !data.Item) throw new Error(`There was an error fetching the data for ID of ${ID} from ${TableName}`);

    console.log(data);
    return data.Item;
  }

  async insertItem(data, TableName) {
    if (!data.id) throw new Error('no id provided in the data')

    const params = {
      TableName,
      Item: data
    }

    const res = await this.#documentClient.put(params).promise();
    if (!res) throw new Error(`There was an error inserting data into table ${this.#tableName}`)

    return data
  }

}