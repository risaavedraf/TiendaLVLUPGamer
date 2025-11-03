// Archivo: Project/src/pages/NosotrosPage.tsx

import { useState } from 'react'; // 1. Importamos useState para manejar el formulario

function NosotrosPage() {

  // 2. Creamos estados para cada campo del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // 3. Creamos una función para manejar el envío (submit)
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Previene que la página se recargue
    
    // Por ahora, solo mostraremos los datos en la consola
    console.log("Formulario de Contacto Enviado:");
    console.log({ name, email, message });

    alert("¡Mensaje enviado! (Revisa la consola)");
    
    // Limpiamos el formulario
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    // Usamos un fragmento (<>) para devolver múltiples secciones
    <>
      {/* 4. Sección "Sobre Nosotros", HTML traducido a JSX */}
      <section id="seccion-nosotros">
        <div className="container my-5">
          <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
            <div className="col-12 col-md-6 text-center">
              {/* - La etiqueta <img> se auto-cierra (/>)
                - La ruta src ahora apunta a la carpeta /public
              */}
              <img 
                src="/Img/logo-Photoroom.png" 
                className="img-fluid rounded" 
                alt="Level-Up Gamer" 
                width="200" 
                height="200" 
                loading="lazy" 
              />
            </div>
            <div className="col-lg-6 p-3 p-lg-5 pt-lg-3">
              <h2 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Sobre Nosotros</h2>
              <p className="lead">
                Aquí va la historia de la tienda, la misión, visión y valores clave.
                Espacio para conectar con los clientes y explicar el propósito del negocio
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                {/* (El contenido original estaba vacío aquí) */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sección "Contacto Directo", convertida en formulario React */}
      <section id="seccion-contacto-directo">
        <div className="container my-5">
          <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
            <div className="col-12 text-center p-3 p-lg-5 pt-lg-3">
              <h2 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Contacto Directo</h2>
              <p className="lead">
                Completa el formulario para enviarnos un mensaje. Te responderemos lo antes posible.
              </p>
            </div>
            <div className="col-12 p-3 p-lg-5 pt-lg-3">
              
              {/* 6. Vinculamos la función handleSubmit al evento onSubmit */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  {/* 'for' se convierte en 'htmlFor' en React */}
                  <label htmlFor="name" className="form-label">Nombre</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    required 
                    value={name} // 7. Vinculamos el valor al estado
                    onChange={(e) => setName(e.target.value)} // 8. Actualizamos el estado al escribir
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Mensaje</label>
                  <textarea 
                    className="form-control" 
                    id="message" 
                    rows={5} 
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button type="submit" className="btn btn-primary btn-lg px-4">Enviar Mensaje</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default NosotrosPage;