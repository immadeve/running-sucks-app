import React from 'react';

interface AppButtonProps {
  text: string;
  className?: string;
  isActive: boolean;
  onButtonClick: (buttonName: string, buttonId: string) => void;
}

export const AppButton: React.FC<AppButtonProps> = ({
  text,
  className = 'App-button',
  isActive,
  onButtonClick,
}) => {
  const tabClassName = `${className} ${isActive ? 'tab-active' : 'tab-inactive'}`;

  // Generate a unique button ID based on the text
  const buttonId = text.toLowerCase().replace(/\s+/g, '_');

  const handleButtonClickEvent = () => {
    // Handle button click analytics
    onButtonClick(text, buttonId);
    // Handle tab change (includes filter reset
  };

  // Check if this is the hate running button
  const isHateButton = text.toLowerCase().includes('hate');

  return (
    <button className={tabClassName} onClick={handleButtonClickEvent}>
      {isHateButton && (
        <img
          src="/wojak.png"
          alt="Crying wojak"
          style={{
            width: '20px',
            height: '20px',
            marginRight: '8px',
            verticalAlign: 'middle',
          }}
        />
      )}
      {text}
    </button>
  );
};
