/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-07
 */

var blessed = require('blessed');

var screen = blessed.screen({
    smartCSR: true,
    dockBorders: true,
    fullUnicode: true,
    title: 'Hearthstone'
});

var logger = blessed.log({
    parent: screen,
    width: '100%', height: '100%-2', top: 0, left: 0,
    padding: { top: 0, left: 1, bottom: 0, right: 1 },

    tags: true, keys: true, mouse: true, hidden: true,
    border: 'line', label: ' {blue-fg}Messages{/} ',

    style: { fg: 'yellow' },
    scrollable: true, scrollback: 512
});

var commandArea = blessed.textarea({
    parent: screen,
    width: '100%', height: 3, bottom: 0, left: 0,

    tags: true, keys: true, mouse: true, hidden: true,
    border: 'line', style: { fg: 'cyan' }
});

var prompt = blessed.prompt({
    parent: screen,
    width: 'half', height: 'shrink', top: 'center', left: 'center',
    padding: { top: 1, left: 2, bottom: 1, right: 2 },

    tags: true, keys: true, mouse: true,
    border: 'line', label: ' {blue-fg}Hearthstone{/} '
});

var message = blessed.message({
    parent: screen,
    width: 'shrink', height: 'shrink', top: 'center', left: 'center',
    padding: { top: 1, left: 2, bottom: 1, right: 2 },

    tags: true, keys: true, mouse: true, hidden: true,
    border: 'line', label: ' {blue-fg}Hearthstone{/} '
});

var loading = blessed.loading({
    parent: screen,
    width: 'shrink', height: 'shrink', top: 'center', left: 'center',
    padding: { top: 1, left: 2, bottom: 1, right: 2 },

    tags: true, keys: true, mouse: true, hidden: true,
    border: 'line', label: ' {blue-fg}Hearthstone{/} '
});

screen.key('C-c', () => screen.destroy());
screen.render();

var io = require('socket.io-client');
var socket, username, hostname;

prompt.input('{yellow-fg}Address: {/}', (error, address) => {
    if(error) return screen.destroy();
    if(!address || !address.includes('@')) return message.error('The address must be username@host.', screen.destroy);

    [username, hostname] = address.split('@');
    loading.load(`Connecting to ${hostname}...`);

    socket = io(`http://${hostname}:10413`);

    socket.on('connect', onConnect);
    socket.on('hello',   onHello);
    socket.on('command', onCommand);
    socket.on('message', onMessage);

    commandArea.on('focus', () => commandArea.readInput(sendCommand));
});

function sendCommand(){
    let command = commandArea.getValue();

    if(command && (command = command.trim()).length > 1) socket.emit(command.startsWith('/') ? 'command' : 'message', command);
    commandArea.clearValue();
}

function onConnect(){
    socket.emit('hello', username);
}

function onHello(res){
    loading.stop();
    if(!res.ok) return message.error(res.message, screen.destroy);

    logger.show();
    commandArea.show();

    logger.log(res.message);
}

function onCommand(res){
    logger.log(res);
}

function onMessage(msg){
    logger.log(`{cyan-fg}${msg}{/}`);
}