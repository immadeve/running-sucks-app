/**
 * Analytics provider that handles logging of user interactions
 */
export const analyticsProvider = {
  /**
   * Log row click analytics
   * @param id - The unique identifier for the clicked row
   * @param title - The title/name of the clicked row
   * @param description - The description of the clicked row
   */
  rowClicked: (id: number, title: string, description: string) => {
    console.log(`row clicked - id: ${id}, title: "${title}", description: "${description}"`);
  },

  /**
   * Log button click analytics
   * @param id - The unique identifier for the button
   */
  buttonClicked: (id: string) => {
    console.log(`button clicked - id: ${id}`);
  },

  /**
   * Log side panel close analytics
   */
  sidePanelClosed: () => {
    console.log('side panel closed');
  },

  /**
   * Log filter usage analytics
   * @param filterText - The filter text applied
   * @param resultCount - Number of results after filtering
   */
  filterApplied: (filterText: string, resultCount: number) => {
    console.log(`filter applied - text: "${filterText}", results: ${resultCount}`);
  },

  /**
   * Log tab change analytics
   * @param tabName - The name of the tab being changed to
   */
  tabChanged: (tabName: string) => {
    console.log(`tab changed - changed to tab: "${tabName}"`);
  },

  /**
   * Log color change analytics
   * @param color - The new primary color being set
   */
  colorChanged: (color: string) => {
    console.log(`color changed - new color: "${color}"`);
  },

  /**
   * Log file upload opened analytics
   */
  fileUploadOpened: () => {
    console.log('file upload opened');
  },

  /**
   * Log file upload started analytics
   * @param fileName - The name of the file being uploaded
   */
  fileUploadStarted: (fileName: string) => {
    console.log(`file upload started - file: "${fileName}"`);
  },

  /**
   * Log file upload succeeded analytics
   * @param fileName - The name of the file that was successfully uploaded
   * @param fileSize - The size of the uploaded file in bytes
   */
  fileUploadSucceeded: (fileName: string, fileSize: number) => {
    console.log(`file upload succeeded - file: "${fileName}", size: ${fileSize} bytes`);
  },

  /**
   * Log view details clicked analytics
   */
  viewDetailsClicked: () => {
    console.log('view details clicked');
  },

  /**
   * Log map reset analytics
   */
  mapReseted: () => {
    console.log('map reseted');
  },

  /**
   * Log settings opened analytics
   */
  settingsOpened: () => {
    console.log('settings opened');
  },
};
