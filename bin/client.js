/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-07
 */

const blessed = require('blessed')

const screen = blessed.screen({
  smartCSR: true,
  dockBorders: true,
  fullUnicode: true,
  title: 'Hearthstone',

  cursor: {
    artificial: true,
    shape: 'underline',
    blink: true
  }
})

screen.on('destroy', () => {
  if (socket) socket.disconnect()
  return process.exit(0)
})

const logger = blessed.log({
  parent: screen,

  width: '100%',
  height: '100%-2',

  top: 0,
  left: 0,
  padding: { top: 0, left: 1, bottom: 0, right: 1 },

  tags: true,
  keys: true,
  mouse: true,
  hidden: true,

  border: 'line',
  label: ' {blue-fg}Messages{/} ',
  style: { fg: 'white' },

  scrollable: true,
  scrollback: 512
})

const commandTextbox = blessed.textbox({
  parent: screen,

  width: '100%',
  height: 3,

  bottom: 0,
  left: 0,
  padding: { top: 0, left: 1, bottom: 0, right: 1 },

  tags: true,
  keys: true,
  mouse: true,
  hidden: true,

  border: 'line',
  style: { fg: 'yellow' },
  inputOnFocus: true
})

commandTextbox.on('submit', onCommandAreaSubmit)

const prompt = blessed.prompt({
  parent: screen,

  width: 'half',
  height: 'shrink',

  top: 'center',
  left: 'center',
  padding: { top: 1, left: 2, bottom: 1, right: 2 },

  tags: true,
  keys: true,
  mouse: true,

  border: 'line',
  label: ' {blue-fg}Hearthstone{/} '
})

const message = blessed.message({
  parent: screen,

  width: 'shrink',
  height: 'shrink',

  top: 'center',
  left: 'center',
  padding: { top: 1, left: 2, bottom: 1, right: 2 },

  tags: true,
  keys: true,
  mouse: true,
  hidden: true,

  border: 'line',
  label: ' {blue-fg}Hearthstone{/} '
})

const loading = blessed.loading({
  parent: screen,

  width: 'shrink',
  height: 'shrink',

  top: 'center',
  left: 'center',
  padding: { top: 1, left: 2, bottom: 1, right: 2 },

  tags: true,
  keys: true,
  mouse: true,
  hidden: true,

  border: 'line',
  label: ' {blue-fg}Hearthstone{/} '
})

screen.key('C-c', () => screen.destroy())
screen.render()

const io = require('socket.io-client')
let socket, username, hostname

function initialize () {
  const addressPattern = /^\s*([^\s@]+)@([^\s@]+)\s*$/g

  prompt.input('{yellow-fg}Address: {/}', (err, address) => {
    if (err || !address) return screen.destroy()

    const m = addressPattern.exec(address)
    if (m === null) return message.error('The address must be {bold}username@hostname{/}.', initialize);

    [username, hostname] = [m[1], m[2]]

    loading.load(`Connecting to ${hostname}...`)
    socket = io(`http://${hostname}:10413`)

    socket.on('connect', onConnect)
    socket.on('auth', onAuth)
    socket.on('command', onCommand)
    socket.on('message', onMessage)
  })
}

function onCommandAreaSubmit (command) {
  if (command && (command = command.trim()).length > 1) {
    if (command.toLowerCase() === '/exit') return screen.destroy()
    socket.emit(command.startsWith('/') ? 'command' : 'message', command)
  }

  commandTextbox.clearInput()
  commandTextbox.focus()
  screen.render()
}

function onConnect () {
  socket.emit('auth', username)
}

function onAuth (res) {
  loading.stop()

  if (!res.ok) {
    message.error(res.message, initialize)
    return socket.disconnect() // disconnect client if login fails
  }

  screen.title = `Hearthstone: ${username}@${hostname}`

  logger.show()
  commandTextbox.show()
  commandTextbox.focus()

  logger.log(res.message)
}

function onCommand (res) {
  logger.log(`{yellow-fg}${res}{/}`)
}

function onMessage (msg) {
  logger.log(msg)
}

initialize()
