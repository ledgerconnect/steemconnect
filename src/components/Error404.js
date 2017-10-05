import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import Icon from '../widgets/Icon';

const Error404 = () =>
  <div className="Sign">
    <div className="Sign__content container my-2">
      <h2><Icon name="error_outline" lg /> <FormattedMessage id="oops" /></h2>
      <p>
        <FormattedMessage id="error_404" values={{ link: <Link to="/"><FormattedMessage id="home_page" /></Link> }} />
      </p>
    </div>
  </div>
;

export default Error404;
