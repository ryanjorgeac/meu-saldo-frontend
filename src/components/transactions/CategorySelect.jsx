import React from "react";
import Select from "react-select";
import "./CategorySelect.css";

function CategorySelect({
  selectedCategories,
  onChange,
  placeholder = "Categoria",
  options = [],
}) {
  return (
    <Select
      isMulti
      value={selectedCategories}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      classNamePrefix="category-select"
      className="category-select-container category-filter"
      hideSelectedOptions={false}
    />
  );
}

export default CategorySelect;
