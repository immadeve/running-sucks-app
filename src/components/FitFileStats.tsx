import React from 'react';
import { Icon } from './Icon';

interface FitFileStats {
  fileName: string;
  fileSize: number;
  duration: string;
  distance: string;
  avgPace: string;
  avgHeartRate: string;
  maxHeartRate: string;
  calories: string;
  elevationGain: string;
  avgCadence: string;
  sport: string;
  startTime: string;
}

interface FitFileStatsProps {
  stats: FitFileStats;
  primaryColor?: string;
}

export const FitFileStatsTable: React.FC<FitFileStatsProps> = ({ stats, primaryColor }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const statsData = [
    {
      label: 'File Name',
      value: stats.fileName,
      icon: <Icon emoji="📄" filterColor={primaryColor} />,
    },
    {
      label: 'File Size',
      value: formatFileSize(stats.fileSize),
      icon: <Icon emoji="💾" filterColor={primaryColor} />,
    },
    { label: 'Sport', value: stats.sport, icon: <Icon emoji="🏃" filterColor={primaryColor} /> },
    {
      label: 'Start Time',
      value: stats.startTime,
      icon: <Icon emoji="🕐" filterColor={primaryColor} />,
    },
    {
      label: 'Duration',
      value: stats.duration,
      icon: <Icon emoji="⏱️" filterColor={primaryColor} />,
    },
    {
      label: 'Distance',
      value: stats.distance,
      icon: <Icon emoji="📏" filterColor={primaryColor} />,
    },
    {
      label: 'Average Pace',
      value: stats.avgPace,
      icon: <Icon emoji="⚡" filterColor={primaryColor} />,
    },
    {
      label: 'Average Heart Rate',
      value: stats.avgHeartRate,
      icon: <Icon emoji="❤️" filterColor={primaryColor} />,
    },
    {
      label: 'Max Heart Rate',
      value: stats.maxHeartRate,
      icon: <Icon emoji="💓" filterColor={primaryColor} />,
    },
    {
      label: 'Calories Burned',
      value: stats.calories,
      icon: <Icon emoji="🔥" filterColor={primaryColor} />,
    },
    {
      label: 'Elevation Gain',
      value: stats.elevationGain,
      icon: <Icon emoji="⛰️" filterColor={primaryColor} />,
    },
    {
      label: 'Average Cadence',
      value: stats.avgCadence,
      icon: <Icon emoji="👟" filterColor={primaryColor} />,
    },
  ];

  return (
    <div className="fit-stats-container">
      <h3 className="fit-stats-title">FIT File Analysis</h3>
      <div className="fit-stats-table">
        {statsData.map((stat, index) => (
          <div key={index} className="fit-stats-row">
            <div className="fit-stats-label">
              <span className="fit-stats-icon">{stat.icon}</span>
              <span>{stat.label}</span>
            </div>
            <div className="fit-stats-value">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
