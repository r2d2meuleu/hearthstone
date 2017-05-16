module.exports = (io, sockets) => {
  const auth = require('./auth')(io, sockets)
  const message = require('./message')(io, sockets)
  const command = require('./command')(io, sockets)
  const disconnect = require('./disconnect')(io, sockets)

  return socket => {
    console.log('connection:', socket.client.id)

    socket.on('auth', auth(socket))
    socket.on('message', message(socket))
    socket.on('command', command(socket))
    socket.on('disconnect', disconnect(socket))
  }
}
