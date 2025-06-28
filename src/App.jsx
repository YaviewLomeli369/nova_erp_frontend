import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Productos from './Productos' // importa tu componente Productos

export default function App() {
  return (
    <div>
      {/* Navegación simple */}
      <nav className="p-4 bg-gray-100 shadow-md flex gap-4">
        <Link to="/" className="text-blue-600 hover:underline">Inicio</Link>
        <Link to="/productos" className="text-blue-600 hover:underline">Productos</Link>
      </nav>

      {/* Definición de rutas */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-red-500 flex items-center justify-center p-8">
              <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
                  🚀 Nova ERP + Tailwind
                </h1>
                <p className="text-lg text-gray-600">
                  Estilos funcionando al 100% con Tailwind CSS v3
                </p>
                <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
                  ¡Vamos allá!
                </button>
              </div>
            </div>
          }
        />
        <Route path="/productos" element={<Productos />} />
      </Routes>
    </div>
  )
}
