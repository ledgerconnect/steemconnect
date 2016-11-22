import React from 'react';

const Modal = ({ overlay, children }) => {
  const className = overlay ? 'modal modal-overlay' : 'modal';
  return (
    <div className={className}>
      <div className="modal-body">
        {children}
      </div>
    </div>
  );
};

export default Modal;
