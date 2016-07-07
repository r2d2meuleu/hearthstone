/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-07
 */

var io = require("socket.io")(10413);

var socketData = new Map();
var socketNames = new Set();

var online = {
    [Symbol.iterator]: function*(){
        for(let data of socketData.values()) yield data.username;
    }
};

io.on('connection', socket => {
    console.log('conne:', socket.client.id);

    socket.on('hello', username => {
        console.log('hello:', socket.client.id);

        if(!username) return socket.emit('hello', {
            ok: false,
            message: "Username required!"
        });

        else if(socketNames.has(username)) return socket.emit('hello', {
            ok: false,
            message: `Your username "${username}" is already taken!`
        });

        socketNames.add(username);
        socketData.set(socket.client.id, { username, date: new Date() });

        socket.emit('hello', {
            ok: true,
            message: `Welcome to the server, ${username}!`
        });

        io.emit('message', `${username} join the server!`);
    });

    socket.on('command', command => {
        console.log('comma:', socket.client.id);

        if(!socketData.has(socket.client.id)) return socket.emit('command', 'Unauthorized');

        switch(command.toLowerCase().trim()){
            case 'online':
                let onlinePlayers = [...online];
                socket.emit('command', `Current online: ${onlinePlayers.join(', ')} (total ${onlinePlayers.length})`);
                break;

            default:
                socket.emit('command', `${command}: command not found`);
        }
    });

    socket.on('disconnect', () => {
        console.log('disco:', socket.client.id);

        if(!socketData.has(socket.client.id)) return;
        let username = socketData.get(socket.client.id).username;

        socketNames.delete(username);
        socketData.delete(socket.client.id);

        io.emit('message', `${username} left the server!`);
    });
});