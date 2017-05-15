/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-09
 */

module.exports = (io, sockets) => socket => message => {
  console.log('messa:', socket.client.id)

  let data = sockets.data.get(socket.client.id)
  if (!data) return socket.emit('command', 'Unauthorized')

  io.emit('message', `[public] ${data.username}: ${message}`)
}
