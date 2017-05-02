import React, { Component } from 'react';
import './App.scss';

export default class Wrapper extends Component {
  render() {
    return this.props.children;
  }
}
