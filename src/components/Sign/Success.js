import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../widgets/Icon';

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
        <h2><Icon name="check" className="text-success" lg /> <FormattedMessage id="success" /></h2>
        <h5 className="mb-4"><FormattedMessage id="success_operation_broadcasted" /></h5>
        {cb &&
          <p>
            <FormattedMessage id="redirect_ten_seconds" values={{ link: <a href={cb} target="_blank" rel="noopener noreferrer"><FormattedMessage id="click_here" /></a> }} />
          </p>
        }
      </div>
    );
  }
}
