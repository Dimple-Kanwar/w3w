use near_sdk::test_utils::VMContextBuilder;
use near_sdk::{testing_env, AccountId, VMContext};
use scam_voting_contract::ScamVotingContract;

fn get_context(predecessor: AccountId) -> VMContext {
    VMContextBuilder::new()
        .predecessor_account_id(predecessor)
        .build()
}

#[test]
fn test_new_contract() {
    let owner = AccountId::new_unchecked("owner.near".to_string());
    let context = get_context(owner.clone());
    testing_env!(context);

    let contract = ScamVotingContract::new(owner.clone(), 3, 2);
    assert_eq!(contract.get_blacklist().len(), 0);
}

#[test]
fn test_vote_scam() {
    let owner = AccountId::new_unchecked("owner.near".to_string());
    let context = get_context(owner.clone());
    testing_env!(context);

    let mut contract = ScamVotingContract::new(owner, 3, 2);
    let address = AccountId::new_unchecked("suspicious.near".to_string());

    contract.vote_scam(address.clone());
    assert_eq!(contract.get_scam_votes(address.clone()), 1);
    assert_eq!(contract.is_blacklisted(address.clone()), false);

    contract.vote_scam(address.clone());
    contract.vote_scam(address.clone());
    assert_eq!(contract.get_scam_votes(address.clone()), 3);
    assert_eq!(contract.is_blacklisted(address.clone()), true);
}

#[test]
fn test_vote_non_scam() {
    let owner = AccountId::new_unchecked("owner.near".to_string());
    let context = get_context(owner.clone());
    testing_env!(context);

    let mut contract = ScamVotingContract::new(owner, 3, 2);
    let address = AccountId::new_unchecked("suspicious.near".to_string());

    // First, blacklist the address
    contract.vote_scam(address.clone());
    contract.vote_scam(address.clone());
    contract.vote_scam(address.clone());
    assert_eq!(contract.is_blacklisted(address.clone()), true);

    // Now, vote non-scam
    contract.vote_non_scam(address.clone());
    assert_eq!(contract.get_non_scam_votes(address.clone()), 1);
    assert_eq!(contract.is_blacklisted(address.clone()), true);

    contract.vote_non_scam(address.clone());
    assert_eq!(contract.get_non_scam_votes(address.clone()), 2);
    assert_eq!(contract.is_blacklisted(address.clone()), false);
}

#[test]
fn test_get_blacklist() {
    let owner = AccountId::new_unchecked("owner.near".to_string());
    let context = get_context(owner.clone());
    testing_env!(context);

    let mut contract = ScamVotingContract::new(owner, 2, 2);
    let address1 = AccountId::new_unchecked("suspicious1.near".to_string());
    let address2 = AccountId::new_unchecked("suspicious2.near".to_string());

    contract.vote_scam(address1.clone());
    contract.vote_scam(address1.clone());
    contract.vote_scam(address2.clone());
    contract.vote_scam(address2.clone());

    let blacklist = contract.get_blacklist();
    assert_eq!(blacklist.len(), 2);
    assert!(blacklist.contains(&address1));
    assert!(blacklist.contains(&address2));
}

#[test]
#[should_panic(expected = "Only the owner can reset votes")]
fn test_reset_votes_non_owner() {
    let owner = AccountId::new_unchecked("owner.near".to_string());
    let context = get_context(owner.clone());
    testing_env!(context);

    let mut contract = ScamVotingContract::new(owner, 3, 2);
    let address = AccountId::new_unchecked("suspicious.near".to_string());

    contract.vote_scam(address.clone());

    // Try to reset votes as non-owner
    let non_owner = AccountId::new_unchecked("non_owner.near".to_string());
    let context = get_context(non_owner);
    testing_env!(context);

    contract.reset_votes(address);
}

#[test]
fn test_reset_votes_owner() {
    let owner = AccountId::new_unchecked("owner.near".to_string());
    let context = get_context(owner.clone());
    testing_env!(context);

    let mut contract = ScamVotingContract::new(owner.clone(), 3, 2);
    let address = AccountId::new_unchecked("suspicious.near".to_string());

    contract.vote_scam(address.clone());
    contract.vote_scam(address.clone());
    contract.vote_scam(address.clone());
    assert_eq!(contract.is_blacklisted(address.clone()), true);

    // Reset votes as owner
    contract.reset_votes(address.clone());

    assert_eq!(contract.get_scam_votes(address.clone()), 0);
    assert_eq!(contract.is_blacklisted(address.clone()), false);
}

#[test]
fn test_change_thresholds() {
    let owner = AccountId::new_unchecked("owner.near".to_string());
    let context = get_context(owner.clone());
    testing_env!(context);

    let mut contract = ScamVotingContract::new(owner.clone(), 3, 2);
    let address = AccountId::new_unchecked("suspicious.near".to_string());

    contract.set_blacklist_threshold(2);
    contract.set_remove_threshold(3);

    contract.vote_scam(address.clone());
    contract.vote_scam(address.clone());
    assert_eq!(contract.is_blacklisted(address.clone()), true);

    contract.vote_non_scam(address.clone());
    contract.vote_non_scam(address.clone());
    assert_eq!(contract.is_blacklisted(address.clone()), true);

    contract.vote_non_scam(address.clone());
    assert_eq!(contract.is_blacklisted(address.clone()), false);
}