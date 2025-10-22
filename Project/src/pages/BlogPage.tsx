// Archivo: Project/src/pages/BlogPage.tsx

function BlogPage() {
  return (
    // Usamos un fragmento (<>) porque hay múltiples elementos raíz
    <>
      <div className="container my-5">
        <div
          className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg"
        >
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
              CASO #1
            </h1>
            <p className="lead">
              Lorem ipsum dolor sit amet consectetur, 
              adipisicing elit. Eum soluta iusto nemo numquam,
              hic perspiciatis id esse ipsam facere illum iure, 
              vero deserunt quidem est. 
              Et doloremque cupiditate earum molestiae.
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <button type="button" className="btn btn-primary btn-lg px-4 me-md-2">
                VER CASO
              </button>
            </div>
          </div>
          <div className="col-12 col-md-6 text-center">
            {/* - La etiqueta <img> se auto-cierra (/>)
              - La ruta src apunta a la carpeta /public/Img/
            */}
            <img
              src="/Img/ESports.jpg"
              className="img-fluid rounded"
              alt="ESports"
              width="700"
              height="500"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      
      <div className="container my-5">
        <div
          className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg"
        >
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
              CASO #2
            </h1>
            <p className="lead">
              Lorem ipsum dolor sit amet consectetur, 
              adipisicing elit. Eum soluta iusto nemo numquam,
              hic perspiciatis id esse ipsam facere illum iure, 
              vero deserunt quidem est. 
              Et doloremque cupiditate earum molestiae.
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <button type="button" className="btn btn-primary btn-lg px-4 me-md-2">
                VER CASO
              </button>
            </div>
          </div>
          <div className="col-12 col-md-6 text-center">
            {/* - Corregimos el "backslash" (\) por un "slash" (/) 
            */}
            <img
              src="/Img/The_International_2014.jpg"
              className="img-fluid rounded"
              alt="ESports"
              width="700"
              height="500"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogPage;