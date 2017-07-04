import React, { Component } from 'react';
import Icon from '../../widgets/Icon';

export default class Sign extends Component {
  constructor(props) {
    super(props);
  };

  componentDidMount = () => {
    console.log(this.props.result);
    const cb = this.props.cb;
    if (cb) {
      setTimeout(() => {
        window.location.href = this.props.cb;
      }, 5000);
    }
  };

  render() {
    const { result, cb } = this.props;
    return (
      <div>
        <h2><Icon name="check" className="text-success" lg /> Success</h2>
        <h5 className="mb-4">The operation has been successfully broadcasted.</h5>
        {cb &&
          <p>
            If you are not redirected within 10 seconds{' '}
            <a href={cb} target="_blank">click here</a>.
          </p>
        }
      </div>
    );
  };
}
