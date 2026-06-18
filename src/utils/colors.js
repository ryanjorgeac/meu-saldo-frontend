export const CATEGORY_COLORS = [
  '#6200EE', // Purple
  '#03DAC6', // Teal
  '#FF6B6B', // Red
  '#4ECDC4', // Mint
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Seafoam
  '#F7DC6F'  // Gold
];

export const DEFAULT_CATEGORY_STYLE = {
  color: '#9CA3AF',
  icon: 'tag',
};

export const DEFAULT_CATEGORY_COLOR = DEFAULT_CATEGORY_STYLE.color;
export const DEFAULT_CATEGORY_ICON = DEFAULT_CATEGORY_STYLE.icon;

const isBlank = (value) => value == null || value.trim() === '';

export const resolveCategoryStyle = (category = {}) => ({
  color: isBlank(category.color)
    ? DEFAULT_CATEGORY_STYLE.color
    : category.color,
  icon: isBlank(category.icon)
    ? DEFAULT_CATEGORY_STYLE.icon
    : category.icon,
});
