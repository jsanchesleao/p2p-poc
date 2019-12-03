class Persistence {
  constructor(){
 
  }

  async getPeers(){

  }

  async addPeer(peer) {

  }

  async hasPeer(peer) {
    const peers = await this.getPeers();
    return Boolean(peers.find(p => p.id === peer.id));
  }
}

module.exports = Persistence;