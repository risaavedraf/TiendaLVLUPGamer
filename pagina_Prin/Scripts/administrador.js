let users = [
  {
    id: 1,
    nombre: "Ricardo Saavedra",
    email: "ri.saavedra@duocuc.cl",
    contrasenia: "admin123",
    rol: "Admin",
  },
  {
    id: 2,
    nombre: "Roberto",
    email: "robe@duocuc.cl",
    contrasenia: "admin123",
    rol: "Usuario",
  },
  {
    id: 3,
    nombre: "Ignacio Pérez",
    email: "ign.perezs@duocuc.cl",
    contrasenia: "admin123",
    rol: "Moderador",
  },
];

let productosArray = [
  {
    id: 1,
    nombre: "Teclado Gamer Redragon",
    descripcion: "...",
    categoria: { id: 1, nombre: "Teclados" },
    stock: 15,
    precio: 49.99,
    img: "img/teclado_redragon.png",
  },
  {
    id: 2,
    nombre: "Mouse Gamer Logitech",
    descripcion: "...",
    categoria: { id: 2, nombre: "Mouse" },
    stock: 25,
    precio: 39.99,
    img: "img/mouse_logitech.jpg",
  },
  {
    id: 3,
    nombre: "Auriculares Gamer HyperX",
    descripcion: "...",
    categoria: { id: 3, nombre: "Auriculares" },
    stock: 10,
    precio: 59.99,
    img: "img/auriculares_hyperx.webp",
  },
  {
    id: 4,
    nombre: "Monitor Gamer ASUS",
    descripcion: "...",
    categoria: { id: 4, nombre: "Monitores" },
    stock: 20,
    precio: 299.99,
    img: "img/monitor_asus.jpg",
  },
  {
    id: 5,
    nombre: "Teclado Gamer Razer",
    descripcion: "...",
    categoria: { id: 1, nombre: "Teclados" },
    stock: 5,
    precio: 49.99,
    img: "img/teclado_razer.jpg",
  },
  {
    id: 6,
    nombre: "Mouse Gamer Razer",
    descripcion: "...",
    categoria: { id: 2, nombre: "Mouse" },
    stock: 15,
    precio: 39.99,
    img: "img/mouse_razer.webp",
  },
  {
    id: 7,
    nombre: "Auriculares Gamer Razer",
    descripcion: "...",
    categoria: { id: 3, nombre: "Auriculares" },
    stock: 14,
    precio: 59.99,
    img: "img/auriculares_razer.png",
  },
  {
    id: 8,
    nombre: "Monitor Gamer LG",
    descripcion: "...",
    categoria: { id: 4, nombre: "Monitores" },
    stock: 17,
    precio: 299.99,
    img: "img/monitor_lg.jpg",
  },
  {
    id: 9,
    nombre: "Teclado Gamer Logitech",
    descripcion: "...",
    categoria: { id: 1, nombre: "Teclados" },
    stock: 25,
    precio: 49.99,
    img: "img/teclado_logitech.jpg",
  },
  {
    id: 10,
    nombre: "Mouse Gamer HyperX",
    descripcion: "...",
    categoria: { id: 2, nombre: "Mouse" },
    stock: 35,
    precio: 39.99,
    img: "img/mouse_hyperx.webp",
  },
  {
    id: 11,
    nombre: "Auriculares Gamer Logitech",
    descripcion: "...",
    categoria: { id: 3, nombre: "Auriculares" },
    stock: 12,
    precio: 59.99,
    img: "img/auriculares_logitech.png",
  },
  {
    id: 12,
    nombre: "Monitor Gamer Samsung",
    descripcion: "...",
    categoria: { id: 4, nombre: "Monitores" },
    stock: 23,
    precio: 299.99,
    img: "img/monitor_samsug.jpg",
  },
];

// Contadores
let nextUserId = Math.max(...users.map((u) => u.id)) + 1;
let nextProductId = Math.max(...productosArray.map((p) => p.id)) + 1;

let deleteMode = { user: false, product: false };
let currentModalType = null;

// Cargar usuarios registrados desde localStorage y agregarlos al array users
const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
usuariosRegistrados.forEach((u, idx) => {
  // Evitar duplicados por recarga
  if (!users.some(existing => existing.email === u.correo)) {
    users.push({
      id: users.length ? Math.max(...users.map(us => us.id)) + 1 : 1,
      nombre: `${u.nombre} ${u.apellido}`,
      email: u.correo,
      contrasenia: u.contrasena,
      rol: u.rol || "Usuario"
    });
  }
});

// ---------- UTIL: verificar existencia de elemento antes de usar ----------
function q(selector) {
  return document.querySelector(selector);
}
function exists(id) {
  return document.getElementById(id) !== null;
}

