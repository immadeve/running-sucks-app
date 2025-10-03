import React from 'react';

interface IconProps {
  emoji: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  ariaLabel?: string;
  filterColor?: string;
}

export const Icon: React.FC<IconProps> = ({
  emoji,
  className = '',
  size = 'medium',
  ariaLabel,
  filterColor,
}) => {
  const sizeClasses = {
    small: 'icon-small',
    medium: 'icon-medium',
    large: 'icon-large',
  };

  const combinedClassName = `icon ${sizeClasses[size]} ${className}`.trim();

  // Temporarily disable color filtering due to CSS filter limitations with emojis
  // TODO: Implement a better solution for emoji coloring
  const getColorStyle = (color?: string) => {
    // For now, return empty style to show original emoji colors
    // This ensures icons are visible and functional
    return {};
  };

  return (
    <span
      className={combinedClassName}
      role="img"
      aria-label={ariaLabel || emoji}
      style={getColorStyle(filterColor)}>
      {emoji}
    </span>
  );
};
