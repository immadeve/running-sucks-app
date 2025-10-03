import React from 'react';

interface TableRowData {
  id: number;
  name: string;
  description: string;
  details: string;
}

interface AppTableProps {
  data: TableRowData[];
  onRowClick: (rowId: number, rowData: TableRowData) => void;
}

export const AppTable: React.FC<AppTableProps> = ({ data, onRowClick }) => {
  const handleRowClickEvent = (rowData: TableRowData) => {
    // Handle row click using injected handler
    onRowClick(rowData.id, rowData);
  };

  return (
    <div className="table-container">
      <table className="App-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Activity</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} onClick={() => handleRowClickEvent(row)} className="table-row">
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export type { TableRowData };
