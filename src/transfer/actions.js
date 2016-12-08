import steem from 'steem';
import steemAuth from 'steemauth';
import { updateProfile } from '../actions';

export const TRANSFER_STEEM_REQUEST = '@transfer/TRANSFER_STEEM_REQUEST';
export const TRANSFER_STEEM_SUCCESS = '@transfer/TRANSFER_STEEM_SUCCESS';
export const TRANSFER_STEEM_FAILURE = '@transfer/TRANSFER_STEEM_FAILURE';

export function transfer(transferDetails) {
  return (dispatch) => {
    const { passwordOrWif, from, memo = '', to, balance } = transferDetails;
    const isWif = steemAuth.isWif(passwordOrWif);
    const activeKey = (isWif) ? passwordOrWif : steemAuth.toWif(from, passwordOrWif, 'active');
    dispatch({ type: TRANSFER_STEEM_REQUEST });
    return new Promise((resolve, reject) => {
      steem.broadcast.transfer(activeKey, from, to, balance, memo, (result) => {
        if (result) {
          dispatch({ type: TRANSFER_STEEM_FAILURE, errorMessage: 'Could not transfer' });
          let message;

          if (result.toString().search('does not have sufficient funds') >= 0) {
            message = 'Insufficient funds';
          } else if (result.toString().search('missing required active') >= 0) {
            message = 'Incorrect Password';
          }
          reject({ message });
        } else {
          dispatch(updateProfile(from));
          resolve(dispatch({ type: TRANSFER_STEEM_SUCCESS }));
        }
      });
    });
  };
}
