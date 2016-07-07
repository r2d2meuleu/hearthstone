/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-07
 */

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var io = require('socket.io-client');
var socket, username, hostname;

rl.question('Connect to: ', (address) => {
    if(!address.includes('@')){
        console.error('The address must be <username>@<host>.');
        process.exit();
    }

    [username, hostname] = address.split('@');
    console.log(`connecting to ${hostname}...`);

    socket = io(`http://${hostname}:10413`);

    socket.on('connect', connect);
    socket.on('hello', hello);
    socket.on('command', command);
    socket.on('message', message);

    rl.on('line', line => socket.emit('command', line));
});

function connect(){
    socket.emit('hello', username);
}

function hello(res){
    if(!res.ok){
        console.error(res.message);
        process.exit();
    }

    console.log(res.message);
    rl.prompt();
}

function command(res){
    console.log(res);
    rl.prompt();
}

function message(msg){
    console.log(msg);
}