import React, { useState, useMemo, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import * as XLSX from "xlsx";
import Papa from "papaparse";

const Table = ({
  columns,
  data,
  itemsPerPage = 10,
  onPageChange,
  controlledPage = null,
  totalItems = null,
  loading = false,
  rowKey = "id",
  editable = false,
  onEdit,
  renderCell,
  initialSort = [],
  saveConfigKey = null,
  groupBy = null,
  onSelectionChange,
}) => {
  // --- Estados ---
  const [query, setQuery] = useState("");
  const [colFilters, setColFilters] = useState(() =>
    columns.reduce((acc, col) => ({ ...acc, [col.key]: "" }), {})
  );
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(controlledPage || 1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(columns.map((c) => c.key));
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    if (controlledPage !== null) setCurrentPage(controlledPage);
  }, [controlledPage]);

  useEffect(() => {
    if (!saveConfigKey) return;
    const config = { colFilters, sortConfig, visibleColumns };
    localStorage.setItem(saveConfigKey, JSON.stringify(config));
  }, [colFilters, sortConfig, visibleColumns, saveConfigKey]);

  useEffect(() => {
    if (!saveConfigKey) return;
    const stored = localStorage.getItem(saveConfigKey);
    if (stored) {
      const { colFilters: cf, sortConfig: sc, visibleColumns: vc } = JSON.parse(stored);
      if (cf) setColFilters(cf);
      if (sc) setSortConfig(sc);
      if (vc) setVisibleColumns(vc);
    }
  }, [saveConfigKey]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const globalMatch = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(query.toLowerCase())
      );
      const colMatch = Object.entries(colFilters).every(([key, filter]) =>
        String(row[key]).toLowerCase().includes(filter.toLowerCase())
      );
      return globalMatch && colMatch;
    });
  }, [data, query, colFilters]);

  const sortedData = useMemo(() => {
    if (!sortConfig || sortConfig.length === 0) return filteredData;

    return [...filteredData].sort((a, b) => {
      for (const { key, direction } of sortConfig) {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal == null && bVal == null) continue;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        let comp = 0;
        if (typeof aVal === "string" && typeof bVal === "string") {
          comp = aVal.localeCompare(bVal);
        } else if (typeof aVal === "number" && typeof bVal === "number") {
          comp = aVal - bVal;
        } else {
          comp = String(aVal).localeCompare(String(bVal));
        }

        if (comp !== 0) return direction === "asc" ? comp : -comp;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const groupedData = useMemo(() => {
    if (!groupBy) return sortedData;
    const groups = {};
    sortedData.forEach((row) => {
      const key = row[groupBy] ?? "Sin grupo";
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });
    return groups;
  }, [sortedData, groupBy]);

  const totalCount = totalItems !== null ? totalItems : sortedData.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const currentData = useMemo(() => {
    if (groupBy) return sortedData; 
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [currentPage, sortedData, itemsPerPage, groupBy]);

  const toggleSort = (key, multi = false) => {
    setSortConfig((prev) => {
      let newSort = [];
      if (!multi) {
        if (prev.length === 1 && prev[0].key === key) {
          newSort = [
            {
              key,
              direction: prev[0].direction === "asc" ? "desc" : "asc",
            },
          ];
        } else {
          newSort = [{ key, direction: "asc" }];
        }
      } else {
        const existIndex = prev.findIndex((s) => s.key === key);
        if (existIndex === -1) {
          newSort = [...prev, { key, direction: "asc" }];
        } else {
          const currentDir = prev[existIndex].direction;
          if (currentDir === "asc") prev[existIndex].direction = "desc";
          else prev.splice(existIndex, 1);
          newSort = [...prev];
        }
      }
      return newSort;
    });
  };

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((r) => r !== id)
        : [...prev, id];
      if (onSelectionChange) onSelectionChange(newSelected);
      return newSelected;
    });
  };
  const selectAllCurrent = () => {
    const ids = currentData.map((row) => row[rowKey]);
    setSelectedRows(ids);
    if (onSelectionChange) onSelectionChange(ids);
  };
  const clearSelection = () => {
    setSelectedRows([]);
    if (onSelectionChange) onSelectionChange([]);
  };

  const getRowsToExport = () =>
    selectedRows.length > 0
      ? sortedData.filter((row) => selectedRows.includes(row[rowKey]))
      : sortedData;

  const exportCSV = () => {
    const rowsToExport = getRowsToExport();
    const csv = Papa.unparse(
      rowsToExport.map((row) =>
        columns.reduce((acc, col) => {
          acc[col.label] = row[col.key];
          return acc;
        }, {})
      )
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    const rowsToExport = getRowsToExport();
    const wsData = [
      columns.map((col) => col.label),
      ...rowsToExport.map((row) => columns.map((col) => row[col.key])),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, "export.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const rowsToExport = getRowsToExport();
    autoTable(doc, {
      head: [columns.map((col) => col.label)],
      body: rowsToExport.map((row) =>
        columns.map((col) =>
          typeof row[col.key] === "string" ? row[col.key] : String(row[col.key])
        )
      ),
      styles: { fontSize: 8 },
      margin: { top: 10 },
    });
    doc.save("export.pdf");
  };

  const startEditRow = (id) => {
    setEditingRow(id);
  };
  const saveEditRow = (id, updatedRow) => {
    setEditingRow(null);
    if (onEdit) onEdit(id, updatedRow);
  };

  // Función agregada para toggle visibilidad columnas (para evitar error)
  const toggleColumnVisibility = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const visibleColumnsData = columns.filter((col) =>
    visibleColumns.includes(col.key)
  );

  // --- NUEVA función para manejar cambio en filtro por columna ---
  const handleColFilterChange = (key, value) => {
    setColFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Render fila con columnas filtradas por visibilidad
  const renderRow = (row) => {
    const isEditing = editingRow === row[rowKey];
    return (
      <tr key={row[rowKey]} className="border-t hover:bg-gray-50">
        <td className="p-2 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selectedRows.includes(row[rowKey])}
            onChange={() => toggleSelectRow(row[rowKey])}
          />
        </td>
        {visibleColumnsData.map((col) => (
          <td
            key={col.key}
            className="p-2 whitespace-nowrap max-w-[180px] truncate"
            title={typeof row[col.key] === "string" ? row[col.key] : undefined}
          >
            {editable && isEditing ? (
              <input
                type="text"
                defaultValue={row[col.key]}
                onBlur={(e) => {
                  saveEditRow(row[rowKey], {
                    ...row,
                    [col.key]: e.target.value,
                  });
                }}
              />
            ) : renderCell ? (
              renderCell(col.key, row)
            ) : (
              row[col.key]
            )}
          </td>
        ))}
      </tr>
    );
  };

  // Render filas, también corrigiendo colspan de agrupación
  const renderRows = () => {
    if (!groupBy) {
      return currentData.map((row) => renderRow(row));
    }

    const groups = groupedData;
    return Object.entries(groups).map(([groupName, rows]) => (
      <React.Fragment key={groupName}>
        <tr className="bg-gray-200 font-bold text-left">
          <td colSpan={visibleColumnsData.length + 1}>{groupName}</td>
        </tr>
        {rows.map((row) => renderRow(row))}
      </React.Fragment>
    ));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-full">
      {/* Info selección */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {selectedRows.length > 0 && (
          <>
            <span className="text-sm font-medium text-gray-700">
              {selectedRows.length} fila{selectedRows.length > 1 ? "s" : ""} seleccionada
              {selectedRows.length > 1 ? "s" : ""}
            </span>
            <button
              onClick={clearSelection}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 whitespace-nowrap"
            >
              Deseleccionar todo
            </button>
          </>
        )}
      </div>

      {/* Controles búsqueda y exportación */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Buscar..."
          className="border p-2 rounded w-full sm:w-1/2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex flex-wrap gap-1 max-w-full overflow-x-auto mb-2 sm:mb-0">
          {columns.map((col) => (
            <label key={col.key} className="mr-2 whitespace-nowrap">
              <input
                type="checkbox"
                checked={visibleColumns.includes(col.key)}
                onChange={() => toggleColumnVisibility(col.key)}
              />{" "}
              {col.label}
            </label>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={exportCSV}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
          >
            Exportar CSV
          </button>
          <button
            onClick={exportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 whitespace-nowrap"
          >
            Exportar Excel
          </button>
          <button
            onClick={exportPDF}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 whitespace-nowrap"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Contenedor para scroll con altura fija y sticky header */}
      <div className="overflow-auto border border-gray-300 rounded">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-2 whitespace-nowrap bg-gray-100">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) selectAllCurrent();
                    else clearSelection();
                  }}
                  checked={
                    currentData.length > 0 &&
                    selectedRows.length === currentData.length
                  }
                />
              </th>
              {visibleColumnsData.map((col) => (
                <th
                  key={col.key}
                  className="p-2 cursor-pointer whitespace-nowrap select-none bg-gray-100"
                  onClick={(e) => toggleSort(col.key, e.shiftKey)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") toggleSort(col.key, e.shiftKey);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-sort={
                    sortConfig.find((s) => s.key === col.key)
                      ? sortConfig.find((s) => s.key === col.key).direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <div className="flex flex-col">
                    <span>
                      {col.label}{" "}
                      {sortConfig.find((s) => s.key === col.key)
                        ? sortConfig.find((s) => s.key === col.key).direction === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </span>
                    <input
                      type="text"
                      placeholder={`Filtrar ${col.label}`}
                      className="mt-1 border rounded p-1 text-xs max-w-[120px]"
                      value={colFilters[col.key]}
                      onChange={(e) => handleColFilterChange(col.key, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumnsData.length + 1}
                  className="p-4 text-center text-gray-500"
                >
                  No hay datos para mostrar.
                </td>
              </tr>
            ) : (
              renderRows()
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between mt-4 items-center flex-wrap gap-2">
        <span>
          Página {currentPage} de {totalPages} {loading && "(cargando...)"}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (onPageChange) onPageChange(Math.max(1, currentPage - 1));
              else setCurrentPage((p) => Math.max(1, p - 1));
            }}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 whitespace-nowrap"
            disabled={currentPage === 1 || loading}
          >
            Anterior
          </button>
          <button
            onClick={() => {
              if (onPageChange) onPageChange(Math.min(totalPages, currentPage + 1));
              else setCurrentPage((p) => Math.min(totalPages, p + 1));
            }}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 whitespace-nowrap"
            disabled={currentPage === totalPages || loading}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
