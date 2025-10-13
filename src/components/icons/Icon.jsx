import React from "react";
import { iconMap } from "./"

const defaultColor = "#9c9c9c"

const Icon = ({ icon, ...props }) => {
  const IconComponent = iconMap[icon?.toLowerCase()] || iconMap["happyface"];
  
  return (
    <IconComponent color={defaultColor} {...props} />
  );
};

export default Icon;
