import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', overlay = false }) => {
  const spinnerClass = `spinner spinner-${size}${overlay ? ' spinner-overlay' : ''}`;
  
  return (
    <div className={spinnerClass}>
      <div className="spinner-circle"></div>
      <p className="spinner-text">Carregando...</p>
    </div>
  );
};

export default LoadingSpinner;