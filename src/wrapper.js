import React, { Component, PropTypes } from 'react';
import steem from 'steem';
import './App.scss';

steem.api.setWebSocket(process.env.WS);

export default class Wrapper extends Component {
  render() {
    return this.props.children;
  }
}
