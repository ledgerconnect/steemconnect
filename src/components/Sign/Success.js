import React, { Component, PropTypes } from 'react';

export default class Sign extends Component {
  static propTypes = {
    cb: PropTypes.func,
  }

  componentDidMount = () => {
    const cb = this.props.cb;
    if (cb) {
      setTimeout(() => {
        window.location.href = this.props.cb;
      }, 5000);
    }
  };

  render() {
    const { cb } = this.props;
    return (
      <div>
        <div className="Sign__error-title-bg">
          <object data="/img/signin/success.svg" type="image/svg+xml" id="success-icon" />
        </div>
        <h2>Congratulations</h2>
        <h5>The operation has been successfully broadcasted.</h5>
        {cb &&
          <p>
            If you are not redirected within 10 seconds{' '}<br />
            <a className="signin-button" href={cb} target="_blank" rel="noopener noreferrer">click here</a>.
          </p>
        }
      </div>
    );
  }
}
