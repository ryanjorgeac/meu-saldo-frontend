import React from "react";
import { iconMap } from "./icons"

const defaultColor = "#9c9c9c"

const Icon = ({ icon, ...props }) => {
  const IconComponent = iconMap[icon] || iconMap["happyFace"];
  
  return (
    <IconComponent color={defaultColor} {...props} />
  );
};

export default Icon;
