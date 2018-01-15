import React, { PropTypes } from 'react';
import './SteemitAvatar.less';

const SteemitAvatar = ({
  username,
  type,
  size = '36',
  className = '',
}) =>
  <span
    className={`SteemitAvatar ${className}`}
    style={{ height: `${size}px`, width: `${size}px` }}
  >
    <img
      src={`https://steemitimages.com/u/${username}/avatar/${type}`}
      style={{ height: `${size}px`, width: `${size}px` }}
      alt="avatar"
      onError={event => event.target.setAttribute('src', '/img/default-avatar.png')}
    />
  </span>
;

SteemitAvatar.propTypes = {
  username: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};

export default SteemitAvatar;
