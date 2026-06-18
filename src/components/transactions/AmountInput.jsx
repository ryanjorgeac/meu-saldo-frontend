import React, { useEffect, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import { formatMoneyInput } from "../../utils/money";
import "./AmountInput.css";

function AmountInput({
  name,
  value,
  onChange,
  placeholder = "0,00"
}) {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (value !== undefined && value !== "") {
      setDisplayValue(formatMoneyInput(value));
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

    const formattedValue = formatMoneyInput(numericInput);
    setDisplayValue(formattedValue);

    onChange({ target: { name, value: formattedValue } });
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