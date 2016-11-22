import React from 'react';
import { Link } from 'react-router';

const Modal = ({ overlay, children }) => {
  const className = overlay ? 'modal modal-overlay' : 'modal';
  return (
    <div className={className}>
      <div className="modal-body">
        <Link to="/"><img alt="Steem Connect" className="modal-logo" src="/img/logo.svg" /></Link>
        {children}
      </div>
    </div>
  );
};

export default Modal;
