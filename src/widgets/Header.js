import React from 'react';
import { Link } from 'react-router';
import Avatar from './Avatar';
import './Header.less';

const Header = ({ username }) =>
  <div className="Header">
    <div className="Header__log">
      {username &&
        <Link to="/dashboard">
          <span className="username">{username}</span>
          <div className="avatar"><Avatar username={username} /></div>
        </Link>
      }
      {!username &&
        <div>
          <Link to="/login">Log In</Link>
        </div>
      }
    </div>
  </div>;

export default Header;
