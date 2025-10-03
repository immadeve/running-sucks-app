import React from 'react';
import { ColorPicker } from './ColorPicker';
import { Icon } from './Icon';

interface AppSettingsProps {
  primaryColor: string;
  onColorChange: (color: string) => void;
}

export const AppSettings: React.FC<AppSettingsProps> = ({ primaryColor, onColorChange }) => {
  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-section">
          <p className="setting-description">
            Choose your preferred color theme for the application.
          </p>
          <ColorPicker currentColor={primaryColor} onColorChange={onColorChange} />
        </div>
      </div>
    </div>
  );
};
