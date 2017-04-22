import React from 'react';
import { Link } from 'react-router';
import Avatar from '../widgets/Avatar';
import './Header.scss';

const Header = ({ username }) =>
  <header className="Header">
    <div className="container">
      <div className="Header__log">
        {username
          ? <Link to="/app">
            <span className="mr-2">{username}</span>
            <div className="float-right"><Avatar username={username} /></div>
          </Link>
          : <Link to="/login">Log In</Link>
        }
      </div>
    </div>
  </header>;

export default Header;
