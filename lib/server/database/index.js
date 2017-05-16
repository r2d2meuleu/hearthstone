
const MongoClient = require('mongodb').MongoClient

module.exports = async function () {
  const db = await MongoClient.connect('mongodb://localhost:27017/hearthstone')
  console.log(`Connected successfully to database ${db.databaseName}`)
}
