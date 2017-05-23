/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-09
 */

module.exports = (io, sockets) => socket => command => {
  console.log('command:', socket.client.id, command)

  const data = sockets.data.get(socket.client.id)
  if (!data) return socket.emit('command', 'Unauthorized')

  const [cmd, ...args] = command.substring(1).trim().split(' ')
  switch (cmd.toLowerCase()) {
    default:
      socket.emit('command', `[server] ${cmd}: command not found`)
      break

    case 'online':
      const onlinePlayers = [...sockets.onlinePlayers]
      socket.emit('command', `[server] current online: ${onlinePlayers.join(', ')} (total ${onlinePlayers.length})`)
      break

    case 'say':
      let [target, ...msg] = args

      target = target.toLowerCase()
      msg = `[private] [${data.username} -> ${target}] ${msg.join(' ')}`

      if (!sockets.names.has(target)) socket.emit('message', `[server] ${target}: user not found`)
      else [socket, sockets.names.get(target)].forEach(peer => peer.emit('message', msg))
      break

    case 'game':
      if (args.length < 1) return socket.emit('command', `[server] ${cmd}: missing opponent username`)

      const opponent = args[0].trim().toLowerCase()
      if (!sockets.names.has(opponent)) return socket.emit('message', `[server] ${opponent}: user not found`)

      const opponentData = sockets.names.get(opponent)
      if (!data.decks || !data.decks.length) return socket.emit('message', `[server] you don't have any decks!`)
      if (!opponentData.decks || !opponentData.decks.length) return socket.emit('message', `[server] opponent doesn't have any decks!`)
      break
  }
}
