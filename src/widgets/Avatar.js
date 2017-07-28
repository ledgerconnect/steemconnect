import React from 'react';
import './Avatar.less';

const Avatar = ({
  username,
  icon,
  size = '36',
  className = '',
}) => {
  let src;
  if (username) {
    src = `https://img.steemconnect.com/@${username}?s=${size}`;
  } else if (icon) {
    src = `https://steemitimages.com/${size}x${size}/${icon}`;
  } else {
    src = `https://img.steemconnect.com/@steemconnect?s=${size}`;
  }
  return (
    <span
      className={`Avatar ${className}`}
      style={{ height: `${size}px`, width: `${size}px` }}
    >
      <img src={src} alt="avatar" />
    </span>
  );
};

export default Avatar;
