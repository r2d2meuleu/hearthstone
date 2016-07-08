/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-07
 */

var io = require("socket.io")(10413);

var socketData = new Map(); //socket.client.id -> object { username, ...etc }
var socketNames = new Map(); //string -> socket

var online = {
    [Symbol.iterator]: function*(){
        for(let data of socketData.values()) yield data.username;
    }
};

var usernameRule = /^[a-z][a-z0-9]*([-.][a-z0-9]+){0,2}$/;

io.on('connection', socket => {
    console.log('conne:', socket.client.id);

    socket.on('hello', username => {
        console.log('hello:', socket.client.id);

        if(!username) return socket.emit('hello', {
            ok: false,
            message: "Username required!"
        });

        username = username.toLowerCase();

        if(!username.match(usernameRule)) return socket.emit('hello', {
            ok: false,
            message: "Wrong username!"
        });

        else if(socketNames.has(username)) return socket.emit('hello', {
            ok: false,
            message: `Your username "${username}" is already taken!`
        });

        socketNames.set(username, socket);
        socketData.set(socket.client.id, { username, date: new Date() });

        socket.emit('hello', {
            ok: true,
            message: `[server] Welcome to the server, ${username}!`
        });

        io.emit('message', `[server] ${username} join the server!`);
    });

    socket.on('message', message => {
        console.log('messa:', socket.client.id);

        let data = socketData.get(socket.client.id);
        if(!data) return socket.emit('command', 'Unauthorized');

        io.emit('message', `[public] ${data.username}: ${message}`);
    });

    socket.on('command', command => {
        console.log('comma:', socket.client.id);

        let data = socketData.get(socket.client.id);
        if(!data) return socket.emit('command', 'Unauthorized');

        let [cmd, ...args] = command.substring(1).trim().split(' ');

        switch(cmd.toLowerCase()){
            default:
                socket.emit('command', `[server] ${cmd}: command not found`);
                break;

            case 'online':
                let onlinePlayers = [...online];
                socket.emit('command', `[server] current online: ${onlinePlayers.join(', ')} (total ${onlinePlayers.length})`);
                break;

            case 'say':
                let [target, ...msg] = args;

                target = target.toLowerCase();
                msg = `[private] [${data.username} -> ${target}] ${msg.join(' ')}`;

                if(!socketNames.has(target)) socket.emit('message', `[private] ${target}: user not found`);
                else [socket.emit('message', msg), socketNames.get(target)].forEach(peer => peer.emit('message', msg));
                break;
        }
    });

    socket.on('disconnect', () => {
        console.log('disco:', socket.client.id);
        
        let data = socketData.get(socket.client.id);
        if(!data) return;

        let username = data.username;

        socketNames.delete(username);
        socketData.delete(socket.client.id);

        io.emit('message', `[server] ${username} left the server!`);
    });
});