export function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition ${className}`}
    >
      {children}
    </button>
  );
}