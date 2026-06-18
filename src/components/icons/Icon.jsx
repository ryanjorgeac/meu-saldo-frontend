import React from "react";
import { iconMap } from "./icons"

const defaultColor = "var(--icon-default-color)"

const Icon = ({ icon, ...props }) => {
  const IconComponent = iconMap[icon] || iconMap.tag;
  
  return (
    <IconComponent color={defaultColor} {...props} />
  );
};

export default Icon;
