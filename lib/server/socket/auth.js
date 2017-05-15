/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-09
 */

const usernameRule = /^[a-z][a-z0-9]*([-.][a-z0-9]+){0,2}$/

module.exports = (io, sockets) => socket => username => {
  console.log('auth:', socket.client.id)

  if (!username) return socket.emit('auth', { ok: false, message: 'Username required.' })
  username = username.trim().toLowerCase()

  if (username.length < 3) return socket.emit('auth', { ok: false, message: 'The username must be at least 3 characters.' })
  if (!username.match(usernameRule)) return socket.emit('auth', { ok: false, message: `Your username "${username}" is isvalid.` })
  if (sockets.names.has(username)) return socket.emit('auth', { ok: false, message: `Your username "${username}" is already taken.` })

  sockets.names.set(username, socket)
  sockets.data.set(socket.client.id, { username, date: new Date() })

  socket.emit('auth', { ok: true, message: `[server] Welcome to Hearthstone server, ${username}!` })
  io.emit('message', `[public] ${username} joined the server!`)
}
