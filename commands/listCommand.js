function register(app, persistence){
  app.command('list').action(listAction(persistence));
}

const listAction = persistence => async (args, callback) => {
  const peers = await persistence.getPeers();
  console.log(peers);
  callback();
}

module.exports = {
  register
}