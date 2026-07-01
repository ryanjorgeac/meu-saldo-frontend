import React from 'react';
import './CategoryChip.css';

const CategoryChip = ({ categoryName, color }) => {
  const style = color
    ? { backgroundColor: color, color: '#fff' }
    : undefined;

  return (
    <div className="category-chip" style={style}>
      {categoryName}
    </div>
  );
};

export default CategoryChip;