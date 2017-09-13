const operations = `
account_witness_proxy
account_witness_vote
claim_reward_balance
cancel_transfer_from_savings
comment_options
decline_voting_rights
delete_comment
escrow_approve
escrow_dispute
escrow_release
escrow_transfer
set_reset_account
transfer_from_savings
transfer_to_savings
transfer_to_vesting
withdraw_vesting
`.trim().split('\n');

export default operations;
