let users = [
  {
    id: 1,
    run: "21123123K",
    nombre: "Ricardo",
    apellido: "Saavedra",
    email: "ri.saavedra@duocuc.cl",
    contrasenia: "admin123",
    direccion: "El tabo",
    rol: "Admin",
  },
  {
    id: 2,
    run: "19437243K",
    nombre: "Roberto",
    apellido: "Apellido",
    email: "robe@duocuc.cl",
    contrasenia: "admin123",
    direccion: "Su casa",
    rol: "Usuario",
  },
  {
    id: 3,
    run: "215091503",
    nombre: "Ignacio",
    apellido: "Pérez",
    email: "ign.perezs@duocuc.cl",
    contrasenia: "admin123",
    direccion: "Vergel 2015",
    rol: "Vendedor",
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
let orders = [
  {
    id: 1,
    usuario: "Ricardo",
    fecha: "2025-09-09",
    total: 89.98,
    detalles: [
      {
        producto: "Teclado Gamer Redragon",
        cantidad: 1,
        precioUnitario: 49.99,
      },
      { producto: "Mouse Gamer Logitech", cantidad: 1, precioUnitario: 39.99 },
    ],
  },
];
// Adaptar regionesYComunas a formato esperado por el admin
let regiones = [];
if (typeof regionesYComunas !== "undefined") {
  regiones = regionesYComunas.map((r) => ({
    nombre: r.region,
    comunas: r.comunas.map((c) => c.nombre),
  }));
}

//Se crean los limites de texto
const limits = {
  user: { run: 9, nombre: 50, apellido: 100, email: 100, direccion: 300 },
  product: { nombre: 100, descripcion: 500 },
};

function limitText(value, max) {
  return value.length > max ? value.slice(0, max) : value;
}

function actualizarHeader() {
  const vistaInvitado = document.querySelector("#vista-invitado");
  const vistaUsuario = document.querySelector("#vista-usuario");
  const mensajeBienvenida = document.querySelector("#mensaje-bienvenida");

  // Revisa si los elementos del header existen antes de continuar
  if (!vistaInvitado || !vistaUsuario || !mensajeBienvenida) {
    return;
  }

  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

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
  localStorage.removeItem("usuarioLogueado");
  // Redirige a la página de inicio para refrescar el estado
  window.location.href = "INDEX.HTML";
}

// Contadores
let nextUserId = Math.max(...users.map((u) => u.id)) + 1;
let nextProductId = Math.max(...productosArrayAdmin.map((p) => p.id)) + 1;
let nextOrderId = Math.max(...orders.map((o) => o.id)) + 1;

let deleteMode = { user: false, product: false, order: false };
let currentModalType = null;

// Cargar usuarios registrados desde localStorage y agregarlos al array users
const usuariosRegistrados =
  JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
usuariosRegistrados.forEach((u, idx) => {
  // Evitar duplicados por recarga
  if (!users.some((existing) => existing.email === u.correo)) {
    users.push({
      id: users.length ? Math.max(...users.map((us) => us.id)) + 1 : 1,
      nombre: `${u.nombre} ${u.apellido}`,
      email: u.correo,
      contrasenia: u.contrasena,
      rol: u.rol || "Usuario",
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
    tr.innerHTML = `<td>${u.id}</td>
    <td>${u.run}</td>
    <td>${u.nombre}</td>
    <td>${u.apellido}</td>
    <td>${u.email}</td>
    <td>${u.direccion}</td>
    <td>${u.rol} <span class="delete-x" onclick="deleteUser(${u.id})">❌</span></td>`;
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
    tr.innerHTML = `<td>${p.id}</td>
    <td>${p.nombre}</td>
    <td>${p.descripcion}</td>
    <td>$${Number(p.precio).toLocaleString()}</td>
    <td>${p.stock} <span class="delete-x" onclick="deleteProduct(${
      p.id
    })">❌</span></td>`;
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

function renderOrders() {
  const tbody = q("#orders-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  orders.forEach((o) => {
    const detalles = o.detalles
      .map((d) => `${d.producto} (x${d.cantidad})`)
      .join("<br>");
    // Muestra dirección, región y comuna si existen
    let envio = "No registrado";
    if (o.envio) {
      envio = `${o.envio.direccion}<br>${o.envio.comuna}, ${o.envio.region}`;
    }
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.usuario}</td>
      <td>${o.fecha}</td>
      <td>$${o.total.toLocaleString()}</td>
      <td>${envio}</td>
      <td>${detalles}
        <span class="delete-x" onclick="deleteOrder(${o.id})">
          ❌
        </span>
      </td>
    `;
    const x = tr.querySelector(".delete-x");
    if (deleteMode.order) {
      if (x) x.style.display = "inline";
    } else {
      if (x) x.style.display = "none";
    }
    tbody.appendChild(tr);
  });
}

let productosOrdenTemp = [];

function poblarProductosOrden() {
  const select = document.getElementById("orderProductSelect");
  if (!select) return;
  select.innerHTML = "";
  productosArrayAdmin.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.nombre} ($${p.precio})`;
    select.appendChild(opt);
  });
}
function addProductToOrder() {
  const select = document.getElementById("orderProductSelect");
  const qty = parseInt(document.getElementById("orderProductQty").value, 10);
  const prodId = Number(select.value);
  const producto = productosArrayAdmin.find((p) => p.id === prodId);
  if (!producto || qty < 1) return;

  productosOrdenTemp.push({
    producto: producto.nombre,
    cantidad: qty,
    precioUnitario: producto.precio,
  });
  renderOrderDetailsList();
  updateOrderTotal();
}

function renderOrderDetailsList() {
  const ul = document.getElementById("orderDetailsList");
  if (!ul) return;
  ul.innerHTML = "";
  productosOrdenTemp.forEach((item, idx) => {
    const li = document.createElement("li");
    li.textContent = `${item.producto} x${item.cantidad} ($${item.precioUnitario})`;
    ul.appendChild(li);
  });
}

function updateOrderTotal() {
  const total = productosOrdenTemp.reduce(
    (sum, p) => sum + p.cantidad * p.precioUnitario,
    0
  );
  const totalSpan = document.getElementById("orderTotal");
  if (totalSpan) totalSpan.textContent = total.toLocaleString();
}

// ---------- ELIMINAR ----------
function toggleDeleteMode(type) {
  deleteMode[type] = !deleteMode[type];
  if (type === "user") renderUsers();
  else if (type === "product") renderProducts();
  else if (type === "order") renderOrders();
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
function deleteOrder(id) {
  orders = orders.filter((o) => o.id !== id);
  renderOrders();
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
    for (let i = 1; i <= 6; i++) {
      const field = document.getElementById(`field${i}`);
      field.style.display = "";
      field.type = "text";
    }
    document.getElementById("field1").placeholder = "Run";
    document.getElementById("field2").placeholder = "Nombre";
    document.getElementById("field3").placeholder = "Apellidos";
    document.getElementById("field4").placeholder = "Email";
    document.getElementById("field5").placeholder = "Dirección";
    document.getElementById("field6").style.display = "";
    document.getElementById("field6").placeholder = "Rol";
    document.getElementById("regionSelect").style.display = "";
    document.getElementById("comunaSelect").style.display = "";
    document.getElementById("orderDetailsContainer").style.display = "none";
    poblarRegiones();
    document.getElementById("comunaSelect").innerHTML =
      '<option value="">Seleccione Comuna</option>';

    document.getElementById("field1").maxLength = limits.user.run;
    document.getElementById("field2").maxLength = limits.user.nombre;
    document.getElementById("field3").maxLength = limits.user.apellido;
    document.getElementById("field4").maxLength = limits.user.email;
    document.getElementById("field5").maxLength = limits.user.direccion;
    document.getElementById("field6").maxLength = 20;
    const regionSelect = document.getElementById("regionSelect");
    regionSelect.onchange = function () {
      poblarComunas(this.value);
    };
  } else if (type === "product") {
    document.getElementById("modal-title").innerText = "Añadir Producto";
    // Solo mostrar los primeros 4 campos
    for (let i = 1; i <= 4; i++) {
      const field = document.getElementById(`field${i}`);
      field.style.display = "";
      // Cambia tipo según campo
      if (i === 3) {
        field.type = "number";
        field.step = "0.01";
        field.min = "0";
      } else if (i === 4) {
        field.type = "number";
        field.step = "1";
        field.min = "0";
      } else {
        field.type = "text";
      }
    }
    for (let i = 5; i <= 6; i++) {
      document.getElementById(`field${i}`).style.display = "none";
    }
    document.getElementById("field1").placeholder = "Producto";
    document.getElementById("field2").placeholder = "Descripción";
    document.getElementById("field3").placeholder = "Precio";
    document.getElementById("field4").placeholder = "Stock";
    document.getElementById("regionSelect").style.display = "none";
    document.getElementById("comunaSelect").style.display = "none";
    document.getElementById("orderDetailsContainer").style.display = "none";
  } else if (type === "order") {
    document.getElementById("modal-title").innerText = "Añadir Orden";
    // Oculta los fields de usuario/producto
    for (let i = 1; i <= 6; i++) {
      document.getElementById(`field${i}`).style.display = "none";
    }
    document.getElementById("regionSelect").style.display = "none";
    document.getElementById("comunaSelect").style.display = "none";
    document.getElementById("orderDetailsContainer").style.display = "";
    productosOrdenTemp = [];
    poblarProductosOrden();
    renderOrderDetailsList();
    updateOrderTotal();
    // Muestra campo para nombre de usuario (puedes usar field1 para esto)
    document.getElementById("field1").style.display = "";
    document.getElementById("field1").placeholder = "Nombre usuario";
  }

  // Limpia los campos
  for (let i = 1; i <= 6; i++) {
    document.getElementById(`field${i}`).value = "";
  }
  document.getElementById("regionSelect").value = "";
  document.getElementById("comunaSelect").innerHTML =
    '<option value="">Seleccione Comuna</option>';
}
function closeModal() {
  const modal = document.getElementById("modal");
  if (!modal) return;
  modal.style.display = "none";
  for (let i = 1; i <= 5; i++) {
    const field = document.getElementById(`field${i}`);
    if (field) field.value = "";
  }
  const regionSelect = document.getElementById("regionSelect");
  if (regionSelect) regionSelect.value = "";
  const comunaSelect = document.getElementById("comunaSelect");
  if (comunaSelect)
    comunaSelect.innerHTML = '<option value="">Seleccione Comuna</option>';
  productosOrdenTemp = [];
  renderOrderDetailsList();
  updateOrderTotal();
}

function poblarRegiones() {
  const regionSelect = document.getElementById("regionSelect");
  regionSelect.innerHTML = '<option value="">Seleccione Región</option>';
  regiones.forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r.nombre;
    opt.textContent = r.nombre;
    regionSelect.appendChild(opt);
  });
}

function poblarComunas(regionNombre) {
  const comunaSelect = document.getElementById("comunaSelect");
  comunaSelect.innerHTML = '<option value="">Seleccione Comuna</option>';
  const region = regiones.find((r) => r.nombre === regionNombre);
  if (region) {
    region.comunas.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      comunaSelect.appendChild(opt);
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const regionSelect = document.getElementById("regionSelect");
  if (regionSelect) {
    regionSelect.addEventListener("change", function () {
      poblarComunas(this.value);
    });
  }
});
function saveItem() {
  if (currentModalType === "user") {
    const region = document.getElementById("regionSelect").value;
    const comuna = document.getElementById("comunaSelect").value;
    const direccion = limitText(
      document.getElementById("field5").value,
      limits.user.direccion
    );
    const rol = document.getElementById("field6").value;
    if (!region || !comuna || !rol) {
      alert("Por favor, seleccione región, comuna y rol.");
      return;
    }

    const newUser = {
      id: nextUserId++,
      run: limitText(document.getElementById("field1").value, limits.user.run),
      nombre: limitText(
        document.getElementById("field2").value,
        limits.user.nombre
      ),
      apellido: limitText(
        document.getElementById("field3").value,
        limits.user.apellido
      ),
      email: limitText(
        document.getElementById("field4").value,
        limits.user.email
      ),
      contrasenia: "default123",
      direccion: direccion,
      region: region,
      comuna: comuna,
      rol: rol,
    };
    users.push(newUser);
    renderUsers();
  } else if (currentModalType === "product") {
    const newProduct = {
      id: nextProductId++,
      nombre: limitText(
        document.getElementById("field1").value,
        limits.product.nombre
      ),
      descripcion: limitText(
        document.getElementById("field2").value,
        limits.product.descripcion
      ),
      // convertir a número para evitar problemas en sumas
      precio: Number(document.getElementById("field3").value) || 0,
      stock: Number(document.getElementById("field4").value) || 0,
    };
    productosArrayAdmin.push(newProduct);
    renderProducts();
  } else if (currentModalType === "order") {
    const usuario = document.getElementById("field1").value.trim();
    if (!usuario || productosOrdenTemp.length === 0) {
      alert("Debe ingresar un usuario y al menos un producto.");
      return;
    }
    const total = productosOrdenTemp.reduce(
      (sum, p) => sum + p.cantidad * p.precioUnitario,
      0
    );
    const newOrder = {
      id: nextOrderId++,
      usuario: usuario,
      fecha: new Date().toISOString().split("T")[0],
      total: total,
      detalles: [...productosOrdenTemp],
    };
    orders.push(newOrder);
    renderOrders();
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
    if (sectionId === "orders") renderOrders();
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
    document.getElementById("total-products").innerText =
      productosArrayAdmin.length;
  if (exists("total-orders"))
    document.getElementById("total-orders").innerText = orders.length;

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
    localStorage.setItem("usuarioLogueado", JSON.stringify(user));

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
    renderOrders();
    updateDashboard();
  }

  // Si detectamos elementos del admin -> inicializar el dashboard
  if (
    exists("sidebar") ||
    exists("dashboard") ||
    exists("users-table") ||
    exists("products-table") ||
    exists("orders-table")
  ) {
    console.log("Inicializando página admin");
    // mostrar dashboard si existe
    if (exists("dashboard")) showSection("dashboard");
    renderUsers();
    renderProducts();
    renderOrders();
    updateDashboard();
  }
});
