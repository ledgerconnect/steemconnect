import React from 'react';

const SignPlaceholderDelegateVestingShares = ({ query }) =>
  <div>
    {query.vesting_shares_display && <h2>Delegate Vesting Shares</h2>}
    {!query.vesting_shares_display && <h2>Undelegate Vesting Shares</h2>}
    <table className="table text-left">
      <tbody>
        {query.delegator &&
        <tr>
          <td className="label"><b>Delegator</b></td>
          <td>{query.delegator}</td>
        </tr>
        }
        {query.delegatee &&
        <tr>
          <td className="label"><b>Delegatee</b></td>
          <td>{query.delegatee}</td>
        </tr>
        }
        {query.vesting_shares && query.vesting_shares_display &&
        <tr>
          <td className="label"><b>STEEM POWER</b></td>
          <td>{query.vesting_shares_display}</td>
        </tr>
        }
      </tbody>
    </table>
  </div>
;
export default SignPlaceholderDelegateVestingShares;
