// Archivo: Project/src/pages/BlogPage.tsx

import { useState, useEffect } from 'react';
import * as eventoApi from '../api/eventoApi';
import type { EventoResponse } from '../api/eventoApi';

function BlogPage() {
  const [eventos, setEventos] = useState<EventoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEventos = async () => {
      try {
        setIsLoading(true);
        const response = await eventoApi.getEventos(0, 50);
        setEventos(response.content);
        setError(null);
      } catch (err) {
        console.error('Error al cargar eventos:', err);
        setError('Error al cargar eventos');
      } finally {
        setIsLoading(false);
      }
    };
    loadEventos();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando eventos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <div className="container py-5">
        <div className="alert alert-info text-center">
          <h4>No hay eventos disponibles</h4>
          <p>Vuelve pronto para conocer nuestros próximos eventos gaming.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">Eventos Gaming</h1>
        <p className="lead text-muted">Descubre los próximos torneos y eventos de eSports</p>
      </div>

      {eventos.map((evento, index) => (
        <div
          key={evento.id}
          className={`row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg mb-5 ${
            index % 2 === 0 ? '' : 'flex-row-reverse'
          }`}
        >
          <div className="col-lg-6">
            <span className="badge bg-primary mb-3">
              {formatDate(evento.date)}
            </span>
            <h2 className="display-6 fw-bold text-body-emphasis lh-1 mb-3">
              {evento.name}
            </h2>
            <p className="lead mb-3">{evento.description}</p>
            
            <div className="mb-3">
              <i className="bi bi-geo-alt-fill text-primary me-2"></i>
              <strong>{evento.locationName}</strong>
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <a
                href={`https://www.google.com/maps?q=${evento.latitude},${evento.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg px-4 me-md-2"
              >
                <i className="bi bi-map me-2"></i>
                Ver Ubicación
              </a>
              <button 
                type="button" 
                className="btn btn-outline-primary btn-lg px-4"
                onClick={() => window.alert('Funcionalidad de registro próximamente')}
              >
                Registrarse
              </button>
            </div>
          </div>
          
          <div className="col-12 col-lg-6 text-center">
            <img
              src={evento.imageUrl || "/Img/ESports.jpg"}
              className="img-fluid rounded shadow"
              alt={evento.name}
              style={{ 
                maxHeight: '400px', 
                objectFit: 'cover',
                width: '100%'
              }}
              loading="lazy"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default BlogPage;