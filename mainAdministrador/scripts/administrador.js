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
let products = [
  { id: 101, nombre: "Mando PS5", precio: "45.000", stock: 15 },
  { id: 102, nombre: "Mando XBOX One", precio: "30.000", stock: 30 },
];

// Contadores de ID (busca el mayor y sigue desde ahí)
let nextUserId = Math.max(...users.map((u) => u.id)) + 1;
let nextProductId = Math.max(...products.map((p) => p.id)) + 1;

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
  products.forEach((p) => {
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
  products = products.filter((p) => p.id !== id);
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
    products.push(newProduct);
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
  document.getElementById("total-products").innerText = products.length;

  let stockTotal = products.reduce((sum, p) => sum + p.stock, 0);
  document.getElementById("total-stock").innerText = stockTotal;

  let valorInventario = products.reduce(
    (sum, p) => sum + p.precio * p.stock,
    0
  );
  document.getElementById("total-value").innerText =
    "$" + valorInventario.toLocaleString();
}

// Iniciar en dashboard
showSection("dashboard");
