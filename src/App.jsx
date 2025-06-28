import './App.css'

export default function App() {
  return (
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
  )
}