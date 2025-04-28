import React from 'react';
import { useState } from 'react';
import './DateInput.css';

const DateInput = ({
  name,
  value,
  onChange,
  placeholder,
  className = '',
  ...props
}) => {
	const [isValid, setIsValid] = useState(true);
	const currentYear = new Date().getFullYear();

  const validateDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === '') return true;
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
    
    const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1000 || year > currentYear) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;
    
    return true;
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;

    if (!inputValue.trim()) {
      setIsValid(true);
      onChange({
        target: {
          name: e.target.name,
          value: ''
        }
      });
      return;
    }
    
    const digitsOnly = inputValue.replace(/\D/g, '');
    let formattedValue = '';

    if (digitsOnly.length <= 2) {
      formattedValue = digitsOnly;
    } else if (digitsOnly.length <= 4) {
      formattedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
    } else {
      formattedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4, 8)}`;
    }
    const valid = validateDate(formattedValue);
    setIsValid(valid);
  
    const syntheticEvent = {
      target: {
        name: e.target.name,
        value: formattedValue
      }
    };
  
    onChange(syntheticEvent);
  };

  const handleBlur = () => {
    setIsValid(validateDate(value));
  };

  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={`date-input ${className} ${isValid ? '' : 'date-input-error'}`}
      maxLength={10}
      {...props}
    />
  );
};


export default DateInput;