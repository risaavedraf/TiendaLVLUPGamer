// Datos iniciales
let users = [
  {
    id: 1,
    nombre: "Ricardo Saavedra",
    email: "ri.saavedra@duocuc.cl",
    rol: "Admin",
  },
  { id: 2, nombre: "Roberto", email: "robe@duocuc.cl", rol: "Usuario" },
  {
    id: 3,
    nombre: "Ignacio Pérez",
    email: "ign.perezs@duocuc.cl",
    rol: "Moderador",
  },
];
let productosArray = [
  {
    id: 1,
    nombre: "Teclado Gamer Redragon",
    descripcion: "Teclado mecánico RGB con retroiluminación personalizable.",
    categoria: { id: 1, nombre: "Teclados" },
    stock: 15,
    precio: 49.99,
    img: "img/teclado_redragon.png",
  },
  {
    id: 2,
    nombre: "Mouse Gamer Logitech",
    descripcion: "Mouse ergonómico con alta precisión y botones programables.",
    categoria: { id: 2, nombre: "Mouse" },
    stock: 25,
    precio: 39.99,
    img: "img/mouse_logitech.jpg", 
    },
    {
    id: 3,
    nombre: "Auriculares Gamer HyperX",
    descripcion: "Auriculares con sonido envolvente y micrófono ajustable.",
    categoria: { id: 3, nombre: "Auriculares" },
    stock: 10,
    precio: 59.99,
    img: "img/auriculares_hyperx.webp",
  },
  { 
    id: 4,
    nombre: "Monitor Gamer ASUS",
    descripcion: "Monitor 27\" 144Hz con tecnología FreeSync para juegos fluidos.",
    categoria: { id: 4, nombre: "Monitores" },
    stock: 20,
    precio: 299.99,
    img: "img/monitor_asus.jpg"
  },
   {
    id: 5,
    nombre: "Teclado Gamer Razer",
    descripcion: "Teclado mecánico RGB con retroiluminación personalizable.",
    categoria: { id: 1, nombre: "Teclados" },
    stock: 5,
    precio: 49.99,
    img: "img/teclado_razer.jpg",
  },
  {
    id: 6,
    nombre: "Mouse Gamer Razer",
    descripcion: "Mouse ergonómico con alta precisión y botones programables.",
    categoria: { id: 2, nombre: "Mouse" },
    stock: 15,
    precio: 39.99,
    img: "img/mouse_razer.webp", 
    },
    {
    id: 7,
    nombre: "Auriculares Gamer Razer",
    descripcion: "Auriculares con sonido envolvente y micrófono ajustable.",
    categoria: { id: 3, nombre: "Auriculares" },
    stock: 14,
    precio: 59.99,
    img: "img/auriculares_razer.png",
  },
  { 
    id: 8,
    nombre: "Monitor Gamer LG",
    descripcion: "Monitor 27\" 144Hz con tecnología FreeSync para juegos fluidos.",
    categoria: { id: 4, nombre: "Monitores" },
    stock: 17,
    precio: 299.99,
    img: "img/monitor_lg.jpg"
  },
  {
    id: 9,
    nombre: "Teclado Gamer Logitech",
    descripcion: "Teclado mecánico RGB con retroiluminación personalizable.",
    categoria: { id: 1, nombre: "Teclados" },
    stock: 25,
    precio: 49.99,
    img: "img/teclado_logitech.jpg",
  },
  {
    id: 10,
    nombre: "Mouse Gamer HyperX",
    descripcion: "Mouse ergonómico con alta precisión y botones programables.",
    categoria: { id: 2, nombre: "Mouse" },
    stock: 35,
    precio: 39.99,
    img: "img/mouse_hyperx.webp", 
    },
    {
    id: 11,
    nombre: "Auriculares Gamer Logitech",
    descripcion: "Auriculares con sonido envolvente y micrófono ajustable.",
    categoria: { id: 3, nombre: "Auriculares" },
    stock: 12,
    precio: 59.99,
    img: "img/auriculares_logitech.png",
  },
  { 
    id: 12,
    nombre: "Monitor Gamer Samsung",
    descripcion: "Monitor 27\" 180Hz con tecnología FreeSync para juegos fluidos.",
    categoria: { id: 4, nombre: "Monitores" },
    stock: 23,
    precio: 299.99,
    img: "img/monitor_samsug.jpg"
  }

  ]

