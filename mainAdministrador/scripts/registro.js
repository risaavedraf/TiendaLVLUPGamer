const regionesYComunas = [
  {
    region: "Región de Arica y Parinacota",
    comunas: [
      { nombre: "Arica", ciudad: "Arica" },
      { nombre: "Camarones", ciudad: "Camarones" },
      { nombre: "Putre", ciudad: "Putre" },
      { nombre: "General Lagos", ciudad: "General Lagos" }
    ]
  },
  {
    region: "Región de Tarapacá",
    comunas: [
      { nombre: "Iquique", ciudad: "Iquique" },
      { nombre: "Alto Hospicio", ciudad: "Alto Hospicio" },
      { nombre: "Pozo Almonte", ciudad: "Pozo Almonte" },
      { nombre: "Camiña", ciudad: "Camiña" },
      { nombre: "Colchane", ciudad: "Colchane" },
      { nombre: "Huara", ciudad: "Huara" },
      { nombre: "Pica", ciudad: "Pica" }
    ]
  },
  {
    region: "Región de Antofagasta",
    comunas: [
      { nombre: "Antofagasta", ciudad: "Antofagasta" },
      { nombre: "Mejillones", ciudad: "Mejillones" },
      { nombre: "Sierra Gorda", ciudad: "Sierra Gorda" },
      { nombre: "Taltal", ciudad: "Taltal" },
      { nombre: "Calama", ciudad: "Calama" },
      { nombre: "Ollagüe", ciudad: "Ollagüe" },
      { nombre: "San Pedro de Atacama", ciudad: "San Pedro de Atacama" },
      { nombre: "Tocopilla", ciudad: "Tocopilla" },
      { nombre: "María Elena", ciudad: "María Elena" }
    ]
  },
  {
    region: "Región de Atacama",
    comunas: [
      { nombre: "Copiapó", ciudad: "Copiapó" },
      { nombre: "Caldera", ciudad: "Caldera" },
      { nombre: "Tierra Amarilla", ciudad: "Tierra Amarilla" },
      { nombre: "Chañaral", ciudad: "Chañaral" },
      { nombre: "Diego de Almagro", ciudad: "Diego de Almagro" },
      { nombre: "Vallenar", ciudad: "Vallenar" },
      { nombre: "Alto del Carmen", ciudad: "Alto del Carmen" },
      { nombre: "Freirina", ciudad: "Freirina" },
      { nombre: "Huasco", ciudad: "Huasco" }
    ]
  },
  {
    region: "Región de Coquimbo",
    comunas: [
      { nombre: "La Serena", ciudad: "La Serena" },
      { nombre: "Coquimbo", ciudad: "Coquimbo" },
      { nombre: "Andacollo", ciudad: "Andacollo" },
      { nombre: "La Higuera", ciudad: "La Higuera" },
      { nombre: "Paiguano", ciudad: "Paiguano" },
      { nombre: "Vicuña", ciudad: "Vicuña" },
      { nombre: "Illapel", ciudad: "Illapel" },
      { nombre: "Canela", ciudad: "Canela" },
      { nombre: "Los Vilos", ciudad: "Los Vilos" },
      { nombre: "Salamanca", ciudad: "Salamanca" },
      { nombre: "Ovalle", ciudad: "Ovalle" },
      { nombre: "Combarbalá", ciudad: "Combarbalá" },
      { nombre: "Monte Patria", ciudad: "Monte Patria" },
      { nombre: "Punitaqui", ciudad: "Punitaqui" },
      { nombre: "Río Hurtado", ciudad: "Río Hurtado" }
    ]
  },
  {
    region: "Región de Valparaíso",
    comunas: [
      { nombre: "Valparaíso", ciudad: "Valparaíso" },
      { nombre: "Casablanca", ciudad: "Casablanca" },
      { nombre: "Concón", ciudad: "Concón" },
      { nombre: "Juan Fernández", ciudad: "Juan Fernández" },
      { nombre: "Puchuncaví", ciudad: "Puchuncaví" },
      { nombre: "Quintero", ciudad: "Quintero" },
      { nombre: "Viña del Mar", ciudad: "Viña del Mar" },
      { nombre: "Isla de Pascua", ciudad: "Isla de Pascua" },
      { nombre: "Los Andes", ciudad: "Los Andes" },
      { nombre: "Calle Larga", ciudad: "Calle Larga" },
      { nombre: "Rinconada", ciudad: "Rinconada" },
      { nombre: "San Esteban", ciudad: "San Esteban" },
      { nombre: "La Ligua", ciudad: "La Ligua" },
      { nombre: "Cabildo", ciudad: "Cabildo" },
      { nombre: "Papudo", ciudad: "Papudo" },
      { nombre: "Petorca", ciudad: "Petorca" },
      { nombre: "Zapallar", ciudad: "Zapallar" },
      { nombre: "Quillota", ciudad: "Quillota" },
      { nombre: "Calera", ciudad: "Calera" },
      { nombre: "Hijuelas", ciudad: "Hijuelas" },
      { nombre: "La Cruz", ciudad: "La Cruz" },
      { nombre: "Nogales", ciudad: "Nogales" },
      { nombre: "San Antonio", ciudad: "San Antonio" },
      { nombre: "Algarrobo", ciudad: "Algarrobo" },
      { nombre: "Cartagena", ciudad: "Cartagena" },
      { nombre: "El Quisco", ciudad: "El Quisco" },
      { nombre: "El Tabo", ciudad: "El Tabo" },
      { nombre: "San Antonio", ciudad: "San Antonio" },
      { nombre: "Santo Domingo", ciudad: "Santo Domingo" },
      { nombre: "San Felipe", ciudad: "San Felipe" },
      { nombre: "Catemu", ciudad: "Catemu" },
      { nombre: "Llaillay", ciudad: "Llaillay" },
      { nombre: "Panquehue", ciudad: "Panquehue" },
      { nombre: "Putaendo", ciudad: "Putaendo" },
      { nombre: "Santa María", ciudad: "Santa María" }
    ]
  },
  {
    region: "Región Metropolitana de Santiago",
    comunas: [
      { nombre: "Cerrillos", ciudad: "Cerrillos" },
      { nombre: "Cerro Navia", ciudad: "Cerro Navia" },
      { nombre: "Conchalí", ciudad: "Conchalí" },
      { nombre: "El Bosque", ciudad: "El Bosque" },
      { nombre: "Estación Central", ciudad: "Estación Central" },
      { nombre: "Huechuraba", ciudad: "Huechuraba" },
      { nombre: "Independencia", ciudad: "Independencia" },
      { nombre: "La Cisterna", ciudad: "La Cisterna" },
      { nombre: "La Florida", ciudad: "La Florida" },
      { nombre: "La Granja", ciudad: "La Granja" },
      { nombre: "La Pintana", ciudad: "La Pintana" },
      { nombre: "La Reina", ciudad: "La Reina" },
      { nombre: "Las Condes", ciudad: "Las Condes" },
      { nombre: "Lo Barnechea", ciudad: "Lo Barnechea" },
      { nombre: "Lo Espejo", ciudad: "Lo Espejo" },
      { nombre: "Lo Prado", ciudad: "Lo Prado" },
      { nombre: "Macul", ciudad: "Macul" },
      { nombre: "Maipú", ciudad: "Maipú" },
      { nombre: "Ñuñoa", ciudad: "Ñuñoa" },
      { nombre: "Pedro Aguirre Cerda", ciudad: "Pedro Aguirre Cerda" },
      { nombre: "Peñalolén", ciudad: "Peñalolén" },
      { nombre: "Providencia", ciudad: "Providencia" },
      { nombre: "Pudahuel", ciudad: "Pudahuel" },
      { nombre: "Quilicura", ciudad: "Quilicura" },
      { nombre: "Quinta Normal", ciudad: "Quinta Normal" },
      { nombre: "Recoleta", ciudad: "Recoleta" },
      { nombre: "Renca", ciudad: "Renca" },
      { nombre: "San Joaquín", ciudad: "San Joaquín" },
      { nombre: "San Miguel", ciudad: "San Miguel" },
      { nombre: "San Ramón", ciudad: "San Ramón" },
      { nombre: "Vitacura", ciudad: "Vitacura" },
      { nombre: "Puente Alto", ciudad: "Puente Alto" },
      { nombre: "Pirque", ciudad: "Pirque" },
      { nombre: "San José de Maipo", ciudad: "San José de Maipo" },
      { nombre: "Colina", ciudad: "Colina" },
      { nombre: "Lampa", ciudad: "Lampa" },
      { nombre: "Tiltil", ciudad: "Tiltil" },
      { nombre: "San Bernardo", ciudad: "San Bernardo" },
      { nombre: "Buin", ciudad: "Buin" },
      { nombre: "Calera de Tango", ciudad: "Calera de Tango" },
      { nombre: "Paine", ciudad: "Paine" },
      { nombre: "Melipilla", ciudad: "Melipilla" },
      { nombre: "Alhué", ciudad: "Alhué" },
      { nombre: "Curacaví", ciudad: "Curacaví" },
      { nombre: "María Pinto", ciudad: "María Pinto" },
      { nombre: "San Pedro", ciudad: "San Pedro" },
      { nombre: "Talagante", ciudad: "Talagante" },
      { nombre: "El Monte", ciudad: "El Monte" },
      { nombre: "Isla de Maipo", ciudad: "Isla de Maipo" },
      { nombre: "Padre Hurtado", ciudad: "Padre Hurtado" },
      { nombre: "Peñaflor", ciudad: "Peñaflor" }
    ]
  },
  {
    region: "Región del Libertador General Bernardo O'Higgins",
    comunas: [
      { nombre: "Rancagua", ciudad: "Rancagua" },
      { nombre: "Codegua", ciudad: "Codegua" },
      { nombre: "Coinco", ciudad: "Coinco" },
      { nombre: "Coltauco", ciudad: "Coltauco" },
      { nombre: "Doñihue", ciudad: "Doñihue" },
      { nombre: "Graneros", ciudad: "Graneros" },
      { nombre: "Las Cabras", ciudad: "Las Cabras" },
      { nombre: "Machalí", ciudad: "Machalí" },
      { nombre: "Malloa", ciudad: "Malloa" },
      { nombre: "Mostazal", ciudad: "Mostazal" },
      { nombre: "Olivar", ciudad: "Olivar" },
      { nombre: "Peumo", ciudad: "Peumo" },
      { nombre: "Pichidegua", ciudad: "Pichidegua" },
      { nombre: "Quinta de Tilcoco", ciudad: "Quinta de Tilcoco" },
      { nombre: "Rengo", ciudad: "Rengo" },
      { nombre: "Requínoa", ciudad: "Requínoa" },
      { nombre: "San Vicente", ciudad: "San Vicente" },
      { nombre: "Pichilemu", ciudad: "Pichilemu" },
      { nombre: "La Estrella", ciudad: "La Estrella" },
      { nombre: "Litueche", ciudad: "Litueche" },
      { nombre: "Marchigüe", ciudad: "Marchigüe" },
      { nombre: "Navidad", ciudad: "Navidad" },
      { nombre: "Paredones", ciudad: "Paredones" },
      { nombre: "San Fernando", ciudad: "San Fernando" },
      { nombre: "Chépica", ciudad: "Chépica" },
      { nombre: "Chimbarongo", ciudad: "Chimbarongo" },
      { nombre: "Lolol", ciudad: "Lolol" },
      { nombre: "Nancagua", ciudad: "Nancagua" },
      { nombre: "Palmilla", ciudad: "Palmilla" },
      { nombre: "Peralillo", ciudad: "Peralillo" },
      { nombre: "Placilla", ciudad: "Placilla" },
      { nombre: "Pumanque", ciudad: "Pumanque" },
      { nombre: "Santa Cruz", ciudad: "Santa Cruz" }
    ]
  },
  {
    region: "Región del Maule",
    comunas: [
      { nombre: "Talca", ciudad: "Talca" },
      { nombre: "Constitución", ciudad: "Constitución" },
      { nombre: "Curepto", ciudad: "Curepto" },
      { nombre: "Empedrado", ciudad: "Empedrado" },
      { nombre: "Maule", ciudad: "Maule" },
      { nombre: "Pelarco", ciudad: "Pelarco" },
      { nombre: "Pencahue", ciudad: "Pencahue" },
      { nombre: "Río Claro", ciudad: "Río Claro" },
      { nombre: "San Clemente", ciudad: "San Clemente" },
      { nombre: "San Rafael", ciudad: "San Rafael" },
      { nombre: "Cauquenes", ciudad: "Cauquenes" },
      { nombre: "Chanco", ciudad: "Chanco" },
      { nombre: "Pelluhue", ciudad: "Pelluhue" },
      { nombre: "Curicó", ciudad: "Curicó" },
      { nombre: "Hualañé", ciudad: "Hualañé" },
      { nombre: "Licantén", ciudad: "Licantén" },
      { nombre: "Molina", ciudad: "Molina" },
      { nombre: "Rauco", ciudad: "Rauco" },
      { nombre: "Romeral", ciudad: "Romeral" },
      { nombre: "Sagrada Familia", ciudad: "Sagrada Familia" },
      { nombre: "Teno", ciudad: "Teno" },
      { nombre: "Vichuquén", ciudad: "Vichuquén" },
      { nombre: "Linares", ciudad: "Linares" },
      { nombre: "Colbún", ciudad: "Colbún" },
      { nombre: "Longaví", ciudad: "Longaví" },
      { nombre: "Parral", ciudad: "Parral" },
      { nombre: "Retiro", ciudad: "Retiro" },
      { nombre: "San Javier", ciudad: "San Javier" },
      { nombre: "Villa Alegre", ciudad: "Villa Alegre" },
      { nombre: "Yerbas Buenas", ciudad: "Yerbas Buenas" }
    ]
  },
  {
    region: "Región de Ñuble",
    comunas: [
      { nombre: "Chillán", ciudad: "Chillán" },
      { nombre: "Bulnes", ciudad: "Bulnes" },
      { nombre: "Cobquecura", ciudad: "Cobquecura" },
      { nombre: "Coelemu", ciudad: "Coelemu" },
      { nombre: "Coihueco", ciudad: "Coihueco" },
      { nombre: "El Carmen", ciudad: "El Carmen" },
      { nombre: "Ninhue", ciudad: "Ninhue" },
      { nombre: "Ñiquén", ciudad: "Ñiquén" },
      { nombre: "Pemuco", ciudad: "Pemuco" },
      { nombre: "Pinto", ciudad: "Pinto" },
      { nombre: "Portezuelo", ciudad: "Portezuelo" },
      { nombre: "Quillón", ciudad: "Quillón" },
      { nombre: "Quirihue", ciudad: "Quirihue" },
      { nombre: "Ránquil", ciudad: "Ránquil" },
      { nombre: "San Carlos", ciudad: "San Carlos" },
      { nombre: "San Fabián", ciudad: "San Fabián" },
      { nombre: "San Ignacio", ciudad: "San Ignacio" },
      { nombre: "San Nicolás", ciudad: "San Nicolás" },
      { nombre: "Treguaco", ciudad: "Treguaco" },
      { nombre: "Yungay", ciudad: "Yungay" }
    ]
  },
  {
    region: "Región del Biobío",
    comunas: [
      { nombre: "Concepción", ciudad: "Concepción" },
      { nombre: "Coronel", ciudad: "Coronel" },
      { nombre: "Chiguayante", ciudad: "Chiguayante" },
      { nombre: "Florida", ciudad: "Florida" },
      { nombre: "Hualpén", ciudad: "Hualpén" },
      { nombre: "Hualqui", ciudad: "Hualqui" },
      { nombre: "Lota", ciudad: "Lota" },
      { nombre: "Penco", ciudad: "Penco" },
      { nombre: "San Pedro de la Paz", ciudad: "San Pedro de la Paz" },
      { nombre: "Santa Juana", ciudad: "Santa Juana" },
      { nombre: "Talcahuano", ciudad: "Talcahuano" },
      { nombre: "Tomé", ciudad: "Tomé" },
      { nombre: "Hualqui", ciudad: "Hualqui" },
      { nombre: "Cabrero", ciudad: "Cabrero" },
      { nombre: "Laja", ciudad: "Laja" },
      { nombre: "Los Ángeles", ciudad: "Los Ángeles" },
      { nombre: "Mulchén", ciudad: "Mulchén" },
      { nombre: "Nacimiento", ciudad: "Nacimiento" },
      { nombre: "Negrete", ciudad: "Negrete" },
      { nombre: "Quilaco", ciudad: "Quilaco" },
      { nombre: "Quilleco", ciudad: "Quilleco" },
      { nombre: "San Rosendo", ciudad: "San Rosendo" },
      { nombre: "Santa Bárbara", ciudad: "Santa Bárbara" },
      { nombre: "Tucapel", ciudad: "Tucapel" },
      { nombre: "Yumbel", ciudad: "Yumbel" },
      { nombre: "Alto Biobío", ciudad: "Alto Biobío" }
    ]
  },
  {
    region: "Región de La Araucanía",
    comunas: [
      { nombre: "Temuco", ciudad: "Temuco" },
      { nombre: "Carahue", ciudad: "Carahue" },
      { nombre: "Cunco", ciudad: "Cunco" },
      { nombre: "Curarrehue", ciudad: "Curarrehue" },
      { nombre: "Freire", ciudad: "Freire" },
      { nombre: "Galvarino", ciudad: "Galvarino" },
      { nombre: "Gorbea", ciudad: "Gorbea" },
      { nombre: "Lautaro", ciudad: "Lautaro" },
      { nombre: "Loncoche", ciudad: "Loncoche" },
      { nombre: "Melipeuco", ciudad: "Melipeuco" },
      { nombre: "Nueva Imperial", ciudad: "Nueva Imperial" },
      { nombre: "Padre Las Casas", ciudad: "Padre Las Casas" },
      { nombre: "Perquenco", ciudad: "Perquenco" },
      { nombre: "Pitrufquén", ciudad: "Pitrufquén" },
      { nombre: "Pucón", ciudad: "Pucón" },
      { nombre: "Saavedra", ciudad: "Saavedra" },
      { nombre: "Teodoro Schmidt", ciudad: "Teodoro Schmidt" },
      { nombre: "Toltén", ciudad: "Toltén" },
      { nombre: "Vilcún", ciudad: "Vilcún" },
      { nombre: "Villarrica", ciudad: "Villarrica" },
      { nombre: "Cholchol", ciudad: "Cholchol" },
      { nombre: "Angol", ciudad: "Angol" },
      { nombre: "Collipulli", ciudad: "Collipulli" },
      { nombre: "Curacautín", ciudad: "Curacautín" },
      { nombre: "Ercilla", ciudad: "Ercilla" },
      { nombre: "Lonquimay", ciudad: "Lonquimay" },
      { nombre: "Los Sauces", ciudad: "Los Sauces" },
      { nombre: "Lumaco", ciudad: "Lumaco" },
      { nombre: "Purén", ciudad: "Purén" },
      { nombre: "Renaico", ciudad: "Renaico" },
      { nombre: "Traiguén", ciudad: "Traiguén" },
      { nombre: "Victoria", ciudad: "Victoria" }
    ]
  },
  {
    region: "Región de Los Ríos",
    comunas: [
      { nombre: "Valdivia", ciudad: "Valdivia" },
      { nombre: "Corral", ciudad: "Corral" },
      { nombre: "Lanco", ciudad: "Lanco" },
      { nombre: "Los Lagos", ciudad: "Los Lagos" },
      { nombre: "Máfil", ciudad: "Máfil" },
      { nombre: "Mariquina", ciudad: "Mariquina" },
      { nombre: "Paillaco", ciudad: "Paillaco" },
      { nombre: "Panguipulli", ciudad: "Panguipulli" },
      { nombre: "La Unión", ciudad: "La Unión" },
      { nombre: "Futrono", ciudad: "Futrono" },
      { nombre: "Lago Ranco", ciudad: "Lago Ranco" },
      { nombre: "Río Bueno", ciudad: "Río Bueno" }
    ]
  },
  {
    region: "Región de Los Lagos",
    comunas: [
      { nombre: "Puerto Montt", ciudad: "Puerto Montt" },
      { nombre: "Calbuco", ciudad: "Calbuco" },
      { nombre: "Cochamó", ciudad: "Cochamó" },
      { nombre: "Fresia", ciudad: "Fresia" },
      { nombre: "Frutillar", ciudad: "Frutillar" },
      { nombre: "Los Muermos", ciudad: "Los Muermos" },
      { nombre: "Llanquihue", ciudad: "Llanquihue" },
      { nombre: "Maullín", ciudad: "Maullín" },
      { nombre: "Puerto Varas", ciudad: "Puerto Varas" },
      { nombre: "Castro", ciudad: "Castro" },
      { nombre: "Ancud", ciudad: "Ancud" },
      { nombre: "Chonchi", ciudad: "Chonchi" },
      { nombre: "Curaco de Vélez", ciudad: "Curaco de Vélez" },
      { nombre: "Dalcahue", ciudad: "Dalcahue" },
      { nombre: "Puqueldón", ciudad: "Puqueldón" },
      { nombre: "Queilén", ciudad: "Queilén" },
      { nombre: "Quellón", ciudad: "Quellón" },
      { nombre: "Quemchi", ciudad: "Quemchi" },
      { nombre: "Quinchao", ciudad: "Quinchao" },
      { nombre: "Osorno", ciudad: "Osorno" },
      { nombre: "Puerto Octay", ciudad: "Puerto Octay" },
      { nombre: "Purranque", ciudad: "Purranque" },
      { nombre: "Puyehue", ciudad: "Puyehue" },
      { nombre: "Río Negro", ciudad: "Río Negro" },
      { nombre: "San Juan de la Costa", ciudad: "San Juan de la Costa" },
      { nombre: "San Pablo", ciudad: "San Pablo" },
      { nombre: "Chaitén", ciudad: "Chaitén" },
      { nombre: "Futaleufú", ciudad: "Futaleufú" },
      { nombre: "Hualaihué", ciudad: "Hualaihué" },
      { nombre: "Palena", ciudad: "Palena" }
    ]
  },
  {
    region: "Región de Aysén del General Carlos Ibáñez del Campo",
    comunas: [
      { nombre: "Coyhaique", ciudad: "Coyhaique" },
      { nombre: "Lago Verde", ciudad: "Lago Verde" },
      { nombre: "Aysén", ciudad: "Aysén" },
      { nombre: "Cisnes", ciudad: "Cisnes" },
      { nombre: "Guaitecas", ciudad: "Guaitecas" },
      { nombre: "Cochrane", ciudad: "Cochrane" },
      { nombre: "O'Higgins", ciudad: "O'Higgins" },
      { nombre: "Tortel", ciudad: "Tortel" },
      { nombre: "Chile Chico", ciudad: "Chile Chico" },
      { nombre: "Río Ibáñez", ciudad: "Río Ibáñez" }
    ]
  },
  {
    region: "Región de Magallanes y de la Antártica Chilena",
    comunas: [
      { nombre: "Punta Arenas", ciudad: "Punta Arenas" },
      { nombre: "Laguna Blanca", ciudad: "Laguna Blanca" },
      { nombre: "Río Verde", ciudad: "Río Verde" },
      { nombre: "San Gregorio", ciudad: "San Gregorio" },
      { nombre: "Cabo de Hornos", ciudad: "Cabo de Hornos" },
      { nombre: "Antártica", ciudad: "Antártica" },
      { nombre: "Porvenir", ciudad: "Porvenir" },
      { nombre: "Primavera", ciudad: "Primavera" },
      { nombre: "Timaukel", ciudad: "Timaukel" },
      { nombre: "Natales", ciudad: "Natales" },
      { nombre: "Torres del Paine", ciudad: "Torres del Paine" }
    ]
  }
];

