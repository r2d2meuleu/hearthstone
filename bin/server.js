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

const connection = require('../lib/server/socket')
io.on('connection', connection(io, sockets))
