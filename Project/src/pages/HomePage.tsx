import { Link } from "react-router-dom";
import ProductList from "../component/ProductList";
import CategoryCarousel from "../component/CategoryCarousel";
import { productosArray } from "../data/products";
import { ordersArray } from "../data/orders";
import { getAverageRating } from "../utils/reviews";
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
              LevelUpGamer
            </h1>
            <p className="lead">
              Quickly design and customize responsive mobile-first sites with
              Bootstrap, the world’s most popular front-end open source toolkit,
              featuring Sass variables and mixins, responsive grid system,
              extensive prebuilt components, and powerful JavaScript plugins.
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              {/* 4. El botón ahora es un <Link> de react-router-dom */}
              <Link
                to="/productos"
                className="btn btn-primary btn-lg px-4 me-md-2"
              >
                Productos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. El "Album" de productos */}
      <div className="album py-5 bg-body-tertiary">
        <div className="container">
          {/* Carousel: Más valorados */}
          <CategoryCarousel
            title="Más valorados"
            products={productosArray
              .slice()
              .sort(
                (a, b) =>
                  (getAverageRating(b.id) ?? 0) - (getAverageRating(a.id) ?? 0)
              )}
            limit={6}
            visible={3}
          />

          {/* Carousel: Más vendidos (calculado a partir de ordersArray) */}
          <CategoryCarousel
            title="Más vendidos"
            products={(() => {
              // contar ventas por nombre de producto (los orders usan nombre)
              const counts = new Map<string, number>();
              for (const o of ordersArray) {
                for (const d of o.detalles) {
                  counts.set(
                    d.producto,
                    (counts.get(d.producto) || 0) + d.cantidad
                  );
                }
              }
              // map products to their sold count (0 por defecto)
              return productosArray
                .slice()
                .sort(
                  (a, b) =>
                    (counts.get(b.nombre) || 0) - (counts.get(a.nombre) || 0)
                );
            })()}
            limit={6}
            visible={3}
          />

          {/* Carousel: Últimas unidades (stock >0 y <5) */}
          <CategoryCarousel
            title="Últimas unidades"
            products={productosArray
              .slice()
              .filter(
                (p) => typeof p.stock === "number" && p.stock > 0 && p.stock < 5
              )
              .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))}
            limit={6}
            visible={3}
          />

          {/* 6. Reemplazamos el <div id="contenedor-productos"></div> with our ProductList */}
          <ProductList />
        </div>
      </div>
    </>
  );
}

export default HomePage;