function registrarUsuario() {
  // Obtener valores de los campos
  const nombre = document.getElementById('form3Examplev2').value.trim();
  const apellido = document.getElementById('form3Examplev3').value.trim();
  const correo = document.getElementById('form3Examplev4').value.trim();
  const confirmarCorreo = document.querySelectorAll('#form3Examplev4')[1].value.trim();
  const contrasena = document.getElementById('form3Examplev5').value.trim();
  const confirmarContrasena = document.querySelectorAll('#form3Examplev5')[1].value.trim();

  // Validaciones básicas
  if (!nombre || !apellido || !correo || !confirmarCorreo || !contrasena || !confirmarContrasena) {
    alert("Por favor, complete todos los campos.");
    return;
  }
  if (correo !== confirmarCorreo) {
    alert("Los correos no coinciden.");
    return;
  }
  if (contrasena !== confirmarContrasena) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  // Validar si el correo ya está registrado
  const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
  if (usuariosRegistrados.some(u => u.correo === correo)) {
    alert("El correo ya está registrado.");
    return;
  }

  // Registrar usuario
  const usuario = {
    nombre,
    apellido,
    correo,
    contrasena,
    rol: "Usuario"
  };
  usuariosRegistrados.push(usuario);
  localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));

  alert("Usuario registrado correctamente");
  window.location.href = "Loggin.html"; 
}

