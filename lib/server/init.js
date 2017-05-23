const axios = require('axios')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const Card = require('./models/Card')

const uri = {
  mongodb: 'mongodb://localhost:27017/hearthstone',
  hearthstone: 'https://api.hearthstonejson.com/v1/latest/koKR'
}

module.exports = async function () {
  await mongoose.connect(uri.mongodb)
  console.log(`Connected successfully to database ${mongoose.connection.name}`)

  if (await Card.findOne()) return
  const { data: rawCards } = await axios.get(`${uri.hearthstone}/cards.json`)

  await Card.insertMany(rawCards.map(card => {
    if (card.set) {
      card.cardSet = card.set
      delete card.set
    }

    return card
  }))
}
