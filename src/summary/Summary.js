import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Header from './../app/header';
import Activity from '../activity/ActivityList';
import { getAccountHistory } from './../actions';


class Dashboard extends Component {
  componentDidMount() {
    this.props.getAccountHistory(this.props.auth.user.name, -1, 10);
  }
  render() {
    const { accountHistory } = this.props.auth.user;
    return (
      <div>
        <Header />
        <h2 className="ptl pbm">Last Activity</h2>
        <div className="container">
          <div className="block block-dashboard">
            <ul className="list list-activity">
              {accountHistory && _.sortBy(accountHistory, 'timestamp').reverse().map(([id, transaction]) =>
                <Activity key={id} id={id} transaction={transaction} />) }
            </ul>
            <div className="list-more pas">
              <a href="#">See more</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.object.isRequired,
  }),
  getAccountHistory: PropTypes.func,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  getAccountHistory: bindActionCreators(getAccountHistory, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
