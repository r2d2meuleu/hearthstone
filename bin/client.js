/**
 * @author ChalkPE <chalk@chalk.pe>
 * @since 2016-07-07
 */

var chalk = require('chalk');

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function print(msg, prompt = true){
    readline.cursorTo(process.stdout, 0);
    console.log(msg);
    
    if(prompt) rl.prompt(true);
}

var io = require('socket.io-client');
var socket, username, hostname;

rl.question(chalk.yellow('Address: '), (address) => {
    if(!address.includes('@')){
        print(chalk.red('The address must be <username>@<host>.'), false);
        process.exit();
    }

    [username, hostname] = address.split('@');
    print(chalk.yellow(`Connecting to ${hostname}...`));

    socket = io(`http://${hostname}:10413`);

    socket.on('connect', connect);
    socket.on('hello',   hello);
    socket.on('command', command);
    socket.on('message', message);

    rl.on('line', line => {
        if(line && line.trim().length > 0) socket.emit('command', line);
    });
});

function connect(){
    socket.emit('hello', username);
}

function hello(res){
    if(!res.ok){
        print(res.message, 'error');
        process.exit();
    }

    print(chalk.yellow(res.message));
}

function command(res){
    print(chalk.yellow(res));
}

function message(msg){
    print(chalk.cyan.bold(msg));
}