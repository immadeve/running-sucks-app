import { useSweetStateActions } from '../store/appStore';
import { analyticsProvider } from '../providers/analyticsProvider';
import { getContentByButtonText } from '../utils/runningContent';

/**
 * Custom hook that provides handlers for state actions
 * Returns an object with action handlers that can be called directly
 */
export const useStateActions = () => {
  const [state, actions] = useSweetStateActions();

  const changeTab = (tabName: string) => {
    if (state.currentTabName !== tabName) {
      // Analytics first
      analyticsProvider.tabChanged(tabName);
      // Then state update
      actions.changeTab({ tabName });
    }
  };

  return {
    /**
     * Handler for row clicks
     * @param rowId - The ID of the clicked row
     * @param rowData - The data of the clicked row
     */
    handleRowClick: (rowId: number, rowData: any) => {
      // Analytics first
      if (rowData) {
        analyticsProvider.rowClicked(rowId, rowData.name, rowData.description);
      }
      // Then state update
      actions.rowClicked({ rowId, rowData });
    },

    /**
     * Handler for button clicks
     * @param buttonName - The name/identifier of the clicked button
     * @param buttonId - The unique ID for analytics tracking
     */
    handleButtonClick: (buttonName: string, buttonId: string) => {
      // Analytics first
      analyticsProvider.buttonClicked(buttonId);
      // Then state update
      actions.buttonClicked({ buttonName, buttonId });

      changeTab(getContentByButtonText(buttonName));
    },

    /**
     * Handler for closing the side panel
     */
    handleCloseSidePanel: () => {
      // Analytics first
      analyticsProvider.sidePanelClosed();
      // Then state update
      actions.closeSidePanel();
    },

    /**
     * Handler for setting filter text
     * @param filterText - The filter text to apply
     * @param resultCount - The number of results after filtering
     */
    handleSetFilter: (filterText: string, resultCount: number) => {
      // Analytics first
      analyticsProvider.filterApplied(filterText, resultCount);
      // Then state update
      actions.setFilter({ filterText, resultCount });
    },

    /**
     * Handler for changing tabs
     * @param tabName - The name of the tab being changed to
     */
    handleChangeTab: changeTab,

    /**
     * Handler for changing primary color
     * @param color - The new primary color to set
     */
    handleChangeColor: (color: string) => {
      // Analytics first
      analyticsProvider.colorChanged(color);
      // Then state update
      actions.setPrimaryColor({ color });
    },

    /**
     * Handler for file upload opened
     */
    handleFileUploadOpened: () => {
      // Analytics first
      analyticsProvider.fileUploadOpened();
      // No state update needed for this event
    },

    /**
     * Handler for file upload start
     * @param fileName - The name of the file being uploaded
     */
    handleFileUploadStart: (fileName: string) => {
      // Analytics first
      analyticsProvider.fileUploadStarted(fileName);
      // Then state update
      actions.uploadFileStart({ fileName });
    },

    /**
     * Handler for file upload success
     * @param fileName - The name of the successfully uploaded file
     * @param fileSize - The size of the uploaded file in bytes
     * @param fileStats - The complete parsed file statistics
     */
    handleFileUploadSuccess: (fileName: string, fileSize: number, fileStats?: any) => {
      // Analytics first
      analyticsProvider.fileUploadSucceeded(fileName, fileSize);
      // Then state update with complete file stats
      actions.uploadFileSuccess({ fileName, fileStats: fileStats || null });
    },

    /**
     * Handler for file upload error
     * @param error - The error message
     */
    handleFileUploadError: (error: string) => {
      // No analytics for errors (could be added if needed)
      // State update only
      actions.uploadFileError({ error });
    },

    /**
     * Handler for view details button click
     */
    handleViewDetails: () => {
      // Analytics first
      analyticsProvider.viewDetailsClicked();
      // Then state update
      actions.viewDetails();
    },

    /**
     * Handler for map reset button click
     */
    handleMapReset: () => {
      // Analytics first
      analyticsProvider.mapReseted();
      // Then state update
      actions.mapReset();
    },

    /**
     * Handler for opening settings
     */
    handleOpenSettings: () => {
      // Analytics first
      analyticsProvider.settingsOpened();
      // Then state update
      actions.openSettings();
    },
  };
};