window.addEventListener('DOMContentLoaded', function () {
  const regionSelect = document.getElementById('regionSelect');
  const comunaSelect = document.getElementById('comunaSelect');
  const ciudadSelect = document.getElementById('ciudadSelect');

  // Llenar el select de regiones
  regionesYComunas.forEach((regionObj) => {
    const option = document.createElement('option');
    option.value = regionObj.region;
    option.textContent = regionObj.region;
    regionSelect.appendChild(option);
  });

  regionSelect.addEventListener('change', function () {
    // Limpiar comunas y ciudad
    comunaSelect.innerHTML = '<option value="">Seleccione Comuna</option>';
    ciudadSelect.innerHTML = '<option value="">Seleccione Ciudad</option>';
    const region = regionesYComunas.find(r => r.region === this.value);
    if (region) {
      region.comunas.forEach(comunaObj => {
        const option = document.createElement('option');
        option.value = comunaObj.nombre;
        option.textContent = comunaObj.nombre;
        option.dataset.ciudad = comunaObj.ciudad;
        comunaSelect.appendChild(option);
      });
    }
  });

  comunaSelect.addEventListener('change', function () {
    ciudadSelect.innerHTML = '<option value="">Seleccione Ciudad</option>';
    const selectedRegion = regionesYComunas.find(r => r.region === regionSelect.value);
    if (selectedRegion) {
      const comunaObj = selectedRegion.comunas.find(c => c.nombre === this.value);
      if (comunaObj) {
        const option = document.createElement('option');
        option.value = comunaObj.ciudad;
        option.textContent = comunaObj.ciudad;
        ciudadSelect.appendChild(option);
      }
    }
  });

  // Vincular el botón de registrar
  const btnRegistrar = document.querySelector('button.btn-light');
  if (btnRegistrar) {
    btnRegistrar.addEventListener('click', registrarUsuario);
  }
});