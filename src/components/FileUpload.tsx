import React, { useState, useRef } from 'react';
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
  routeData?: RoutePoint[];
}

interface RoutePoint {
  lat: number;
  lng: number;
  elevation?: number;
  timestamp?: number;
}

interface FileUploadProps {
  onFileUploaded: (stats: FitFileStats | null) => void;
  onUploadOpened?: () => void;
  onUploadStart?: (fileName: string) => void;
  onUploadError?: (error: string) => void;
  primaryColor?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  onUploadOpened,
  onUploadStart,
  onUploadError,
  primaryColor,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse TCX file and extract route data
  const parseTcxFile = async (file: File): Promise<FitFileStats> => {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const text = await file.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');

    // Check for parsing errors
    const parserError = xmlDoc.getElementsByTagName('parsererror')[0];
    if (parserError) {
      throw new Error('Invalid TCX file format');
    }

    // Extract route points from TCX
    const trackpoints = xmlDoc.getElementsByTagName('Trackpoint');
    const routeData: RoutePoint[] = [];
    const cadenceData: number[] = [];

    for (let i = 0; i < trackpoints.length; i++) {
      const trackpoint = trackpoints[i];
      const position = trackpoint.getElementsByTagName('Position')[0];

      if (position) {
        const latElement = position.getElementsByTagName('LatitudeDegrees')[0];
        const lngElement = position.getElementsByTagName('LongitudeDegrees')[0];
        const altElement = trackpoint.getElementsByTagName('AltitudeMeters')[0];
        const timeElement = trackpoint.getElementsByTagName('Time')[0];

        if (latElement && lngElement && latElement.textContent && lngElement.textContent) {
          const lat = parseFloat(latElement.textContent);
          const lng = parseFloat(lngElement.textContent);
          const elevation =
            altElement && altElement.textContent ? parseFloat(altElement.textContent) : undefined;
          const timestamp =
            timeElement && timeElement.textContent
              ? new Date(timeElement.textContent).getTime()
              : undefined;

          // Only add valid coordinates
          if (!isNaN(lat) && !isNaN(lng)) {
            routeData.push({ lat, lng, elevation, timestamp });
          }
        }
      }

      // Extract cadence data from Extensions
      const extensions = trackpoint.getElementsByTagName('Extensions')[0];
      if (extensions) {
        const runCadenceElement = extensions.getElementsByTagName('ns3:RunCadence')[0];
        if (runCadenceElement && runCadenceElement.textContent) {
          const cadence = parseFloat(runCadenceElement.textContent);
          if (!isNaN(cadence) && cadence > 0) {
            cadenceData.push(cadence);
          }
        }
      }
    }

    // Extract activity data from all Lap elements
    const activity = xmlDoc.getElementsByTagName('Activity')[0];
    const laps = xmlDoc.getElementsByTagName('Lap');
    const sport = activity?.getAttribute('Sport') || 'Running';

    // Get data from all laps
    let totalDistance = 0;
    let totalDurationSeconds = 0;
    let totalCalories = 0;
    let avgHeartRateSum = 0;
    let avgHeartRateCount = 0;
    let maxHeartRateOverall = 0;

    // Sum data from all laps
    for (let i = 0; i < laps.length; i++) {
      const lap = laps[i];

      // Distance from each lap
      const distanceElement = lap.getElementsByTagName('DistanceMeters')[0];
      if (distanceElement && distanceElement.textContent) {
        totalDistance += parseFloat(distanceElement.textContent) / 1000; // Convert to km
      }

      // Duration from each lap
      const timeElement = lap.getElementsByTagName('TotalTimeSeconds')[0];
      if (timeElement && timeElement.textContent) {
        totalDurationSeconds += parseFloat(timeElement.textContent);
      }

      // Calories from each lap
      const caloriesElement = lap.getElementsByTagName('Calories')[0];
      if (caloriesElement && caloriesElement.textContent) {
        totalCalories += parseFloat(caloriesElement.textContent);
      }

      // Heart rate data from each lap
      const avgHrElement = lap
        .getElementsByTagName('AverageHeartRateBpm')[0]
        ?.getElementsByTagName('Value')[0];
      if (avgHrElement && avgHrElement.textContent) {
        avgHeartRateSum += parseFloat(avgHrElement.textContent);
        avgHeartRateCount++;
      }

      const maxHrElement = lap
        .getElementsByTagName('MaximumHeartRateBpm')[0]
        ?.getElementsByTagName('Value')[0];
      if (maxHrElement && maxHrElement.textContent) {
        maxHeartRateOverall = Math.max(maxHeartRateOverall, parseFloat(maxHrElement.textContent));
      }
    }

    // Format the aggregated data
    const minutes = Math.floor(totalDurationSeconds / 60);
    const seconds = Math.floor(totalDurationSeconds % 60);
    const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const calories = `${totalCalories} kcal`;
    const avgHeartRate =
      avgHeartRateCount > 0 ? `${Math.round(avgHeartRateSum / avgHeartRateCount)} bpm` : '0 bpm';
    const maxHeartRate = maxHeartRateOverall > 0 ? `${maxHeartRateOverall} bpm` : '0 bpm';

    // Calculate average pace
    const totalMinutes = totalDurationSeconds / 60;
    const avgPaceMinPerKm = totalDistance > 0 ? totalMinutes / totalDistance : 0;
    const paceMin = Math.floor(avgPaceMinPerKm);
    const paceSec = Math.floor((avgPaceMinPerKm - paceMin) * 60);
    const avgPace = `${paceMin}:${paceSec.toString().padStart(2, '0')} /km`;

    // Calculate elevation gain from route data
    let elevationGain = 0;
    if (routeData.length > 1) {
      let minElevation = routeData[0].elevation || 0;
      let maxElevation = routeData[0].elevation || 0;

      for (const point of routeData) {
        if (point.elevation !== undefined) {
          minElevation = Math.min(minElevation, point.elevation);
          maxElevation = Math.max(maxElevation, point.elevation);
        }
      }
      elevationGain = Math.max(0, maxElevation - minElevation);
    }

    // Calculate average cadence from trackpoint data
    let avgCadence = '0 spm';
    if (cadenceData.length > 0) {
      const avgCadenceValue =
        cadenceData.reduce((sum, cadence) => sum + cadence, 0) / cadenceData.length;
      // Multiply by 2 as TCX cadence is per single leg, but we want total steps per minute
      avgCadence = `${Math.round(avgCadenceValue * 2)} spm`;
    }

    return {
      fileName: file.name,
      fileSize: file.size,
      duration,
      distance: `${totalDistance.toFixed(1)} km`,
      avgPace,
      avgHeartRate,
      maxHeartRate,
      calories,
      elevationGain: `${Math.round(elevationGain)} m`,
      avgCadence,
      sport,
      startTime: routeData[0]?.timestamp
        ? new Date(routeData[0].timestamp).toLocaleString()
        : new Date().toLocaleString(),
      routeData,
    };
  };

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.tcx')) {
      const errorMsg = 'Please upload a .tcx file';
      setError(errorMsg);
      onUploadError?.(errorMsg);
      onFileUploaded(null);
      return;
    }

    setIsProcessing(true);
    onUploadStart?.(file.name);

    try {
      const stats = await parseTcxFile(file);
      onFileUploaded(stats);
    } catch (err) {
      const errorMsg = 'Error processing TCX file. Please try again.';
      setError(errorMsg);
      onUploadError?.(errorMsg);
      onFileUploaded(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    onUploadOpened?.();
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-dropzone ${isDragOver ? 'drag-over' : ''} ${
          isProcessing ? 'processing' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".tcx"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {isProcessing ? (
          <div className="upload-processing">
            <div className="spinner"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">
              <Icon emoji="📁" size="large" filterColor={primaryColor} />
            </div>
            <span>Drop TCX file or click to browse</span>
          </div>
        )}
      </div>

      {error && (
        <div className="upload-error">
          <span>❌ {error}</span>
        </div>
      )}
    </div>
  );
};
