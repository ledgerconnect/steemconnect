/* eslint-disable react/prefer-stateless-function */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loading from '../widgets/Loading';
import Dashboard from '../components/Dashboard';
import LandingPage from './LandingPage';

@connect(
  state => ({
    auth: state.auth,
  })
)
export default class Index extends Component {
  static propTypes = {
    auth: PropTypes.shape({}).isRequired,
  };

  render() {
    const { auth: { isLoading, isAuthenticated } } = this.props;
    return (
      <div>
        { isLoading && <div className="centered-loading"><Loading /></div>}
        { !isLoading && isAuthenticated && <Dashboard />}
        { !isLoading && !isAuthenticated && <LandingPage />}
      </div>
    );
  }
}
