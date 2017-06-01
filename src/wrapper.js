import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { authenticate } from './actions/auth';
import './styles/common.less';

@connect(
  state => ({
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    authenticate,
  }, dispatch)
)
export default class Wrapper extends Component {
  componentWillMount() {
    this.props.authenticate();
  }

  render() {
    return (
      React.cloneElement(
        this.props.children,
        { auth: this.props.auth }
      )
    );
  }
}
