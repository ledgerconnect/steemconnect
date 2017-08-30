import React, { Component } from 'react';
import _ from 'lodash';
import changeCase from 'change-case';
import steem, { formatter } from 'steem';

export default class SignPlaceholderVestingShares extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vestingSharesDisplay: null,
    };
  }

  async componentWillMount() {
    const globalProps = await steem.api.getDynamicGlobalPropertiesAsync();
    const { query } = this.props;

    let vestingSharesDisplay = query.vesting_shares;
    if (query.vesting_shares && query.vesting_shares.includes('VESTS')) {
      vestingSharesDisplay = _.join(
        [
          formatter.vestToSteem(query.vesting_shares, globalProps.total_vesting_shares, globalProps.total_vesting_fund_steem).toFixed(3),
          'SP'
        ], ' ');
    } else if (query.vesting_shares) {
      const [amount, symbol] = query.vesting_shares.split(' ');
      vestingSharesDisplay = _.join([parseFloat(amount).toFixed(3), symbol], ' ');
    }
    this.setState({ vestingSharesDisplay });
  }

  render() {
    const { type, query } = this.props;
    return (
      <div>
        <h2>{ changeCase.titleCase(type) }</h2>
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
            {this.state.vestingSharesDisplay &&
              <tr>
                <td className="label"><b>Vesting Share</b></td>
                <td>{this.state.vestingSharesDisplay}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    );
  }
}
