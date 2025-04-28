import React, { useEffect, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import "./AmountInput.css";

function AmountInput({
  name,
  value,
  onChange,
  placeholder = "0,00"
}) {
  const [displayValue, setDisplayValue] = useState("");
  
  const formatCurrency = (value) => {
    const cents = Math.floor(parseFloat(value) * 100);
    if (isNaN(cents)) return "";

    const reaisValue = (cents / 100).toFixed(2);
    
    const [integerPart, decimalPart] = reaisValue.split('.');
    let formattedInteger = integerPart;
    if (integerPart.length > 3) {
      formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    return `${formattedInteger},${decimalPart}`;
  };

  useEffect(() => {
    if (value !== undefined && value !== "") {
      setDisplayValue(formatCurrency(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleInputChange = (e) => {
    const numericInput = e.target.value.replace(/\D/g, "");
    
    if (!numericInput) {
      setDisplayValue("");
      onChange({ target: { name, value: "" } });
      return;
    }
    const cents = parseInt(numericInput, 10);
    const reais = cents / 100;
    const formattedValue = formatCurrency(reais);
    setDisplayValue(formattedValue);

    onChange({ target: { name, value: reais } });
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="amount-input-container">
      <MdOutlineAttachMoney className="amount-icon" />
      <input
        type="text"
        name={name}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="amount-input"
      />
    </div>
  );
}

export default AmountInput;