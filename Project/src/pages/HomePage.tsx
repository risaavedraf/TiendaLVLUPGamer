import { Link } from 'react-router-dom';
import ProductList from '../component/ProductList';
 // 3. Importar la clase Toast de Bootstrap

function HomePage() {

  return (
    <>
      <div className="container col-xxl-8 px-4 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-10 col-sm-8 col-lg-6">
            <img 
              src="/Img/fakerjpg.webp" // Ruta desde /public
              className="d-block mx-lg-auto img-fluid" 
              alt="Faker" 
              width="700"
              height="500" 
              loading="lazy" 
            />
          </div>
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
              LeveUpGames
            </h1>
            <p className="lead">
              Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most
              popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive
              prebuilt components, and powerful JavaScript plugins.
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              {/* 4. El botón ahora es un <Link> de react-router-dom */}
              <Link to="/productos" className="btn btn-primary btn-lg px-4 me-md-2">
                Productos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. El "Album" de productos */}
      <div className="album py-5 bg-body-tertiary">
        <div className="container">
          {/* 6. Reemplazamos el <div id="contenedor-productos"></div> 
                 con nuestro componente React <ProductList /> */}
          <ProductList />
        </div>
      </div>
    </>
  );
}

export default HomePage;