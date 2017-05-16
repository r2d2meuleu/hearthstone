const axios = require('axios')
const MongoClient = require('mongodb').MongoClient

const api = 'https://api.hearthstonejson.com/v1/latest'
const allowedSets = 'CORE EXPERT1'.split(' ')
const allowedTypes = 'MINION SPELL WEAPON'.split(' ')

module.exports = async function (lang = 'koKR') {
  const db = await MongoClient.connect('mongodb://localhost:27017/hearthstone')
  console.log(`Connected successfully to database ${db.databaseName}`)

  const cards = await db.createCollection('cards')
  if (await cards.findOne({})) return cards

  const { data: rawCards } = await axios.get(`${api}/${lang}/cards.json`)
  await cards.insertMany(rawCards
    .filter(data =>
      data.collectible &&
      allowedSets.includes(data.set) &&
      allowedTypes.includes(data.type)))

  return cards
}
