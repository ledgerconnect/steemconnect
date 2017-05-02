import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { authenticate } from './actions';
import './App.scss';

@connect(
  state => ({
    app: state.app,
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
        { app: this.props.app }
      )
    );
  }
}
