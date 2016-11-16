import steem from 'steem';
import steemAuth from 'steemauth';

export const TRANSFER_STEEM_REQUEST = '@payments/TRANSFER_STEEM_REQUEST';
export const TRANSFER_STEEM_SUCCESS = '@payments/TRANSFER_STEEM_SUCCESS';
export const TRANSFER_STEEM_FAILURE = '@payments/TRANSFER_STEEM_FAILURE';

export function transfer(transferDetails) {
  return (dispatch) => {
    const { passwordOrWif, from, memo = '', to, balance } = transferDetails;
    const isWif = steemAuth.isWif(passwordOrWif);
    const ownerKey = (isWif) ? passwordOrWif : steemAuth.toWif(from, passwordOrWif, 'owner');
    dispatch({ type: TRANSFER_STEEM_REQUEST });
    steem.broadcast.transfer(ownerKey, from, to, balance, memo, (result) => {
      if (result) {
        dispatch({ type: TRANSFER_STEEM_FAILURE, errorMessage: 'Could not transfer' });
      } else {
        dispatch({ type: TRANSFER_STEEM_SUCCESS });
      }
    });
  };
}
