import React from 'react';
import { Link } from 'react-router';

const Modal = ({ overlay, children }) => {
  const className = overlay ? 'modal modal-overlay' : 'modal';
  const logo = overlay ? 'logo-white.svg' : 'logo.svg';
  return (
    <div className={className}>
      <div className="modal-body">
        <Link to="/"><img alt="Steem Connect" className="modal-logo" src={`/img/${logo}`} /></Link>
        {children}
      </div>
    </div>
  );
};

export default Modal;
