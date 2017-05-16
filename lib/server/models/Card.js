const classNames = {
  DRUID: '드루이드',
  HUNTER: '사냥꾼',
  MAGE: '마법사',
  PALADIN: '성기사',
  PRIEST: '사제',
  ROGUE: '도적',
  SHAMAN: '주술사',
  WARLOCK: '흑마법사',
  WARRIOR: '전사',
  DREAM: '꿈',
  NEUTRAL: '중립'
}

const rarityNames = {
  COMMON: '일반',
  FREE: '기본',
  RARE: '희귀',
  EPIC: '영웅',
  LEGENDARY: '전설'
}

const typeNames = {
  SPELL: '주문',
  WEAPON: '무기',
  MINION: '하수인'
}

const setNames = {
  CORE: '기본',
  EXPERT1: '오리지널'
}

const raceNames = {
  MURLOC: '멀록',
  DEMON: '악마',
  MECHANICAL: '기계',
  ELEMENTAL: '정령',
  BEAST: '야수',
  TOTEM: '토템',
  PIRATE: '해적',
  DRAGON: '용족'
}

class Card {
  constructor (data) {
    this.data = data
  }

  get setName () {
    return setNames[this.data.set] || ''
  }

  get typeName () {
    return typeNames[this.data.type] || ''
  }

  get rarityName () {
    return rarityNames[this.data.rarity] || ''
  }

  get className () {
    return classNames[this.data.cardClass] || ''
  }

  get raceName () {
    return raceNames[this.data.race] || ''
  }

  toString () {
    const data = this.data
    const list = [
      `${data.cost}코스트`,
      data.type === 'MINION' && `${this.data.attack}/${this.data.health}`,
      data.type === 'WEAPON' && `${this.data.attack}/${this.data.durability}`,
      this.className,
      this.setName,
      this.setName !== this.rarityName && this.rarityName,
      this.raceName,
      this.typeName, `"${data.name}"`
    ]

    return list.filter(x => x).join(' ')
  }
}

module.exports = Card
