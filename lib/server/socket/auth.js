/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-09
 */

const usernameRule = /^[a-z][a-z0-9]*([-.][a-z0-9]+){0,2}$/

module.exports = (io, sockets) => socket => username => {
  console.log('auth:', socket.client.id)
  const fail = message => socket.emit('auth', { ok: false, message })

  if (!(username && (username = username.trim().toLowerCase()))) return fail('Username required.')
  if (username.length < 3) return fail('The username must be at least 3 characters.')
  if (!username.match(usernameRule)) return fail(`Your username "${username}" is isvalid.`)
  if (sockets.names.has(username)) return fail(`Your username "${username}" is already taken.`)

  sockets.names.set(username, socket)
  sockets.data.set(socket.client.id, { username, date: new Date() })

  io.emit('message', `[public] ${username} joined the server!`)
  socket.emit('auth', { ok: true, message: `[server] Welcome ${username}!` })
}
