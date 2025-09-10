
let estadoDescuento = {
    codigoAplicado: null,
    monto: 0
};

const codigosDescuento = {
    "DESCUENTO50": { tipo: 'porcentaje', valor: 50 }, 
    "5OFF": { tipo: 'fijo', valor: 5 }             
};

document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito();

    const btnVaciar = document.querySelector("#btn-vaciar-carrito");
    if (btnVaciar) {
        btnVaciar.addEventListener('click', vaciarCarrito);
    }

    const btnAplicarDescuento = document.querySelector("#btn-aplicar-descuento");
    if (btnAplicarDescuento) {
        btnAplicarDescuento.addEventListener('click', aplicarDescuento);
    }
});

function renderizarCarrito() {
    const carritoContenedor = document.querySelector("#carrito-contenedor");
    const carritoVacioMsg = document.querySelector("#carrito-vacio");
    const totalElemento = document.querySelector("#total-carrito");
    const subtotalElemento = document.querySelector("#subtotal-carrito");
    const filaDescuento = document.querySelector("#fila-descuento");
    const montoDescuentoElemento = document.querySelector("#monto-descuento");

    carritoContenedor.innerHTML = "";
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        carritoVacioMsg.style.display = 'block';
        totalElemento.textContent = "$0.00";
        subtotalElemento.textContent = "$0.00";
        filaDescuento.style.display = 'none'; 
        const resumenCard = document.querySelector('.card');
        if (resumenCard) resumenCard.style.display = 'none';
        return;
    }
    
    carritoVacioMsg.style.display = 'none';
    const resumenCard = document.querySelector('.card');
    if (resumenCard) resumenCard.style.display = 'block';

    let subtotal = 0;
    carrito.forEach(item => {
        const producto = productosArray.find(p => p.id === item.id);
        if (producto) {
            subtotal += item.cantidad * producto.precio;
            const divProducto = document.createElement('div');
            divProducto.classList.add('card', 'mb-3', 'shadow-sm');
            divProducto.innerHTML = `
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2 text-center">
                            <img src="${producto.img}" class="img-fluid rounded" alt="${producto.nombre}" style="max-height: 100px; width: 100px; object-fit: cover;">
                        </div>
                        <div class="col-md-5">
                            <h5 class="mb-0">${producto.nombre}</h5>
                            <p class="text-muted mb-1 small">${producto.descripcion ? producto.descripcion.substring(0, 70) + '...' : 'Sin descripción'}</p>
                            <button class="btn btn-sm btn-outline-danger mt-1 btn-eliminar-item" data-id="${producto.id}">Eliminar</button>
                        </div>
                        <div class="col-md-3 text-center d-flex align-items-center justify-content-center">
                            <div class="input-group input-group-sm" style="width: 120px;">
                                <button class="btn btn-outline-secondary btn-cantidad-restar" type="button" data-id="${producto.id}">-</button>
                                <input type="text" class="form-control text-center" value="${item.cantidad}" readonly>
                                <button class="btn btn-outline-secondary btn-cantidad-sumar" type="button" data-id="${producto.id}">+</button>
                            </div>
                        </div>
                        <div class="col-md-2 text-end">
                            <h5 class="mb-0">$${(item.cantidad * producto.precio).toFixed(2)}</h5>
                        </div>
                    </div>
                </div>
            `;
            carritoContenedor.appendChild(divProducto);
        }
    });

    document.querySelectorAll('.btn-eliminar-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const productoId = parseInt(event.target.getAttribute('data-id'));
            eliminarDelCarrito(productoId);
        });
    });
    document.querySelectorAll('.btn-cantidad-restar').forEach(button => {
        button.addEventListener('click', (event) => {
            const productoId = parseInt(event.target.getAttribute('data-id'));
            modificarCantidad(productoId, -1);
        });
    });
    document.querySelectorAll('.btn-cantidad-sumar').forEach(button => {
        button.addEventListener('click', (event) => {
            const productoId = parseInt(event.target.getAttribute('data-id'));
            modificarCantidad(productoId, 1);
        });
    });
    
  
    let montoDescuento = 0;
    if (estadoDescuento.codigoAplicado) {
        const descuento = codigosDescuento[estadoDescuento.codigoAplicado];
        if (descuento.tipo === 'porcentaje') {
            montoDescuento = (subtotal * descuento.valor) / 100;
        } else if (descuento.tipo === 'fijo') {
            montoDescuento = descuento.valor;
        }
        filaDescuento.style.display = 'flex'; 
        montoDescuentoElemento.textContent = `-$${montoDescuento.toFixed(2)}`;
    } else {
        filaDescuento.style.display = 'none'; 
    }

    const totalFinal = subtotal - montoDescuento;
    subtotalElemento.textContent = `$${subtotal.toFixed(2)}`;
    totalElemento.textContent = `$${totalFinal.toFixed(2)}`;
}

function aplicarDescuento() {
    const inputDescuento = document.querySelector("#input-descuento");
    const codigo = inputDescuento.value.trim().toUpperCase();

    if (codigosDescuento[codigo]) {
        estadoDescuento.codigoAplicado = codigo;
        alert(`¡Código "${codigo}" aplicado correctamente!`);
    } else {
        estadoDescuento.codigoAplicado = null; 
        alert("El código de descuento no es válido.");
    }
    inputDescuento.value = ""; 
    renderizarCarrito(); 
}


function eliminarDelCarrito(productoId) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== productoId);
    guardarCarrito(carrito);
    renderizarCarrito();
}

function modificarCantidad(productoId, cambio) {
    let carrito = obtenerCarrito();
    const itemEnCarrito = carrito.find(item => item.id === productoId);
    if (itemEnCarrito) {
        itemEnCarrito.cantidad += cambio;
        if (itemEnCarrito.cantidad < 1) {
            carrito = carrito.filter(item => item.id !== productoId);
        }
    }
    guardarCarrito(carrito);
    renderizarCarrito();
}

function vaciarCarrito() {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        estadoDescuento.codigoAplicado = null; // También limpiar el descuento
        guardarCarrito([]);
        renderizarCarrito();
    }
}