import { Component, PropTypes } from 'react';
import * as validator from '../utils/validator';

export default class Form extends Component {
  static propTypes = {
    submit: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      valid: {},
    };
  }

  onChange = async (event) => {
    const { name, value, dataset } = event.target;
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
    if (this.state.valid[name] === true) {
      return `${value} has-success`;
    } else if (this.state.valid[name] === false) {
      return `${value} has-danger`;
    }
    return value;
  }
}
