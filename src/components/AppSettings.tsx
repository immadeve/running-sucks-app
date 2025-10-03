import React from 'react';
import { ColorPicker } from './ColorPicker';
import { Icon } from './Icon';

interface AppSettingsProps {
  primaryColor: string;
  onColorChange: (color: string) => void;
  onColorChangeStop?: (color: string) => void;
}

export const AppSettings: React.FC<AppSettingsProps> = ({
  primaryColor,
  onColorChange,
  onColorChangeStop,
}) => {
  return (
    <div className="settings-container">
      <div className="settings-content">
        <h2>
          <Icon emoji="⚙️" filterColor={primaryColor} /> Settings
        </h2>
        <p>Customize your app appearance and preferences.</p>

        <div className="settings-section">
          <h3>
            <Icon emoji="🎨" filterColor={primaryColor} /> Theme
          </h3>
          <div className="setting-item">
            <label className="setting-label">Primary Color</label>
            <p className="setting-description">
              Choose your preferred color theme for the application.
            </p>
            <ColorPicker
              currentColor={primaryColor}
              onColorChange={onColorChange}
              onColorChangeDebounced={onColorChangeStop}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
