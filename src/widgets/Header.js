import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import Avatar from './Avatar';
import './Header.less';

const Header = ({ username }) =>
  <div className="Header container">
    <div className="Header__log">
      {username &&
        <Link to="/dashboard">
          <span className="mr-2">{username}</span>
          <div className="float-right"><Avatar username={username} /></div>
        </Link>
      }
      {!username &&
        <div>
          <Link to="/login"><FormattedMessage id="log_in" /></Link>
        </div>
      }
    </div>
  </div>;

Header.propTypes = {
  username: PropTypes.string,
};

export default Header;
