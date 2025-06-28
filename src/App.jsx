import React from "react";
import { Button } from "@/components/ui/button"
import './App.css'


export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-800 via-fuchsia-600 to-red-500 text-white">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md w-full text-gray-800">
        <h1 className="text-3xl font-bold mb-4">¡Bienvenido a Nova ERP!</h1>
        <p className="mb-6 text-lg">Administra tu negocio con estilo ✨</p>
        <Button className="bg-purple-600 hover:bg-purple-800 text-white px-6 py-2 rounded-full">
          Empezar ahora
        </Button>
      </div>
    </div>
  );
}

