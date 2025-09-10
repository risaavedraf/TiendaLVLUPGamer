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
let productosArrayAdmin = [
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

function actualizarHeader() {
    const vistaInvitado = document.querySelector("#vista-invitado");
    const vistaUsuario = document.querySelector("#vista-usuario");
    const mensajeBienvenida = document.querySelector("#mensaje-bienvenida");

    // Revisa si los elementos del header existen antes de continuar
    if (!vistaInvitado || !vistaUsuario || !mensajeBienvenida) {
        return;
    }

    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (usuarioLogueado) {
        vistaInvitado.style.display = "none";
        vistaUsuario.style.display = "block";
        mensajeBienvenida.textContent = `Bienvenido, ${usuarioLogueado.nombre}`;
    } else {
        vistaInvitado.style.display = "block";
        vistaUsuario.style.display = "none";
    }
}

function cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    // Redirige a la página de inicio para refrescar el estado
    window.location.href = "INDEX.HTML";
}

// Contadores
let nextUserId = Math.max(...users.map((u) => u.id)) + 1;
let nextProductId = Math.max(...productosArrayAdmin.map((p) => p.id)) + 1;

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
  productosArrayAdmin.forEach((p) => {
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
  productosArrayAdmin = productosArrayAdmin.filter((p) => p.id !== id);
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
    productosArrayAdmin.push(newProduct);
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
    document.getElementById("total-products").innerText = productosArrayAdmin.length;

  if (exists("total-stock")) {
    let stockTotal = productosArrayAdmin.reduce(
      (sum, p) => sum + Number(p.stock),
      0
    );
    document.getElementById("total-stock").innerText = stockTotal;
  }

  if (exists("total-value")) {
    let valorInventario = productosArrayAdmin.reduce(
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
  if (!emailEl || !passEl) return;

  const email = emailEl.value.trim();
  const contrasenia = passEl.value.trim();

  const user = users.find(
    (u) => u.email === email && u.contrasenia === contrasenia
  );

  if (user) {
    // --- LÍNEA CLAVE AÑADIDA ---
    // Guardamos el usuario encontrado en localStorage para iniciar la sesión
    localStorage.setItem('usuarioLogueado', JSON.stringify(user));

    alert(`Bienvenido ${user.nombre} (${user.rol})`);
    
    // Redirigir según rol
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
  // 1. SIEMPRE intenta actualizar el header en cualquier página
  // Usamos un pequeño retraso para asegurar que el header cargado con jQuery esté disponible
  setTimeout(actualizarHeader, 100);

  // 2. Si estamos en la página de login, engancha el evento al botón
  const btnLogin = document.getElementById("btnLogin");
  if (btnLogin) {
    btnLogin.addEventListener("click", handleLoginClick);
  }

  // 3. Si estamos en la página de admin, inicializa sus componentes
  if (document.getElementById("sidebar")) {
    showSection("dashboard");
    renderUsers();
    renderProducts();
    updateDashboard();
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
