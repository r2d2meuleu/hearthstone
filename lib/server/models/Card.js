const names = require('../names')
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  id: { type: String, unique: true },

  rarity: String,
  faction: String,
  cardSet: String,
  playerClass: String,
  type: String,
  race: String,

  name: String,
  text: String,
  flavor: String,
  howToEarn: String,
  howToEarnGolden: String,
  targetingArrowText: String,

  collectible: Boolean,
  cost: Number,
  attack: Number,
  health: Number,
  durability: Number,
  hideStats: Boolean,

  mechanics: [String],
  entourage: [String],

  artist: String,
  classes: [String],
  dbfId: Number,
  elite: Boolean,
  multiClassGroup: String,
  overload: Number,
  playRequirements: Object,
  referencedTags: [String],
  spellDamage: Number
})

class CardClass {
  get _cardSet () {
    return names.sets[this.cardSet] || ''
  }

  get _type () {
    return names.types[this.type] || ''
  }

  get _rarity () {
    return names.rarities[this.rarity] || ''
  }

  get _cardClass () {
    return names.classes[this.cardClass] || ''
  }

  get _race () {
    return names.races[this.race] || ''
  }

  get description () {
    return [
      `${this.cost}코스트`,
      (this.type === 'MINION') && `${this.attack}/${this.health}`,
      (this.type === 'WEAPON') && `${this.attack}/${this.durability}`,
      this._className,
      this._setName,
      (this._setName !== this._rarityName) && this._rarityName,
      this._raceName,
      this._typeName,
      `"${this.name}"`
    ].filter(x => x).join(' ')
  }
}

schema.loadClass(CardClass)
module.exports = mongoose.model('Card', schema)
