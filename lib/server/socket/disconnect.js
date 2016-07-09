/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-09
 */

module.exports = (io, sockets) => socket => () => {
    console.log('disco:', socket.client.id);

    let data = sockets.data.get(socket.client.id);
    if(!data) return;

    let username = data.username;

    sockets.names.delete(username);
    sockets.data.delete(socket.client.id);

    io.emit('message', `[public] ${username} left the server!`);
};