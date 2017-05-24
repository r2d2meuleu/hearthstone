/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-07
 */

var blessed = require('blessed')

var screen = blessed.screen({
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

screen.on('destroy', () => process.exit(0))

var logger = blessed.log({
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

var commandTextbox = blessed.textbox({
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

var prompt = blessed.prompt({
  parent: screen,
  width: 'half', height: 'shrink', top: 'center', left: 'center',
  padding: { top: 1, left: 2, bottom: 1, right: 2 },

  tags: true, keys: true, mouse: true,
  border: 'line', label: ' {blue-fg}Hearthstone{/} '
})

var message = blessed.message({
  parent: screen,
  width: 'shrink', height: 'shrink', top: 'center', left: 'center',
  padding: { top: 1, left: 2, bottom: 1, right: 2 },

  tags: true, keys: true, mouse: true, hidden: true,
  border: 'line', label: ' {blue-fg}Hearthstone{/} '
})

var loading = blessed.loading({
  parent: screen,
  width: 'shrink', height: 'shrink', top: 'center', left: 'center',
  padding: { top: 1, left: 2, bottom: 1, right: 2 },

  tags: true, keys: true, mouse: true, hidden: true,
  border: 'line', label: ' {blue-fg}Hearthstone{/} '
})

screen.key('C-c', () => screen.destroy())
screen.render()

var io = require('socket.io-client')
var socket, username, hostname

const errorEvents = [
  'error', 'connect_error', 'connect_timeout', 'reconnect_error'
]

function initialize () {
  prompt.input('{yellow-fg}Address: {/}', (error, address) => {
    if (error || !address) return screen.destroy()
    if (!address.includes('@')) return message.error('The address must be {bold}username@hostname{/}.', initialize);

    [username, hostname] = address.split('@').map(str => str.trim())

    loading.load(`Connecting to ${hostname}...`)
    socket = io.connect(`http://${hostname}:10413`, { timeout: 10000 })

    errorEvents.forEach(err => socket.on(err, onError))

    socket.on('connect', onConnect)
    socket.on('hello', onHello)
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

function onError (res) {
  message.error(JSON.stringify(res), initialize)
}

function onConnect () {
  socket.emit('hello', username)
}

function onHello (res) {
  loading.stop()
  if (!res.ok) return message.error(res.message, initialize)

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
