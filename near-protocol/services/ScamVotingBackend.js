const nearAPI = require('near-api-js');
const { connect, keyStores, utils } = nearAPI;

class ScamVotingBackend {
  constructor(config) {
    this.config = config;
    this.contractId = config.contractName;
  }

  async initialize() {
    const near = await connect(this.config);
    this.account = await near.account(this.config.accountId);
    this.contract = new nearAPI.Contract(this.account, this.contractId, {
      viewMethods: ['is_blacklisted', 'get_blacklist', 'get_scam_votes', 'get_non_scam_votes'],
      changeMethods: ['vote_scam', 'vote_non_scam', 'reset_votes', 'set_blacklist_threshold', 'set_remove_threshold'],
    });
  }

  async voteScam(address) {
    return await this.contract.vote_scam({ address });
  }

  async voteNonScam(address) {
    return await this.contract.vote_non_scam({ address });
  }

  async isBlacklisted(address) {
    return await this.contract.is_blacklisted({ address });
  }

  async getBlacklist() {
    return await this.contract.get_blacklist();
  }

  async getScamVotes(address) {
    return await this.contract.get_scam_votes({ address });
  }

  async getNonScamVotes(address) {
    return await this.contract.get_non_scam_votes({ address });
  }

  async resetVotes(address) {
    return await this.contract.reset_votes({ address });
  }

  async setBlacklistThreshold(newThreshold) {
    return await this.contract.set_blacklist_threshold({ new_threshold: newThreshold });
  }

  async setRemoveThreshold(newThreshold) {
    return await this.contract.set_remove_threshold({ new_threshold: newThreshold });
  }
}

module.exports = ScamVotingBackend;