import React, { Component } from 'react';
import * as validator from '../helpers/validatorHelpers';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      valid: {},
    };
  }

  onChange = async (event) => {
    let { name, value, dataset } = event.target;
    const { data, valid } = this.state;
    if (dataset.validator) {
      valid[name] = value.length > 0
        ? await validator[dataset.validator](value)
        : null;
      this.setState({ valid });
    }
    data[name] = value;
    this.setState({ data });
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.props.submit(this.state.data);
  };

  getClasses = (name, value) => {
    return this.state.valid[name] === true
      ? `${value} has-success` : this.state.valid[name] === false
        ? `${value} has-danger` : value;
  };
}
