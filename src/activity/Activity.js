import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import ActivityList from '../activity/ActivityList';
import { getAccountHistory } from '../actions';
import Loading from '../widgets/Loading';

class Activity extends Component {
  componentDidMount() {
    this.props.getAccountHistory(this.props.auth.user.name, -1, 10);
  }
  render() {
    const { accountHistory } = this.props.auth.user;
    return (
      <div>
        <h1 className="mvl">Activity</h1>
        <div className="container">
          <div className="block block-dashboard">
            {accountHistory ? <div>
              <ul className="list list-activity">
                {accountHistory && _.sortBy(accountHistory, 'timestamp').reverse().map(([id, transaction]) =>
                  <ActivityList key={id} id={id} transaction={transaction} />) }
              </ul>
              <div className="list-more pas">
                <a href="#">See more</a>
              </div>
            </div> : <Loading />}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  getAccountHistory: bindActionCreators(getAccountHistory, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
