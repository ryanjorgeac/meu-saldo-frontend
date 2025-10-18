import React, { useEffect } from 'react';
import { AlertCircle } from '../icons'
import CloseX from '../common/CloseX'
import './ErrorModal.css';

const ErrorModal = ({ title, message, onClose }) => {
  useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);
  
  return (
    <div className="error-modal-overlay">
      <div className="error-modal-content" onClick={e => e.stopPropagation()}>
        <div className="error-modal">
          <div className="error-modal-header">
            <div className="error-modal-header-content">
              <AlertCircle fontSize="22" color="red" />
              <h2>{title}</h2>
            </div>
            <CloseX onClick={onClose} />
          </div>
          <div className="error-modal-body">
            <p>{message}</p>
          </div>
          <div className="error-modal-footer">
            <button 
              type="button" 
              className="error-modal-close-button"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
