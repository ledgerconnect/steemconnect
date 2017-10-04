import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { getErrorMessage } from '../../../helpers/operation';
import Icon from '../../widgets/Icon';

const SignError = ({ error, resetForm }) =>
  <div>
    <h2><Icon name="close" className="text-danger" lg /> <FormattedMessage id="error" /></h2>
    <h5 className="mb-4"><FormattedMessage id="general_error_short" /></h5>
    <p><b>{ getErrorMessage(error) }</b></p>
    <p><FormattedMessage id="do_you_want" values={{ button: <button className="button-link" onClick={() => resetForm()}><FormattedMessage id="try_again" /></button> }} /></p>
  </div>;

SignError.propTypes = {
  resetForm: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.object,
};

export default SignError;
