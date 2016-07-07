/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-07
 */

var io = require("socket.io")(10413);
var socketData = new Map();

var online = {
    [Symbol.iterator]: function* (){
        for(let data of socketData.values()) yield data.username;
    }
};

console.log('bind on 10413');

io.on('connection', socket => {
    console.log('connection:', socket.client.id);

    socket.on('hello', username => {
        console.log('hello:', socket.client.id);

        username = username || socket.client.id;

        socketData.set(socket.client.id, { username });
        socket.emit('hello', { ok: true, message: `Hello, ${username}! This is CLI Hearthstone!` });
    });

    socket.on('command', command => {
        switch(command.toLowerCase().trim()){
            case 'online':
                socket.emit('command', `Online: ${[...online].join(', ')}`);
                break;

            default:
                socket.emit('command', `${command}: Command not found`);
        }
    });

    socket.on('disconnect', () => {
        console.log('disconnect:', socket.client.id);

        io.emit('message', `${socketData.get(socket.client.id).username} left the server!`);
        socketData.delete(socket.client.id);
    });
});