const productosArray = [
  {
    id: 1,
    nombre: "Teclado Gamer Redragon",
    descripcion: "Teclado mecánico RGB con retroiluminación personalizable.",
    categoria: { id: 1, nombre: "Teclados" },
    precio: 49.99,
    img: "img/teclado_redragon.png",
  },
  {
    id: 2,
    nombre: "Mouse Gamer Logitech",
    descripcion: "Mouse ergonómico con alta precisión y botones programables.",
    categoria: { id: 2, nombre: "Mouse" },
    precio: 39.99,
    img: "img/mouse_logitech.jpg", 
    },
    {
    id: 3,
    nombre: "Auriculares Gamer HyperX",
    descripcion: "Auriculares con sonido envolvente y micrófono ajustable.",
    categoria: { id: 3, nombre: "Auriculares" },
    precio: 59.99,
    img: "img/auriculares_hyperx.webp",
  },
  { 
    id: 4,
    nombre: "Monitor Gamer ASUS",
    descripcion: "Monitor 27\" 144Hz con tecnología FreeSync para juegos fluidos.",
    categoria: { id: 4, nombre: "Monitores" },
    precio: 299.99,
    img: "img/monitor_asus.jpg"
  },
   {
    id: 5,
    nombre: "Teclado Gamer Razer",
    descripcion: "Teclado mecánico RGB con retroiluminación personalizable.",
    categoria: { id: 1, nombre: "Teclados" },
    precio: 49.99,
    img: "img/teclado_razer.jpg",
  },
  {
    id: 6,
    nombre: "Mouse Gamer Razer",
    descripcion: "Mouse ergonómico con alta precisión y botones programables.",
    categoria: { id: 2, nombre: "Mouse" },
    precio: 39.99,
    img: "img/mouse_razer.webp", 
    },
    {
    id: 7,
    nombre: "Auriculares Gamer Razer",
    descripcion: "Auriculares con sonido envolvente y micrófono ajustable.",
    categoria: { id: 3, nombre: "Auriculares" },
    precio: 59.99,
    img: "img/auriculares_razer.png",
  },
  { 
    id: 8,
    nombre: "Monitor Gamer LG",
    descripcion: "Monitor 27\" 144Hz con tecnología FreeSync para juegos fluidos.",
    categoria: { id: 4, nombre: "Monitores" },
    precio: 299.99,
    img: "img/monitor_lg.jpg"
  },
  {
    id: 9,
    nombre: "Teclado Gamer Logitech",
    descripcion: "Teclado mecánico RGB con retroiluminación personalizable.",
    categoria: { id: 1, nombre: "Teclados" },
    precio: 49.99,
    img: "img/teclado_logitech.jpg",
  },
  {
    id: 10,
    nombre: "Mouse Gamer HyperX",
    descripcion: "Mouse ergonómico con alta precisión y botones programables.",
    categoria: { id: 2, nombre: "Mouse" },
    precio: 39.99,
    img: "img/mouse_hyperx.webp", 
    },
    {
    id: 11,
    nombre: "Auriculares Gamer Logitech",
    descripcion: "Auriculares con sonido envolvente y micrófono ajustable.",
    categoria: { id: 3, nombre: "Auriculares" },
    precio: 59.99,
    img: "img/auriculares_logitech.png",
  },
  { 
    id: 12,
    nombre: "Monitor Gamer Samsung",
    descripcion: "Monitor 27\" 180Hz con tecnología FreeSync para juegos fluidos.",
    categoria: { id: 4, nombre: "Monitores" },
    precio: 299.99,
    img: "img/monitor_samsug.jpg"
  }

  ]
  const contenedorProductos = document.querySelector("#contenedor-productos");

  function mostrarProductos(){
    productosArray.forEach(producto => {
        const productoHTML = `<div class="col-md-3 mb-4">
      <div class="card h-100 shadow-sm">
        <a href="DetalleProducto.html?id=${producto.id}"><img src="${producto.img}" class="card-img-top" alt=""></a>
        <div class="card-body d-flex flex-column">
          <p class="text-center flex-grow-1">
            <a href="DetalleProducto.html?id=${producto.id}">${producto.nombre}</a>
          </p>
          <div class="d-flex justify-content-between align-items-center">
            <small>${producto.categoria.nombre}</small>
            <small>$${producto.precio}</small>
          </div>
        </div>
      </div>
    </div>`;
      
        contenedorProductos.innerHTML += productoHTML;
  })
}


    mostrarProductos();

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("DetalleProducto.html")) {
    mostrarDetalleProducto();
  } else {
    mostrarProductos(); // tu función actual para la lista
  }
});

function mostrarDetalleProducto() {
  // Obtener parámetros de la URL
  const params = new URLSearchParams(window.location.search);
  const idProducto = parseInt(params.get("id"));

  // Buscar el producto en el array
  const producto = productosArray.find(p => p.id === idProducto);

  if (producto) {
    // Rellenar datos dinámicamente
    document.querySelector("h1").textContent = producto.nombre;
    document.querySelector("h2").textContent = `$${producto.precio}`;
    document.querySelector("#Categoria").textContent = producto.categoria.nombre;
    document.querySelector("#mainImage").src = producto.img;
    document.querySelector("#mainImage1").src = producto.img;
    document.querySelector("#mainImage2").src = producto.img;
    document.querySelector("#mainImage3").src = producto.img;
    document.querySelector("p.text-center.text-md-start").textContent = producto.descripcion;

    // Mostrar productos relacionados
    mostrarRelacionados(producto.categoria.id, producto.id);
  } else {
    document.querySelector("h1").textContent = "Producto no encontrado";
  }
}
function mostrarRelacionados(categoriaId, idActual) {
  const relacionados = productosArray.filter(p => p.categoria.id === categoriaId && p.id !== idActual);

  const contenedor = document.querySelector("#contenedor-productos");
  contenedor.innerHTML = "";

  relacionados.forEach(producto => {
    contenedor.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm">
          <a href="DetalleProducto.html?id=${producto.id}">
            <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
          </a>
          <div class="card-body d-flex flex-column">
            <p class="text-center flex-grow-1">
              <a href="DetalleProducto.html?id=${producto.id}">${producto.nombre}</a>
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <small>${producto.categoria.nombre}</small>
              <small>$${producto.precio}</small>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

    