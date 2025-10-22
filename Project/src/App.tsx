// Archivo: Project/src/App.tsx

import Header from './component/Header'; // 1. Importa el Header
import './App.css';

// NOTA: Borramos todo el contenido de ejemplo de Vite (useState, logos, etc.)

function App() {
  return (
    <>
      {/* 2. Renderiza el componente Header */}
      <Header />

      {/* Pronto añadiremos el "Router" aquí para que cargue 
        la página de Home, Productos, etc., según la URL.
      */}
      <div className="container">
        <h1>Contenido de la Página (Próximamente)</h1>
      </div>

      {/* Aquí pondremos el componente <Footer /> 
        cuando lo migremos en el siguiente paso.
      */}
    </>
  );
}

export default App;