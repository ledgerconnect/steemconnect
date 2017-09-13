const operations = `
account_witness_proxy
account_witness_vote
claim_reward_balance
cancel_transfer_from_savings
comment_options
custom_json
decline_voting_rights
delegate_vesting_shares
delete_comment
escrow_approve
escrow_dispute
escrow_release
escrow_transfer
set_reset_account
transfer
transfer_from_savings
transfer_to_savings
transfer_to_vesting
vote
withdraw_vesting
`.trim().split('\n');

export default operations;
