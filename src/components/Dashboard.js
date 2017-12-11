/* eslint-disable camelcase */
import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Progress } from 'antd';
import { connect } from 'react-redux';
import { api, formatter } from 'steem';
import Avatar from '../widgets/Avatar';
import './Dashboard.less';

@connect(
  state => ({
    auth: state.auth,
  }),
  null
)
export default class Dashboard extends Component {
  static propTypes = {
    auth: PropTypes.shape({}),
  }

  constructor(props) {
    super(props);
    this.state = {
      globalProps: {},
    };
  }

  async componentWillMount() {
    const globalProps = await api.getDynamicGlobalPropertiesAsync();
    this.setState({ globalProps });
  }

  getAccountEstimatedValue = () => {
    const { globalProps: { total_vesting_shares, total_vesting_fund_steem } } = this.state;
    const {
      auth: {
        user: {
          balance, sbd_balance,
          vesting_shares, savings_balance, savings_sbd_balance,
        },
      },
    } = this.props;
    const steemPower = formatter.vestToSteem(
      vesting_shares,
      total_vesting_shares,
      total_vesting_fund_steem
    );
    return (
      parseFloat(1.2) * (parseFloat(balance) + parseFloat(savings_balance) + parseFloat(steemPower))
      ) +
      parseFloat(sbd_balance) + parseFloat(savings_sbd_balance);
  }

  render() {
    const {
      auth: {
        user: {
          name, voting_power, last_vote_time, balance, sbd_balance,
          vesting_shares, savings_balance, savings_sbd_balance,
        },
      },
    } = this.props;
    const { globalProps: { total_vesting_shares, total_vesting_fund_steem } } = this.state;
    const secondsAgo = (new Date().getTime() - new Date(`${last_vote_time}Z`).getTime()) / 1000;
    const votingPower = Math.min(10000, voting_power + ((10000 * secondsAgo) / 432000));

    return (
      <div className="container my-5">
        <div className="row">
          <div className="col-6">
            <div className="dashboard-box">
              <div className="dashboard-box-content text-center">
                <Avatar username={name} size="80" />
                <br />
                <span className="username">
                  <FormattedMessage id="welcome" />,&nbsp;{name}
                </span>
              </div>
              <div className="dashboard-box-footer">
                <div className="row">
                  <div className="col-6 footer-box">
                    <div className="row">
                      <div className="col-4">
                        <Progress
                          strokeWidth={10}
                          width={40}
                          type="circle"
                          percent={0}
                          format={() => ''}
                        />
                      </div>
                      <div className="col-8">
                        <span className="box-value">{0}%</span><br />
                        <span className="box-text"><FormattedMessage id="bandwidth" /></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 footer-box">
                    <div className="row">
                      <div className="col-4">
                        <Progress
                          strokeWidth={10}
                          width={40}
                          type="circle"
                          percent={votingPower / 100}
                          format={() => ''}
                        />
                      </div>
                      <div className="col-8">
                        <span className="box-value">{parseFloat(votingPower / 100).toFixed(2)}%</span><br />
                        <span className="box-text"><FormattedMessage id="voting_power" /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="dashboard-box">
              <div className="dashboard-box-content">
                <div className="row">
                  <div className="col-6">
                    <div className="row">
                      <div className="col-4">
                        <object data="img/dashboard/steem.svg" type="image/svg+xml" />
                      </div>
                      <div className="col-8">
                        <span className="box-value">{parseFloat(balance).toFixed(3)}</span><br />
                        <span className="box-text">Steem</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-4">
                        <object data="img/dashboard/steem-dollar.svg" type="image/svg+xml" />
                      </div>
                      <div className="col-8">
                        <span className="box-value">{parseFloat(sbd_balance).toFixed(3)}</span><br />
                        <span className="box-text">Steem Dollars</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="row">
                      <div className="col-4">
                        <object data="img/dashboard/steem-power.svg" type="image/svg+xml" />
                      </div>
                      <div className="col-8">
                        <span className="box-value">
                          {formatter.vestToSteem(
                            vesting_shares,
                            total_vesting_shares,
                            total_vesting_fund_steem
                          ).toFixed(3)}
                        </span><br />
                        <span className="box-text">Steem Power</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-4">
                        <object data="img/dashboard/savings.svg" type="image/svg+xml" />
                      </div>
                      <div className="col-8">
                        <span className="box-value">{parseFloat(savings_balance).toFixed(3)}</span><br />
                        <span className="box-text">Steem</span><br />
                        <span className="box-value">{parseFloat(savings_sbd_balance).toFixed(3)}</span><br />
                        <span className="box-text">Steem Dollars</span><br />
                        <span className="box-text">Savings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dashboard-box-footer">
                TODO
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
