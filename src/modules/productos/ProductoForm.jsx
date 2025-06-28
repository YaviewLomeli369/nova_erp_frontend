import { useState, useEffect } from "react";
import { crearProducto, actualizarProducto } from "@/api/productos";

export default function ProductoForm({ productoActual, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    precio_venta: "",
    stock: 0,
    stock_minimo: 0,
  });

  useEffect(() => {
    if (productoActual) setForm(productoActual);
    else
      setForm({
        nombre: "",
        codigo: "",
        precio_venta: "",
        stock: 0,
        stock_minimo: 0,
      });
  }, [productoActual]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (productoActual) {
        await actualizarProducto(productoActual.id, form);
      } else {
        await crearProducto(form);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        required
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="codigo"
        placeholder="Código"
        value={form.codigo}
        onChange={handleChange}
        required
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="precio_venta"
        type="number"
        step="0.01"
        placeholder="Precio de venta"
        value={form.precio_venta}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="stock"
        type="number"
        placeholder="Stock actual"
        value={form.stock}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="stock_minimo"
        type="number"
        placeholder="Stock mínimo"
        value={form.stock_minimo}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {productoActual ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}
