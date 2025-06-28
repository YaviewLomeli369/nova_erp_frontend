import React, { useEffect, useState } from "react";
import {
  listarProductos,
  eliminarProducto,
} from "../../api/productos";
import ProductoModal from "../../components/ProductoModal"; // Ajusta la ruta si es necesario

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Listado de Productos</h2>

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
                  <td className="px-4 py-2 text-center">
                    {p.stock} {p.unidad_medida}
                  </td>
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
                      onClick={() => abrirModalEditar(p)}
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



// import React, { useEffect, useState } from "react";
// import {
//   listarProductos,
//   eliminarProducto,
//   crearProducto,
//   actualizarProducto,
// } from "../../api/productos";
// import ProductoModal from "/components/ProductoModal"; // Agrega esto


// const API = import.meta.env.VITE_API_URL;

// function getStockBadgeColor(stock, minimo) {
//   if (stock <= minimo) return "bg-red-100 text-red-800";
//   if (stock <= minimo * 1.5) return "bg-yellow-100 text-yellow-800";
//   return "bg-green-100 text-green-800";
// }

// function getStockLabel(stock, minimo) {
//   if (stock <= minimo) return "Bajo";
//   if (stock <= minimo * 1.5) return "Medio";
//   return "Óptimo";
// }

// export default function Productos() {
//   const [productos, setProductos] = useState([]);
//   const [productoActual, setProductoActual] = useState(null); // para editar
//   const [modalAbierto, setModalAbierto] = useState(false);

//   const cargarProductos = () => {
//     listarProductos()
//       .then((data) => setProductos(data))
//       .catch((err) => console.error(err));
//   };

//   useEffect(() => {
//     cargarProductos();
//   }, []);

//   const handleEliminar = (id) => {
//     if (!confirm("¿Estás seguro de eliminar este producto?")) return;
//     eliminarProducto(id)
//       .then(() => {
//         setProductos((prev) => prev.filter((p) => p.id !== id));
//       })
//       .catch((err) => {
//         console.error(err);
//         alert("Error al eliminar producto");
//       });
//   };

//   const handleEditar = (producto) => {
//     setProductoActual(producto);
//     setModalAbierto(true);
//   };

//   const handleNuevo = () => {
//     setProductoActual(null);
//     setModalAbierto(true);
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6 text-center">Listado de Productos</h2>

//       <div className="flex justify-end mb-4">
//         <ProductoModal
//           abierto={modalAbierto}
//           setAbierto={setModalAbierto}
//           producto={productoActual}
//           onGuardado={cargarProductos}
//         />
//         <button
//           onClick={handleNuevo}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           Crear producto
//         </button>
//       </div>

//       {productos.length === 0 ? (
//         <p className="text-center text-gray-500">No hay productos registrados.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
//             <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
//               <tr>
//                 <th className="px-4 py-2 text-left">Código</th>
//                 <th className="px-4 py-2 text-left">Nombre</th>
//                 <th className="px-4 py-2 text-left">Categoría</th>
//                 <th className="px-4 py-2 text-left">Proveedor</th>
//                 <th className="px-4 py-2 text-right">Precio</th>
//                 <th className="px-4 py-2 text-center">Stock</th>
//                 <th className="px-4 py-2 text-center">Estado</th>
//                 <th className="px-4 py-2 text-center">Acciones</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-800 text-sm">
//               {productos.map((p) => (
//                 <tr key={p.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-2">{p.codigo}</td>
//                   <td className="px-4 py-2">{p.nombre}</td>
//                   <td className="px-4 py-2">{p.categoria}</td>
//                   <td className="px-4 py-2">{p.proveedor}</td>
//                   <td className="px-4 py-2 text-right">${Number(p.precio_venta).toFixed(2)}</td>
//                   <td className="px-4 py-2 text-center">
//                     {p.stock} {p.unidad_medida}
//                   </td>
//                   <td className="px-4 py-2 text-center">
//                     <span
//                       className={`px-2 py-1 text-xs font-medium rounded-full ${getStockBadgeColor(
//                         p.stock,
//                         p.stock_minimo
//                       )}`}
//                     >
//                       {getStockLabel(p.stock, p.stock_minimo)}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2 text-center space-x-2">
//                     <button
//                       className="text-blue-600 hover:underline text-sm"
//                       onClick={() => handleEditar(p)}
//                     >
//                       Editar
//                     </button>
//                     <button
//                       className="text-red-600 hover:underline text-sm"
//                       onClick={() => handleEliminar(p.id)}
//                     >
//                       Eliminar
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


// //


// import React, { useState, useEffect } from "react";
// import ProductoModal from "../../components/ProductoModal";

// export default function Productos() {
//   const [productos, setProductos] = useState([]);
//   const [productoEditar, setProductoEditar] = useState(null);

//   // Carga productos ...

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h2>Listado de Productos</h2>

//       <ProductoModal
//         trigger={
//           <button className="mb-4 bg-blue-600 text-white py-2 px-4 rounded">
//             Nuevo Producto
//           </button>
//         }
//         onSuccess={() => {
//           // recargar lista, ejemplo:
//           alert("Producto guardado");
//           // aquí deberías recargar la lista o actualizar el estado
//         }}
//       />

//       {/* Tabla con productos */}
//       {/* ... */}

//       {/* Botón editar ejemplo */}
//       {productos.map((p) => (
//         <button
//           key={p.id}
//           onClick={() => setProductoEditar(p)}
//           className="text-blue-600 underline"
//         >
//           Editar {p.nombre}
//         </button>
//       ))}

//       {/* Modal para editar */}
//       {productoEditar && (
//         <ProductoModal
//           productoActual={productoEditar}
//           onSuccess={() => {
//             setProductoEditar(null);
//             // recargar lista
//           }}
//           onCancel={() => setProductoEditar(null)}
//           trigger={null} // no se usa trigger, el modal se abre programáticamente
//         />
//       )}
//     </div>
//   );
// }
