import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { CartProvider } from "./contexts/CartContext"; // 1. Importar
import { AuthProvider } from "./contexts/AuthContext";
// Importaciones de Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // 2. Importar JS de Bootstrap
import "./index.css";
import { seedDemoReviews } from "./utils/reviews";

// Sembrar reseñas demo en localStorage si aún no existan
try {
  seedDemoReviews();
} catch (e) {
  /* ignore */
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
