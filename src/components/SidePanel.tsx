import React, { useState, useEffect, PropsWithChildren } from 'react';
import { ContentType } from '../utils/runningContent';
import { FitFileStatsTable } from './FitFileStats';
import { Icon } from './Icon';

interface SelectedRowData {
  id: number;
  name: string;
  description: string;
  details: string;
}

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
  routeData?: any[];
}

interface SidePanelProps {
  selectedRowData: SelectedRowData | null;
  isSidePanelOpen: boolean;
  currentContentType: ContentType;
  isViewingDetails: boolean;
  uploadedFileStats: FitFileStats | null;
  primaryColor: string;
  onClose: () => void;
}

export const SidePanel: React.FC<PropsWithChildren<SidePanelProps>> = ({
  selectedRowData,
  isSidePanelOpen,
  currentContentType,
  isViewingDetails,
  uploadedFileStats,
  primaryColor,
  onClose,
  children,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle opening
  useEffect(() => {
    if (isSidePanelOpen && (selectedRowData || isViewingDetails)) {
      setShouldRender(true);
      setIsClosing(false);
    }
  }, [isSidePanelOpen, selectedRowData, isViewingDetails]);

  // Handle closing with animation
  useEffect(() => {
    if (!isSidePanelOpen && shouldRender) {
      setIsClosing(true);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // Match animation duration

      return () => clearTimeout(timer);
    }
  }, [isSidePanelOpen, shouldRender]);

  const handleClosePanelEvent = () => {
    // Handle close panel using injected handler
    onClose();
  };

  if (!shouldRender) {
    return null;
  }

  // Dynamic content based on context
  const isLoveContext = currentContentType === 'love';
  const heading = isLoveContext ? 'Why This Rocks:' : 'Why This Sucks:';
  const additionalText = isLoveContext
    ? "Running is fundamentally amazing as an activity. It's energizing, builds mental toughness, and provides incredible health benefits. You could be sitting on the couch feeling sluggish, but instead you're out there improving your cardiovascular health, building endurance, and experiencing the natural high that comes from pushing your body to achieve something great."
    : "Running is fundamentally flawed as an activity. It's repetitive, monotonous, and causes unnecessary wear and tear on your body. Instead of running, you could be doing literally anything else - reading a book, learning a new skill, or simply enjoying a nice cup of coffee while contemplating the absurdity of people who voluntarily choose to run in circles.";

  return (
    <div className={`SidePanel ${isClosing ? 'closing' : ''}`}>
      <button className="CloseButton" onClick={handleClosePanelEvent}>
        ✕
      </button>
      <div className="SidePanel-content">
        {isViewingDetails && uploadedFileStats ? (
          // Show file details
          <>
            <h2>Activity details</h2>
            <FitFileStatsTable stats={uploadedFileStats} primaryColor={primaryColor} />
          </>
        ) : selectedRowData ? (
          // Show row details
          <>
            <h2>{selectedRowData.name}</h2>
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Exhausted marathon runners"
              className="SidePanel-image"
            />
            <div className="SidePanel-text">
              <h3>{heading}</h3>
              <p>{selectedRowData.details}</p>
              <p>{additionalText}</p>
            </div>
          </>
        ) : null}
        {children}
      </div>
    </div>
  );
};
