import { useMemo, useState } from 'react';

// columns: [{ key, label, sortable = true, render?(row) }]
export default function SortableTable({ columns, rows, initialSort }) {
  const [sort, setSort] = useState({ key: initialSort || columns[0].key, dir: 'asc' });

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const x = a[sort.key];
      const y = b[sort.key];
      if (x == null && y == null) return 0;
      if (x == null) return 1; // empty values always go last
      if (y == null) return -1;

      const result =
        typeof x === 'number' && typeof y === 'number'
          ? x - y
          : String(x).localeCompare(String(y), undefined, { sensitivity: 'base' });
      return sort.dir === 'asc' ? result : -result;
    });
    return copy;
  }, [rows, sort]);

  const toggleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
  };

  const arrow = (key) => (sort.key === key ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : '');

  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) =>
            col.sortable === false ? (
              <th key={col.key}>{col.label}</th>
            ) : (
              <th key={col.key} className="sortable" onClick={() => toggleSort(col.key)}>
                {col.label}
                {arrow(col.key)}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {sortedRows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="empty">
              No records found
            </td>
          </tr>
        ) : (
          sortedRows.map((row) => (
            <tr key={row.id ?? row.userId}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
