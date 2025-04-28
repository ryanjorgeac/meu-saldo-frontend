import React from 'react';
import './CategoryChip.css';

const CategoryChip = ({ categoryName }) => {
  return (
    <div className="category-chip">
      {categoryName}
    </div>
  );
};

export default CategoryChip;