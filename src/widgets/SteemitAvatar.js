import React, { PropTypes } from 'react';
import './SteemitAvatar.less';

const SteemitAvatar = ({
  username,
  size = '36',
  className = '',
}) =>
  <span
    style={{
      height: `${size}px`,
      width: `${size}px`,
    }}
  >
    <div
      className={`SteemitAvatar ${className}`}
      style={{
        height: `${size}px`,
        width: `${size}px`,
        backgroundImage: `url(https://steemitimages.com/u/${username}/avatar)`,
      }}
    />
  </span>
;

SteemitAvatar.propTypes = {
  username: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};

export default SteemitAvatar;
