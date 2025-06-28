// src/api/productos.js

const API = import.meta.env.VITE_API_URL;

export async function listarProductos() {
  const res = await fetch(`${API}/api/productos/`);
  return await res.json();
}

export async function eliminarProducto(id) {
  return await fetch(`${API}/api/productos/${id}/`, {
    method: "DELETE",
  });
}

export async function crearProducto(data) {
  return await fetch(`${API}/api/productos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function actualizarProducto(id, data) {
  return await fetch(`${API}/api/productos/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
