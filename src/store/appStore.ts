import { createStore, createHook } from 'react-sweet-state';
import { ContentType, getContentByButtonText } from '../utils/runningContent';

// Define the state interface
interface AppState {
  selectedRowId: number | null;
  selectedRowData: {
    id: number;
    name: string;
    description: string;
    details: string;
  } | null;
  isSidePanelOpen: boolean;
  lastButtonClicked: string | null;
  currentContentType: ContentType;
  filterText: string;
  currentTabName: string;
  primaryColor: string;
  fileUploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  uploadedFileName: string | null;
  uploadError: string | null;
  uploadedFileStats: any | null; // Store the complete parsed file stats
  isViewingDetails: boolean; // Track if user is viewing file details
}

// Define action types
interface AppActions {
  rowClicked: (payload: { rowId: number; rowData: AppState['selectedRowData'] }) => void;
  buttonClicked: (payload: { buttonName: string; buttonId: string }) => void;
  closeSidePanel: () => void;
  setFilter: (payload: { filterText: string; resultCount: number }) => void;
  changeTab: (payload: { tabName: string }) => void;
  setPrimaryColor: (payload: { color: string }) => void;
  uploadFileStart: (payload: { fileName: string }) => void;
  uploadFileSuccess: (payload: { fileName: string; fileStats: any }) => void;
  uploadFileError: (payload: { error: string }) => void;
  viewDetails: () => void;
}

// Initial state
const initialState: AppState = {
  selectedRowId: null,
  selectedRowData: null,
  isSidePanelOpen: false,
  lastButtonClicked: null,
  currentContentType: 'hate',
  filterText: '',
  currentTabName: 'hate',
  primaryColor: '#ffd700',
  fileUploadStatus: 'idle',
  uploadedFileName: null,
  uploadError: null,
  uploadedFileStats: null,
  isViewingDetails: false,
};

// Define actions
const actions = {
  rowClicked:
    ({ rowId, rowData }: { rowId: number; rowData: AppState['selectedRowData'] }) =>
    ({ setState, getState }: any) => {
      setState({
        selectedRowId: rowId,
        selectedRowData: rowData,
        isSidePanelOpen: true,
        isViewingDetails: false, // Reset file details view when clicking a row
      });
    },

  buttonClicked:
    ({ buttonName, buttonId }: { buttonName: string; buttonId: string }) =>
    ({ setState, getState }: any) => {
      const contentType = getContentByButtonText(buttonName);
      setState({
        lastButtonClicked: buttonName,
        currentContentType: contentType,
      });
    },

  closeSidePanel:
    () =>
    ({ setState }: any) => {
      setState({
        selectedRowId: null,
        selectedRowData: null,
        isSidePanelOpen: false,
        isViewingDetails: false,
      });
    },

  setFilter:
    ({ filterText, resultCount }: { filterText: string; resultCount: number }) =>
    ({ setState }: any) => {
      setState({
        filterText,
      });
    },

  changeTab:
    ({ tabName }: { tabName: string }) =>
    ({ setState }: any) => {
      const contentType = getContentByButtonText(tabName);
      setState({
        currentContentType: contentType,
        filterText: '', // Reset filter when tab changes
        currentTabName: tabName,
      });
    },

  setPrimaryColor:
    ({ color }: { color: string }) =>
    ({ setState }: any) => {
      setState({
        primaryColor: color,
      });
    },

  uploadFileStart:
    ({ fileName }: { fileName: string }) =>
    ({ setState }: any) => {
      setState({
        fileUploadStatus: 'uploading',
        uploadedFileName: fileName,
        uploadError: null,
      });
    },

  uploadFileSuccess:
    ({ fileName, fileStats }: { fileName: string; fileStats: any }) =>
    ({ setState }: any) => {
      setState({
        fileUploadStatus: 'success',
        uploadedFileName: fileName,
        uploadError: null,
        uploadedFileStats: fileStats,
      });
    },

  uploadFileError:
    ({ error }: { error: string }) =>
    ({ setState }: any) => {
      setState({
        fileUploadStatus: 'error',
        uploadError: error,
      });
    },

  viewDetails:
    () =>
    ({ setState }: any) => {
      setState({
        isViewingDetails: true,
        isSidePanelOpen: true,
        selectedRowId: null,
        selectedRowData: null,
      });
    },

  mapReset:
    () =>
    ({ setState }: any) => {
      // This action is primarily for analytics tracking
      // The actual map reset is handled by the Map component
    },

  openSettings:
    () =>
    ({ setState }: any) => {
      setState({
        currentContentType: 'settings',
      });
    },
};

// Create the store
const Store = createStore({
  initialState,
  actions,
});

// Create hooks
export const useAppState = createHook(Store);
export const useSweetStateActions = createHook(Store, {
  selector: (state) => state, // We don't need state, just actions
});

// Export types for consumers
export type { AppState, AppActions };
