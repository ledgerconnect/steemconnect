import React from 'react';
import './Avatar.scss';

const Icon = ({
  username,
  size = '36',
  className = '',
}) => {
  return (
    <span
      className={`Avatar ${className}`}
      style={{ height: `${size}px`, width: `${size}px` }}
    >
      <img src={`https://img.steemconnect.com/@${username}?s=${size}`}/>
    </span>
  );
};

export default Icon;
