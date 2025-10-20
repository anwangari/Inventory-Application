// ============================================
// FILE: client/src/components/common/Table.jsx
// ============================================
import '../../styles/Table.css';

const Table = ({ columns, data, onEdit, onDelete, onView }) => {
  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <p>No data available</p>
      </div>
    );
  }
  
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
            <th style={{ width: '150px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              <td>
                <div className="table-actions">
                  {onView && (
                    <button 
                      className="btn-icon" 
                      onClick={() => onView(row)}
                      title="View"
                    >
                      👁️
                    </button>
                  )}
                  {onEdit && (
                    <button 
                      className="btn-icon" 
                      onClick={() => onEdit(row)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      className="btn-icon btn-danger" 
                      onClick={() => onDelete(row)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;