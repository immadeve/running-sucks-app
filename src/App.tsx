import React, { useEffect } from 'react';
import './App.css';
import { AppButton } from './components/AppButton';
import { AppTable } from './components/AppTable';
import { SidePanel } from './components/SidePanel';
import { FilterInput } from './components/FilterInput';
import { ActivityAnalyzer } from './components/ActivityAnalyzer';
import { AppSettings } from './components/AppSettings';
import { useAppState } from './store/appStore';
import { useStateActions } from './hooks/useStateActions';
import { runningContent, getContentByButtonText } from './utils/runningContent';

function App() {
  const [state] = useAppState();
  const {
    handleRowClick,
    handleCloseSidePanel,
    handleSetFilter,
    handleButtonClick,
    handleChangeColor,
    handleColorChangeStop,
    handleFileUploadOpened,
    handleFileUploadStart,
    handleFileUploadSuccess,
    handleFileUploadError,
    handleViewDetails,
    handleMapReset,
    handleOpenSettings,
  } = useStateActions();

  const {
    currentContentType,
    filterText,
    selectedRowData,
    isSidePanelOpen,
    primaryColor,
    fileUploadStatus,
    uploadedFileStats,
    isViewingDetails,
  } = state;

  // Set CSS custom properties for dynamic theming
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--primary-color-light', primaryColor + '66'); // Add alpha for transparency
    document.documentElement.style.setProperty(
      '--primary-color-dark',
      primaryColor === '#ffd700' ? '#ffff00' : primaryColor
    );

    // Convert hex to rgba for shadows
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    document.documentElement.style.setProperty(
      '--primary-color-shadow',
      hexToRgba(primaryColor, 0.3)
    );
    document.documentElement.style.setProperty(
      '--primary-color-shadow-hover',
      hexToRgba(primaryColor, 0.4)
    );
  }, [primaryColor]);

  // Calculate active states for buttons
  const hateButtonActive = getContentByButtonText('Why I Hate Running') === currentContentType;
  const loveButtonActive = getContentByButtonText('Why I Love Running') === currentContentType;
  const analyzeButtonActive = getContentByButtonText('Analyze') === currentContentType;
  const settingsButtonActive = currentContentType === 'settings';

  // Get dynamic content based on current state
  const currentData = runningContent[currentContentType];

  // Filter data based on search text
  const filteredData = currentData.filter((item) => {
    if (!filterText) return true;

    const searchTerm = filterText.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.details.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="App">
      <div className="background-overlay"></div>

      <header className="App-header">
        <h1>Some nerdy running stats page</h1>
      </header>

      <main className="App-main">
        <div className="tab-container">
          <AppButton
            text="Why I Hate Running"
            isActive={hateButtonActive}
            onButtonClick={handleButtonClick}
          />
          <AppButton
            text="Why I Love Running"
            isActive={loveButtonActive}
            onButtonClick={handleButtonClick}
          />
          <AppButton
            text="Analyze"
            isActive={analyzeButtonActive}
            onButtonClick={handleButtonClick}
          />
          <AppButton
            text="Settings"
            isActive={settingsButtonActive}
            onButtonClick={handleOpenSettings}
          />
        </div>
        <div className="folder-content">
          <div className="folder-main-content">
            {currentContentType === 'analyze' ? (
              <ActivityAnalyzer
                fitStats={
                  fileUploadStatus === 'success' && uploadedFileStats ? uploadedFileStats : null
                }
                primaryColor={primaryColor}
                onFileUploadOpened={handleFileUploadOpened}
                onFileUploadStart={handleFileUploadStart}
                onFileUploadSuccess={handleFileUploadSuccess}
                onFileUploadError={handleFileUploadError}
                onViewDetails={handleViewDetails}
                onMapReset={handleMapReset}
              />
            ) : currentContentType === 'settings' ? (
              <AppSettings
                primaryColor={primaryColor}
                onColorChange={handleChangeColor}
                onColorChangeStop={handleColorChangeStop}
              />
            ) : (
              <>
                <FilterInput
                  filterText={filterText}
                  currentContentType={currentContentType}
                  onFilterChange={handleSetFilter}
                />
                <AppTable data={filteredData} onRowClick={handleRowClick} />
              </>
            )}
          </div>

          {isSidePanelOpen && (
            <SidePanel
              selectedRowData={selectedRowData}
              isSidePanelOpen={isSidePanelOpen}
              currentContentType={currentContentType}
              isViewingDetails={isViewingDetails}
              uploadedFileStats={uploadedFileStats}
              primaryColor={primaryColor}
              onClose={handleCloseSidePanel}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
