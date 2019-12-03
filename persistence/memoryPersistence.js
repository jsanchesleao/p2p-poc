const Persistence = require('./persistence');

class MemoryPersistence extends Persistence {

  constructor() {
    super();
    this.peers = [];
  }

  async getPeers() {
    return [...this.peers];
  }

  async addPeer(peer) {
    const hasPeer = await this.hasPeer(peer);
    if (!hasPeer) {
      this.peers.push(peer);
    }
  }

}

module.exports = MemoryPersistence;