import React from 'react';
import './AddButton.css';

const AddButton = ({ text, onClick, disabled = false }) => {
  return (
    <button
      className="add-button"
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <span className="add-button__icon">+</span>
      <span className="add-button__text">{text}</span>
    </button>
  );
};

export default AddButton;
