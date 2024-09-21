use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedSet};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault, Promise};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct ScamVotingContract {
    // Owner of the contract
    owner: AccountId,
    // Mapping of address to its scam votes
    scam_votes: LookupMap<AccountId, u64>,
    // Mapping of address to its non-scam votes
    non_scam_votes: LookupMap<AccountId, u64>,
    // Set of blacklisted addresses
    blacklist: UnorderedSet<AccountId>,
    // Threshold for blacklisting (e.g., 10 votes)
    blacklist_threshold: u64,
    // Threshold for removing from blacklist (e.g., 5 votes)
    remove_threshold: u64,
}

#[near_bindgen]
impl ScamVotingContract {
    #[init]
    pub fn new(owner: AccountId, blacklist_threshold: u64, remove_threshold: u64) -> Self {
        Self {
            owner,
            scam_votes: LookupMap::new(b"s"),
            non_scam_votes: LookupMap::new(b"n"),
            blacklist: UnorderedSet::new(b"b"),
            blacklist_threshold,
            remove_threshold,
        }
    }

    pub fn vote_scam(&mut self, address: AccountId) {
        let votes = self.scam_votes.get(&address).unwrap_or(0) + 1;
        self.scam_votes.insert(&address, &votes);

        if votes >= self.blacklist_threshold && !self.blacklist.contains(&address) {
            self.blacklist.insert(&address);
        }
    }

    pub fn vote_non_scam(&mut self, address: AccountId) {
        let votes = self.non_scam_votes.get(&address).unwrap_or(0) + 1;
        self.non_scam_votes.insert(&address, &votes);

        if votes >= self.remove_threshold && self.blacklist.contains(&address) {
            self.blacklist.remove(&address);
        }
    }

    pub fn is_blacklisted(&self, address: AccountId) -> bool {
        self.blacklist.contains(&address)
    }

    pub fn get_blacklist(&self) -> Vec<AccountId> {
        self.blacklist.to_vec()
    }

    pub fn get_scam_votes(&self, address: AccountId) -> u64 {
        self.scam_votes.get(&address).unwrap_or(0)
    }

    pub fn get_non_scam_votes(&self, address: AccountId) -> u64 {
        self.non_scam_votes.get(&address).unwrap_or(0)
    }

    #[payable]
    pub fn reset_votes(&mut self, address: AccountId) {
        assert_eq!(
            env::predecessor_account_id(),
            self.owner,
            "Only the owner can reset votes"
        );
        self.scam_votes.remove(&address);
        self.non_scam_votes.remove(&address);
        if self.blacklist.contains(&address) {
            self.blacklist.remove(&address);
        }
    }

    #[payable]
    pub fn set_blacklist_threshold(&mut self, new_threshold: u64) {
        assert_eq!(
            env::predecessor_account_id(),
            self.owner,
            "Only the owner can change the threshold"
        );
        self.blacklist_threshold = new_threshold;
    }

    #[payable]
    pub fn set_remove_threshold(&mut self, new_threshold: u64) {
        assert_eq!(
            env::predecessor_account_id(),
            self.owner,
            "Only the owner can change the threshold"
        );
        self.remove_threshold = new_threshold;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::{testing_env, VMContext};

    fn get_context(predecessor: AccountId) -> VMContext {
        VMContextBuilder::new()
            .predecessor_account_id(predecessor)
            .build()
    }

    #[test]
    fn test_vote_and_blacklist() {
        let owner = AccountId::new_unchecked("owner.near".to_string());
        let context = get_context(owner.clone());
        testing_env!(context);

        let mut contract = ScamVotingContract::new(owner, 3, 2);
        let address = AccountId::new_unchecked("suspicious.near".to_string());

        assert_eq!(contract.is_blacklisted(address.clone()), false);

        contract.vote_scam(address.clone());
        contract.vote_scam(address.clone());
        assert_eq!(contract.is_blacklisted(address.clone()), false);

        contract.vote_scam(address.clone());
        assert_eq!(contract.is_blacklisted(address.clone()), true);

        assert_eq!(contract.get_scam_votes(address.clone()), 3);
    }

    #[test]
    fn test_remove_from_blacklist() {
        let owner = AccountId::new_unchecked("owner.near".to_string());
        let context = get_context(owner.clone());
        testing_env!(context);

        let mut contract = ScamVotingContract::new(owner, 3, 2);
        let address = AccountId::new_unchecked("suspicious.near".to_string());

        contract.vote_scam(address.clone());
        contract.vote_scam(address.clone());
        contract.vote_scam(address.clone());
        assert_eq!(contract.is_blacklisted(address.clone()), true);

        contract.vote_non_scam(address.clone());
        assert_eq!(contract.is_blacklisted(address.clone()), true);

        contract.vote_non_scam(address.clone());
        assert_eq!(contract.is_blacklisted(address.clone()), false);

        assert_eq!(contract.get_non_scam_votes(address.clone()), 2);
    }
}