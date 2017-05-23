/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-07
 */

const io = require("socket.io")(10413);
const sockets = {
    data: new Map(),  //socket.client.id -> object { username, ...etc }
    names: new Map(), //string -> socket
    online: {
        [Symbol.iterator]: function*(){
            for(let data of sockets.data.values()) yield data.username;
        }
    }
};

const hello = require('../lib/server/socket/hello')(io, sockets);
const message = require('../lib/server/socket/message')(io, sockets);
const command = require('../lib/server/socket/command')(io, sockets);
const disconnect = require('../lib/server/socket/disconnect')(io, sockets);

io.on('connection', socket => {
    console.log('conne:', socket.client.id);

    socket.on('hello', hello(socket));
    socket.on('message', message(socket));
    socket.on('command', command(socket));
    socket.on('disconnect', disconnect(socket));
});