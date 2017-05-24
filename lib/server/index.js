/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-07
 */

const socketIo = require('socket.io')
const init = require('./init')
const connection = require('./socket')

const io = socketIo(process.env.PORT || 10413)
const sockets = {
  names: new Map(), // string -> socket
  data: new Map(),  // socket.client.id -> object

  onlinePlayers: {
    * [Symbol.iterator] () {
      for (let data of sockets.data.values()) yield data.username
    }
  }
}

init()
  .then(() => io.on('connection', connection(io, sockets)))
  .catch(err => console.error(err))
