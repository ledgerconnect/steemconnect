import React, { PropTypes } from 'react';

const Loading = (props) => {
  let className = (props.color === 'white') ? 'loading-white' : 'loading';
  className += ' align-center';
  return (
    <div className="pam pbl">
      <div className={className}><span>.</span><span>.</span><span>.</span></div>
    </div>
  );
};

Loading.propTypes = {
  color: PropTypes.string,
};

export default Loading;
