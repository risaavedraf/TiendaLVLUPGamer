// Archivo: Project/src/data/products.ts

// 1. Definimos un "tipo" para TypeScript, basado en tu array
export type ProductCategory = {
  id: number;
  nombre: string;
};

export type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: ProductCategory;
  precio: number;
  img: string;
  stock?: number;
};

// 2. Exportamos tu array de productos
export const productosArray: Product[] = [
  {
    id: 1,
    nombre: "Teclado Gamer Redragon",
    descripcion: "Teclado mecánico RGB con retroiluminación personalizable.",
    categoria: { id: 1, nombre: "Teclados" },
    precio: 49.99,
    stock: 10,
    img: "/Img/teclado_redragon.png", // Usamos la ruta desde /public
  },
  {
    id: 2,
    nombre: "Mouse Gamer Logitech",
    descripcion: "Mouse ergonómico con alta precisión y botones programables.",
    categoria: { id: 2, nombre: "Mouse" },
    precio: 39.99,
    stock: 3,
    img: "/Img/mouse_logitech.jpg", 
  },
  {
    id: 3,
    nombre: "Auriculares Gamer HyperX",
    descripcion: "Auriculares con sonido envolvente y micrófono ajustable.",
    categoria: { id: 3, nombre: "Auriculares" },
    precio: 59.99,
    stock: 0,
    img: "/Img/auriculares_hyperx.webp",
  },
  { 
    id: 4,
    nombre: "Monitor Gamer ASUS",
    descripcion: "Monitor 27\" 144Hz con tecnología FreeSync para juegos fluidos.",
    categoria: { id: 4, nombre: "Monitores" },
    precio: 299.99,
    stock: 6,
    img: "/Img/monitor_asus.jpg"
  },
   {
    id: 5,
    nombre: "Teclado Gamer Razer",
    descripcion: "Teclado mecánico RGB con retroiluminación personalizable.",
    categoria: { id: 1, nombre: "Teclados" },
    precio: 49.99,
    stock: 2,
    img: "/Img/teclado_razer.jpg",
  },
  {
    id: 6,
    nombre: "Mouse Gamer Razer",
    descripcion: "Mouse ergonómico con alta precisión y botones programables.",
    categoria: { id: 2, nombre: "Mouse" },
    precio: 39.99,
    stock: 0,
    img: "/Img/mouse_razer.webp", 
  },
  {
    id: 7,
    nombre: "Auriculares Gamer Razer",
    descripcion: "Auriculares con sonido envolvente y micrófono ajustable.",
    categoria: { id: 3, nombre: "Auriculares" },
    precio: 59.99,
    stock: 8,
    img: "/Img/auriculares_razer.png",
  },
  { 
    id: 8,
    nombre: "Monitor Gamer LG",
    descripcion: "Monitor 27\" 144Hz con tecnología FreeSync para juegos fluidos.",
    categoria: { id: 4, nombre: "Monitores" },
    precio: 299.99,
    stock: 5,
    img: "/Img/monitor_lg.jpg"
  },
  {
    id: 9,
    nombre: "Teclado Gamer Logitech",
    descripcion: "Teclado mecánico RGB con retroiluminación personalizable.",
    categoria: { id: 1, nombre: "Teclados" },
    precio: 49.99,
    stock: 1,
    img: "/Img/teclado_logitech.jpg",
  },
  {
    id: 10,
    nombre: "Mouse Gamer HyperX",
    descripcion: "Mouse ergonómico con alta precisión y botones programables.",
    categoria: { id: 2, nombre: "Mouse" },
    precio: 39.99,
    stock: 12,
    img: "/Img/mouse_hyperx.webp", 
  },
  {
    id: 11,
    nombre: "Auriculares Gamer Logitech",
    descripcion: "Auriculares con sonido envolvente y micrófono ajustable.",
    categoria: { id: 3, nombre: "Auriculares" },
    precio: 59.99,
    stock: 4,
    img: "/Img/auriculares_logitech.png",
  },
  { 
    id: 12,
    nombre: "Monitor Gamer Samsung",
    descripcion: "Monitor 27\" 180Hz con tecnología FreeSync para juegos fluidos.",
    categoria: { id: 4, nombre: "Monitores" },
    precio: 299.99,
    stock: 0,
    img: "/Img/monitor_samsug.jpg"
  }
];