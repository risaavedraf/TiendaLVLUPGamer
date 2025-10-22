// Archivo: Project/src/components/Layout.tsx

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// 1. Pegar imports
import { useCart } from '../contexts/CartContext';
import { useEffect, useRef } from 'react';
import { Toast } from 'bootstrap';

function Layout() {
  // 2. Pegar lógica y refs
  const { lastAddedItemName, clearLastAddedItem } = useCart();
  const toastRef = useRef<HTMLDivElement>(null);
  const toastBodyRef = useRef<HTMLDivElement>(null);

  // 3. Pegar useEffect
  useEffect(() => {
    if (lastAddedItemName && toastRef.current && toastBodyRef.current) {
      toastBodyRef.current.textContent = `¡"${lastAddedItemName}" se añadió al carrito!`;
      const toastElement = Toast.getOrCreateInstance(toastRef.current);
      toastElement.show();

      const handleToastHidden = () => {
        clearLastAddedItem();
        toastRef.current?.removeEventListener('hidden.bs.toast', handleToastHidden);
      };
      
      toastRef.current.addEventListener('hidden.bs.toast', handleToastHidden);
    }
  }, [lastAddedItemName, clearLastAddedItem]);

  return (
    <>
      {/* 4. Pegar el JSX del Toast */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div
          ref={toastRef}
          id="notificacionToast"
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">🛒 Carrito de Compras</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div 
            ref={toastBodyRef}
            className="toast-body" 
            id="toast-body-mensaje"
          >
            {/* ... */}
          </div>
        </div>
      </div>
      
      <Header />

      <main className="container-fluid py-5 flex-grow-1">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default Layout;