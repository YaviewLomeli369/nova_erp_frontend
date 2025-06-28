// src/modules/productos/ProductoModal.jsx
import ProductoForm from "../modules/productos/ProductoForm"
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/Dialog";

export default function ProductoModal({ productoActual, onSuccess, onCancel, trigger }) {
  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{productoActual ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
        </DialogHeader>

        <ProductoForm
          productoActual={productoActual}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />

        <DialogClose className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700">
          ✕
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
