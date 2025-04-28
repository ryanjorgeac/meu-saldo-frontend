import React from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchInput.css";

function SearchInput({ 
  value, 
  onChange, 
  name = "search", 
  placeholder = "Buscar transação" 
}) {
  return (
    <div className="search-box">
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SearchInput;