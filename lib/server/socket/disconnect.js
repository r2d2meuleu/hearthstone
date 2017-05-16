/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-09
 */

module.exports = (io, sockets) => socket => () => {
  console.log('disconnect:', socket.client.id)
  const data = sockets.data.get(socket.client.id)

  if (data) {
    sockets.names.delete(data.username)
    sockets.data.delete(socket.client.id)

    io.emit('message', `[public] ${data.username} left the server!`)
  }
}
