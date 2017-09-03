import React, { PropTypes } from 'react';
import './Icon.less';

const Icon = ({
  name,
  style,
  className = '',
  xs = false,
  sm = false,
  md = false,
  lg = false,
  xl = false,
}) => {
  let size = 'icon-md';
  size = (xs) ? 'icon-xs' : size;
  size = (sm) ? 'icon-sm' : size;
  size = (md) ? 'icon-md' : size;
  size = (lg) ? 'icon-lg' : size;
  size = (xl) ? 'icon-xl' : size;
  return (
    <i className={`material-icons icon ${size} ${className}`} style={style}>{ name }</i>
  );
};

Icon.propTypes = {
  name: PropTypes.string,
  style: PropTypes.string,
  className: PropTypes.string,
  xs: PropTypes.bool,
  sm: PropTypes.bool,
  md: PropTypes.bool,
  lg: PropTypes.bool,
  xl: PropTypes.bool,
};

export default Icon;
