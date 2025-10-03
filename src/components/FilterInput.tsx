import React from 'react';
import { runningContent } from '../utils/runningContent';
import { ContentType } from '../utils/runningContent';

interface FilterInputProps {
  filterText: string;
  currentContentType: ContentType;
  onFilterChange: (filterText: string, resultCount: number) => void;
}

export const FilterInput: React.FC<FilterInputProps> = ({
  filterText,
  currentContentType,
  onFilterChange,
}) => {
  // Get current data for result count calculation
  const currentData = runningContent[currentContentType];
  const getFilteredResultCount = (searchText: string) => {
    return currentData.filter((item) => {
      if (!searchText) return true;

      const searchTerm = searchText.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.details.toLowerCase().includes(searchTerm)
      );
    }).length;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilterText = event.target.value;
    const resultCount = getFilteredResultCount(newFilterText);
    onFilterChange(newFilterText, resultCount);
  };

  const handleClearFilter = () => {
    const resultCount = getFilteredResultCount('');
    onFilterChange('', resultCount);
  };

  return (
    <div className="filter-container">
      <div className="filter-input-wrapper">
        <input
          type="text"
          value={filterText}
          onChange={handleInputChange}
          placeholder="Filter activities..."
          className="filter-input"
        />
        {filterText && (
          <button onClick={handleClearFilter} className="filter-clear-button" title="Clear filter">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
