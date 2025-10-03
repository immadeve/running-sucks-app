import React from 'react';
import { FileUpload } from './FileUpload';
import { Map } from './Map';
import { StatsSummary } from './StatsSummary';
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

interface ActivityAnalyzerProps {
  fitStats: FitFileStats | null;
  primaryColor: string;
  onFileUploadOpened: () => void;
  onFileUploadStart: (fileName: string) => void;
  onFileUploadSuccess: (fileName: string, fileSize: number, fileStats?: any) => void;
  onFileUploadError: (error: string) => void;
  onViewDetails: () => void;
  onMapReset: () => void;
}

export const ActivityAnalyzer: React.FC<ActivityAnalyzerProps> = ({
  fitStats,
  primaryColor,
  onFileUploadOpened,
  onFileUploadStart,
  onFileUploadSuccess,
  onFileUploadError,
  onViewDetails,
  onMapReset,
}) => {
  const handleFileUploaded = (stats: FitFileStats | null) => {
    if (stats) {
      onFileUploadSuccess(stats.fileName, stats.fileSize, stats);
    }
  };

  return (
    <div className="analyze-container">
      <div className="analyze-content">
        <h2>Analyze Your Running Data</h2>
        <p>Upload your .tcx file to get detailed statistics about your run.</p>

        <FileUpload
          onFileUploaded={handleFileUploaded}
          onUploadOpened={onFileUploadOpened}
          onUploadStart={onFileUploadStart}
          onUploadError={onFileUploadError}
          primaryColor={primaryColor}
        />

        {fitStats && (
          <>
            <StatsSummary
              stats={[
                {
                  label: 'Distance',
                  value: fitStats.distance,
                  icon: <Icon emoji="🏃" filterColor={primaryColor} />,
                },
                {
                  label: 'Duration',
                  value: fitStats.duration,
                  icon: <Icon emoji="⏱️" filterColor={primaryColor} />,
                },
                {
                  label: 'Avg Pace',
                  value: fitStats.avgPace,
                  icon: <Icon emoji="⚡" filterColor={primaryColor} />,
                },
              ]}
              onViewDetails={onViewDetails}
              primaryColor={primaryColor}
            />
            <Map fitStats={fitStats} primaryColor={primaryColor} onMapReset={onMapReset} />
          </>
        )}
      </div>
    </div>
  );
};