// Contadores de ID (busca el mayor y sigue desde ahí)
let nextUserId = Math.max(...users.map((u) => u.id)) + 1;
let nextProductId = Math.max(...productosArray.map((p) => p.id)) + 1;

let deleteMode = { user: false, product: false };
let currentModalType = null;

// Render tablas
function renderUsers() {
  const tbody = document.querySelector("#users-table tbody");
  tbody.innerHTML = "";
  users.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.nombre}</td>
      <td>${u.email}</td>
      <td>${u.rol} <span class="delete-x" onclick="deleteUser(${u.id})">❌</span></td>
    `;
    if (deleteMode.user) tr.querySelector(".delete-x").style.display = "inline";
    tbody.appendChild(tr);
  });
}

function renderProducts() {
  const tbody = document.querySelector("#products-table tbody");
  tbody.innerHTML = "";
  productosArray.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>$${p.precio.toLocaleString()}</td>
      <td>${p.stock} <span class="delete-x" onclick="deleteProduct(${
      p.id
    })">❌</span></td>
    `;
    if (deleteMode.product)
      tr.querySelector(".delete-x").style.display = "inline";
    tbody.appendChild(tr);
  });
}

// Eliminar
function toggleDeleteMode(type) {
  deleteMode[type] = !deleteMode[type];
  if (type === "user") renderUsers();
  else renderProducts();
}
function deleteUser(id) {
  users = users.filter((u) => u.id !== id);
  renderUsers();
  updateDashboard();
}
function deleteProduct(id) {
  productosArray = productosArray.filter((p) => p.id !== id);
  renderProducts();
  updateDashboard();
}

// Modal
function openModal(type) {
  currentModalType = type;
  document.getElementById("modal").style.display = "flex";
  if (type === "user") {
    document.getElementById("modal-title").innerText = "Añadir Usuario";
    document.getElementById("field1").placeholder = "Nombre";
    document.getElementById("field2").placeholder = "Email";
    document.getElementById("field3").placeholder = "Rol";
  } else {
    document.getElementById("modal-title").innerText = "Añadir Producto";
    document.getElementById("field1").placeholder = "Nombre";
    document.getElementById("field2").placeholder = "Precio";
    document.getElementById("field3").placeholder = "Stock";
  }
  document.getElementById("field1").value = "";
  document.getElementById("field2").value = "";
  document.getElementById("field3").value = "";
}
function closeModal() {
  document.getElementById("modal").style.display = "none";
}
function saveItem() {
  if (currentModalType === "user") {
    const newUser = {
      id: nextUserId++,
      nombre: document.getElementById("field1").value,
      email: document.getElementById("field2").value,
      rol: document.getElementById("field3").value,
    };
    users.push(newUser);
    renderUsers();
  } else {
    const newProduct = {
      id: nextProductId++,
      nombre: document.getElementById("field1").value,
      precio: document.getElementById("field2").value,
      stock: document.getElementById("field3").value,
    };
    productosArray.push(newProduct);
    renderProducts();
  }
  closeModal();
}

// Navegación
function showSection(sectionId) {
  document
    .querySelectorAll(".section")
    .forEach((sec) => (sec.style.display = "none"));
  document.getElementById(sectionId).style.display = "block";
  if (window.innerWidth <= 768) toggleSidebar(false);
  if (sectionId === "users") renderUsers();
  if (sectionId === "products") renderProducts();
  if (sectionId === "dashboard") updateDashboard();
}

function toggleSidebar(forceState) {
  const sidebar = document.getElementById("sidebar");
  if (forceState === false) sidebar.classList.remove("open");
  else sidebar.classList.toggle("open");
}

// Dashboard
function updateDashboard() {
  document.getElementById("total-users").innerText = users.length;
  document.getElementById("total-products").innerText = productosArray.length;

  let stockTotal = productosArray.reduce((sum, p) => sum + p.stock, 0);
  document.getElementById("total-stock").innerText = stockTotal;

  let valorInventario = productosArray.reduce(
    (sum, p) => sum + p.precio * p.stock,
    0
  );
  document.getElementById("total-value").innerText =
    "$" + valorInventario.toLocaleString();
}


// Iniciar en dashboard
showSection("dashboard");

  

    