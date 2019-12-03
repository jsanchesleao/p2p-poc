const dgram = require('dgram');
const actionRunner = require('./actions');

let server;

function start(argv, persistence){
  const port = argv.port || argv.p || 4000;
  const host = argv.host || argv.h || '0.0.0.0';

  server = dgram.createSocket('udp4');
  server.on('listening', () => onListening(server));
  server.on('message', (message, remote) => onMessage(message, remote, persistence));

  server.bind(port, host);
}

function onListening(server) {
  console.log('Node started on ', server.address());
}

async function onMessage(message, remote, persistence) {
  try {
    const action = JSON.parse(message.toString('utf-8'));
    console.log('onMessage received from', remote);
    await actionRunner.run({action, remote, send, persistence});
  }
  catch(err) {
    console.log(err);
  }
}

function send(action, host, port) {
  return new Promise(function(resolve, reject) {
    const message = JSON.stringify(action);
    
    server.send(message, 0, message.length, port, host, function(err) {
      if (err) {
        reject(err)
      }
      else {
        console.log('UDP message sent to ' + host +':'+ port);
        
        resolve();
      }
    })
  })
}

function request(_action, host, port) {
  const reqId = Math.floor(Math.random() * 1000000);
  console.log('REQUEST ID', reqId);
  const action = {..._action, reqId}
  return new Promise(function(resolve, reject) {
    const socket = dgram.createSocket('udp4');
    socket.on('message', function(message) {
      const response = JSON.parse(message.toString('utf-8'));
      socket.close();
      resolve(response);
    })

    socket.on('listening', function(){
      const message = JSON.stringify(action);
      socket.send(message, 0, message.length, port, host, function(err) {
        if(err){
          reject(err);
          socket.close();
        }
      })
    })

    socket.bind();

    setTimeout(reject, 5000);

  })
}

module.exports = {
  start, send, request
}