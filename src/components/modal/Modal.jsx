import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

export const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing(!isShowing);
  }

  useEffect(() => {
    if (isShowing) {
      document.body.style.overflow = 'hidden';
    } else document.body.style.overflow = 'unset';
  }, [isShowing]);
  return {
    isShowing,
    toggle,
  };
};

export function Modal({
  isShowing,
  hide,
  children,
  name,
}) {
  return isShowing ? ReactDOM.createPortal(
    <>
      <div className="modal-overlay" />
      <div className="modal-wrapper" tabIndex="-1">
        <div className="modal">
          <div className="modal-header">
            <span>{name}</span>
            <button type="button" className="modal-close-button" onClick={hide}>
              <span>&times;</span>
            </button>
          </div>
          {children}
        </div>
      </div>
    </>,
    document.body,
  ) : null;
}
