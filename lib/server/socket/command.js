/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-09
 */

module.exports = (io, sockets) => socket => command => {
    console.log('comma:', socket.client.id);

    let data = sockets.data.get(socket.client.id);
    if(!data) return socket.emit('command', 'Unauthorized');

    let [cmd, ...args] = command.substring(1).trim().split(' ');

    switch(cmd.toLowerCase()){
        default:
            socket.emit('command', `[server] ${cmd}: command not found`);
            break;

        case 'online':
            let onlinePlayers = [...sockets.online];
            socket.emit('command', `[server] current online: ${onlinePlayers.join(', ')} (total ${onlinePlayers.length})`);
            break;

        case 'say':
            let [target, ...msg] = args;

            target = target.toLowerCase();
            msg = `[private] [${data.username} -> ${target}] ${msg.join(' ')}`;

            if(!sockets.names.has(target)) socket.emit('message', `[private] ${target}: user not found`);
            else [socket, sockets.names.get(target)].forEach(peer => peer.emit('message', msg));
            break;

        case 'game':
            if(args.length < 1) return socket.emit('command', `[server] ${cmd}: missing opponent username`);

            let opponent = args[0].trim().toLowerCase();
            break;
    }
};
