async function run({action, remote, send, persistence}) {

  console.log('ACTION RECEIVED', action);

  switch(action.type){
    case 'ADD_REQUEST':
      await addRequestHandler({action, remote, send, persistence});
      break;
    case 'ADD_RESPONSE':
      await addResponseHandler({action, remote, send, persistence})
      break;
    default:
      // noop
  }

}

async function addRequestHandler({action, remote, send, persistence}) {
  const peers = await persistence.getPeers();
  const responseAction = {
    type: 'ADD_RESPONSE',
    peers: peers,
    reqId: action.reqId
  }

  await send(responseAction, remote.address, remote.port)
}

async function addResponseHandler({action, remote, persistence}) {
  for(let i = 0; i < action.peers.length; i++) {
    await persistence.addPeer(action.peers[i])
  }
}

module.exports = {run};