import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function getStockBadgeColor(stock, minimo) {
  if (stock <= minimo) return "bg-red-100 text-red-800";
  if (stock <= minimo * 1.5) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
}

function getStockLabel(stock, minimo) {
  if (stock <= minimo) return "Bajo";
  if (stock <= minimo * 1.5) return "Medio";
  return "Óptimo";
}

export default function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/productos/`)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Listado de Productos</h2>

      {productos.length === 0 ? (
        <p className="text-center text-gray-500">No hay productos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-2 text-left">Código</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Categoría</th>
                <th className="px-4 py-2 text-left">Proveedor</th>
                <th className="px-4 py-2 text-right">Precio</th>
                <th className="px-4 py-2 text-center">Stock</th>
                <th className="px-4 py-2 text-center">Estado</th>
                <th className="px-4 py-2 text-center">Acciones</th>

              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {productos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{p.codigo}</td>
                  <td className="px-4 py-2">{p.nombre}</td>
                  <td className="px-4 py-2">{p.categoria}</td>
                  <td className="px-4 py-2">{p.proveedor}</td>
                  <td className="px-4 py-2 text-right">${Number(p.precio_venta).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">{p.stock} {p.unidad_medida}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStockBadgeColor(
                        p.stock,
                        p.stock_minimo
                      )}`}
                    >
                      {getStockLabel(p.stock, p.stock_minimo)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => handleEditar(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:underline text-sm"
                      onClick={() => handleEliminar(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function handleEditar(producto) {
  // Aquí luego conectamos con el formulario para editar
  console.log("Editar", producto);
}

function handleEliminar(id) {
  if (!confirm("¿Estás seguro de eliminar este producto?")) return;

  fetch(`${API}/api/productos/${id}/`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        setProductos((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Error al eliminar producto");
      }
    })
    .catch((err) => console.error(err));
}