// ---------- RENDER (sólo ejecutan si los elementos existen) ----------
function renderUsers() {
  const tbody = q("#users-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  users.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${u.id}</td><td>${u.nombre}</td><td>${u.email}</td><td>${u.rol} <span class="delete-x" onclick="deleteUser(${u.id})">❌</span></td>`;
    if (deleteMode.user) {
      const x = tr.querySelector(".delete-x");
      if (x) x.style.display = "inline";
    } else {
      const x = tr.querySelector(".delete-x");
      if (x) x.style.display = "none";
    }
    tbody.appendChild(tr);
  });
}

function renderProducts() {
  const tbody = q("#products-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  productosArray.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${p.id}</td><td>${p.nombre}</td><td>$${Number(
      p.precio
    ).toLocaleString()}</td><td>${
      p.stock
    } <span class="delete-x" onclick="deleteProduct(${p.id})">❌</span></td>`;
    if (deleteMode.product) {
      const x = tr.querySelector(".delete-x");
      if (x) x.style.display = "inline";
    } else {
      const x = tr.querySelector(".delete-x");
      if (x) x.style.display = "none";
    }
    tbody.appendChild(tr);
  });
}

// ---------- ELIMINAR ----------
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

// ---------- MODAL (si existe modal) ----------
function openModal(type) {
  const modal = document.getElementById("modal");
  if (!modal) return;
  currentModalType = type;
  modal.style.display = "flex";
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
  const modal = document.getElementById("modal");
  if (!modal) return;
  modal.style.display = "none";
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
      // convertir a número para evitar problemas en sumas
      precio: Number(document.getElementById("field2").value) || 0,
      stock: Number(document.getElementById("field3").value) || 0,
    };
    productosArray.push(newProduct);
    renderProducts();
  }
  closeModal();
}

// ---------- NAVEGACIÓN (segura) ----------
function showSection(sectionId) {
  const all = document.querySelectorAll(".section");
  if (all) all.forEach((sec) => (sec.style.display = "none"));
  const target = document.getElementById(sectionId);
  if (target) {
    target.style.display = "block";
    if (window.innerWidth <= 768) toggleSidebar(false);
    if (sectionId === "users") renderUsers();
    if (sectionId === "products") renderProducts();
    if (sectionId === "dashboard") updateDashboard();
  }
}
function toggleSidebar(forceState) {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  if (forceState === false) sidebar.classList.remove("open");
  else sidebar.classList.toggle("open");
}

// ---------- DASHBOARD (seguro) ----------
function updateDashboard() {
  if (exists("total-users"))
    document.getElementById("total-users").innerText = users.length;
  if (exists("total-products"))
    document.getElementById("total-products").innerText = productosArray.length;

  if (exists("total-stock")) {
    let stockTotal = productosArray.reduce(
      (sum, p) => sum + Number(p.stock),
      0
    );
    document.getElementById("total-stock").innerText = stockTotal;
  }

  if (exists("total-value")) {
    let valorInventario = productosArray.reduce(
      (sum, p) => sum + Number(p.precio) * Number(p.stock),
      0
    );
    document.getElementById("total-value").innerText =
      "$" + valorInventario.toLocaleString();
  }
}

// ---------- LOGIN (seguro) ----------
function handleLoginClick() {
  const emailEl = document.getElementById("typeEmailX");
  const passEl = document.getElementById("typePasswordX");
  if (!emailEl || !passEl) {
    console.warn("Elementos de login no encontrados en esta página.");
    return;
  }

  const email = emailEl.value.trim();
  const contrasenia = passEl.value.trim();

  const user = users.find(
    (u) => u.email === email && u.contrasenia === contrasenia
  );
  if (user) {
    console.log("Login correcto:", user);
    alert(`Bienvenido ${user.nombre} (${user.rol})`);
    // redirigir según rol
    if (user.rol.toLowerCase() === "admin") {
      window.location.href = "administrador.html";
    } else {
      window.location.href = "INDEX.HTML";
    }
  } else {
    alert("Correo o contraseña incorrectos");
  }
}

// ---------- Inicialización: detectar página y enganchar sólo lo necesario ----------
document.addEventListener("DOMContentLoaded", () => {
  // Si estamos en la página de login (botón btnLogin existe) -> enganchar login
  const btnLogin = document.getElementById("btnLogin");
  if (btnLogin) {
    console.log("Inicializando handlers de login");
    btnLogin.addEventListener("click", handleLoginClick);

    // opcional: permitir Enter desde inputs
    ["typeEmailX", "typePasswordX"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter") handleLoginClick();
        });
      }
    });
  }

  // Si detectamos elementos del admin -> inicializar el dashboard
  if (
    exists("sidebar") ||
    exists("dashboard") ||
    exists("users-table") ||
    exists("products-table")
  ) {
    console.log("Inicializando página admin");
    // mostrar dashboard si existe
    if (exists("dashboard")) showSection("dashboard");
    renderUsers();
    renderProducts();
    updateDashboard();
  }
});
