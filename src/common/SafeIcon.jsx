import React from 'react';
import * as FiIcons from 'react-icons/fi';
import { FiAlertTriangle } from 'react-icons/fi';

const SafeIcon = ({ icon, name, ...props }) => {
  let IconComponent;
  
  try {
    if (icon) {
      IconComponent = icon;
    } else if (name) {
      IconComponent = FiIcons[`Fi${name}`];
    }
  } catch (e) {
    console.error('Icon error:', e);
    IconComponent = FiAlertTriangle;
  }
  
  if (!IconComponent) {
    IconComponent = FiAlertTriangle;
  }
  
  return React.createElement(IconComponent, props);
};

export default SafeIcon;