import React, { useEffect, useState, useMemo } from "react";
import {
  listarProductos,
  eliminarProducto,
} from "../../api/productos";
import ProductoModal from "../../components/ProductoModal";
import Table from "../../components/ui/Table";

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
  const [productoActual, setProductoActual] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarProductos = () => {
    listarProductos()
      .then((data) => setProductos(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleEliminar = (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    eliminarProducto(id)
      .then(() => {
        setProductos((prev) => prev.filter((p) => p.id !== id));
      })
      .catch((err) => {
        console.error(err);
        alert("Error al eliminar producto");
      });
  };

  const abrirModalNuevo = () => {
    setProductoActual(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (producto) => {
    setProductoActual(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoActual(null);
  };

  const onGuardado = () => {
    cargarProductos();
    cerrarModal();
  };

  const columnas = [
    { key: "codigo", label: "Código" },
    { key: "nombre", label: "Nombre" },
    { key: "categoria", label: "Categoría" },
    { key: "proveedor", label: "Proveedor" },
    { key: "precio_venta", label: "Precio" },
    { key: "stock_label", label: "Stock" },
    { key: "acciones", label: "Acciones" },
  ];

  const datosTabla = useMemo(
    () =>
      productos.map((p) => ({
        ...p,
        precio_venta: `$${Number(p.precio_venta).toFixed(2)}`,
        stock_label: (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStockBadgeColor(
              p.stock,
              p.stock_minimo
            )}`}
          >
            {getStockLabel(p.stock, p.stock_minimo)} ({p.stock} {p.unidad_medida})
          </span>
        ),
        acciones: (
          <div className="flex flex-col sm:flex-row sm:space-x-2 gap-1">
            <button
              className="text-blue-600 hover:underline text-sm whitespace-nowrap"
              onClick={() => abrirModalEditar(p)}
              aria-label={`Editar producto ${p.nombre}`}
            >
              Editar
            </button>
            <button
              className="text-red-600 hover:underline text-sm whitespace-nowrap"
              onClick={() => handleEliminar(p.id)}
              aria-label={`Eliminar producto ${p.nombre}`}
            >
              Eliminar
            </button>
          </div>
        ),
      })),
    [productos]
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Listado de Productos
      </h2>

      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={abrirModalNuevo}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Crear producto
        </button>
      </div>

      <ProductoModal
        abierto={modalAbierto}
        setAbierto={setModalAbierto}
        producto={productoActual}
        onGuardado={onGuardado}
        onCancel={cerrarModal}
      />

      {/* Contenedor responsivo con scroll horizontal en móvil */}
      <div className="overflow-x-auto">
        <Table
          columns={columnas}
          data={datosTabla}
          itemsPerPage={10}
          // Opcionalmente, si tu Table.jsx lo soporta, puedes forzar mínimo ancho:
          // minTableWidth="700px"
        />
      </div>
    </div>
  );
}
