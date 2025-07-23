import AnchorIcon from './svg/ancor.svg?react';
import BookIcon from './svg/book.svg?react';
import CoffeeIcon from './svg/coffee.svg?react';
import EditIcon from './svg/edit.svg?react';
import GiftIcon from './svg/gift.svg?react';
import GraphIcon from './svg/graph.svg?react';
import HappyFaceIcon from './svg/happy-face.svg?react';
import MapIcon from './svg/map.svg?react';
import ShieldIcon from './svg/shield.svg?react';
import ShoppingBagIcon from './svg/shopping-bag.svg?react';
import ToolIcon from './svg/tool.svg?react';
import TrashIcon from './svg/trash.svg?react';

export const iconMap = {
  'anchor': AnchorIcon,
  'book': BookIcon,
  'coffee': CoffeeIcon,
  'edit': EditIcon,
  'gift': GiftIcon,
  'graph': GraphIcon,
  'happy-face': HappyFaceIcon,
  'smile': HappyFaceIcon,
  'map': MapIcon,
  'shield': ShieldIcon,
  'shopping-bag': ShoppingBagIcon,
  'tool': ToolIcon,
  'trash': TrashIcon,
};

export {
  AnchorIcon,
  BookIcon,
  CoffeeIcon,
  EditIcon,
  GiftIcon,
  GraphIcon,
  HappyFaceIcon,
  MapIcon,
  ShieldIcon,
  ShoppingBagIcon,
  ToolIcon,
  TrashIcon,
};

export const getIcon = (iconName, fallback = 'anchor') => {
  const IconComponent = iconMap[iconName] || iconMap[fallback] || AnchorIcon;
  return IconComponent;
};
