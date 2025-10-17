import React from 'react';
import { IoIosClose } from "../icons";
import './CloseX.css';

const CloseX = ({ onClick }) => {
  return (
    <button
      className="close-x-button"
      onClick={onClick}
      type="button"
    >
      <IoIosClose className="close-x-icon"/>
    </button>
  );
};

export default CloseX;
