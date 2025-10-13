import React from "react";
import {
  FaBus,
  FaBookOpen,
  FaCoffee,
  MdOutlineEdit,
  FaGift,
  GoGraph,
  FaRegFaceGrin,
  FaRegMap,
  FaShieldAlt,
  RiShoppingBag4Fill,
  FiTool,
  FaTrash
} from "./index";

const iconMap = {
  bus: FaBus,
  book: FaBookOpen,
  coffee: FaCoffee,
  edit: MdOutlineEdit,
  gift: FaGift,
  graph: GoGraph,
  happyface: FaRegFaceGrin,
  map: FaRegMap,
  shield: FaShieldAlt,
  shoppingbag: RiShoppingBag4Fill,
  tool: FiTool,
  trash: FaTrash
};

const defaultColor = "#9c9c9c"

const Icon = ({ icon, ...props }) => {
  const IconComponent = iconMap[icon?.toLowerCase()] || FaRegFaceGrin;
  
  return (
    <IconComponent color={defaultColor} {...props} />
  );
};

export default Icon;
