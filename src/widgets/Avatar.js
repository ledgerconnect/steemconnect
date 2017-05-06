import React from 'react';
import './Avatar.scss';

const Avatar = ({
  username,
  icon,
  size = '36',
  className = '',
}) => {
  const src = username
    ? `https://img.steemconnect.com/@${username}?s=${size}`
    : icon
      ? `https://steemitimages.com/${size}x${size}/${icon}`
      : `https://img.steemconnect.com/@steemconnect?s=${size}`;
  return (
    <span
      className={`Avatar ${className}`}
      style={{ height: `${size}px`, width: `${size}px` }}
    >
      <img src={src}/>
    </span>
  );
};

export default Avatar;
