/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-07
 */

const io = require('socket.io')(process.env.PORT || 10413)
const sockets = {
  names: new Map(), // string -> socket
  data: new Map(),  // socket.client.id -> object

  onlinePlayers: {
    * [Symbol.iterator] () {
      for (let data of sockets.data.values()) yield data.username
    }
  }
}

const database = require('../lib/server/database')
const connection = require('../lib/server/socket')

const Card = require('../lib/server/models/Card')

database().then(async cards => {
  (await cards.find({})).forEach(x => console.log(new Card(x).toString()))
  io.on('connection', connection(io, sockets))
})
