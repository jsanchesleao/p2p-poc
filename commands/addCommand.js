const udp = require('../udp');

function register(app, persistence){
  app.command('add <host> [port]').action(addAction(persistence));
}

const addAction = persistence => async ({host, port}, callback) => {
  const _port = port || 4000;
  const response = await udp.request({type: 'ADD_REQUEST'}, host, _port);
  await persistence.addPeer({id: `${host}:${_port}`, host, _port});

  for(let i = 0; i < response.peers.length; i++) {
    await persistence.addPeer(response.peers[i]);
  }
  
  callback();
}

module.exports = {
  register
}