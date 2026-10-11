/* =========================================
   Configuración de cada módulo
   ========================================= */
const REGISTROS_POR_PAGINA = 15;

const modulos = {
  empleados: {
    titulo: "Empleados",
    singular: "empleado",
    campos: [
      { clave: "nombre", etiqueta: "Nombre", tipo: "text" },
      { clave: "documento", etiqueta: "Documento", tipo: "text" },
      { clave: "correo", etiqueta: "Correo", tipo: "email" },
      { clave: "telefono", etiqueta: "Teléfono", tipo: "text" },
      {
        clave: "cargo",
        etiqueta: "Cargo",
        tipo: "select",
        opciones: ["Entrenador", "Nutricionista", "Recepcionista", "Administrador", "Fisioterapeuta"],
      },
      { clave: "estado", etiqueta: "Estado", tipo: "select", opciones: ["Activo", "Inactivo"] },
    ],
    datos: [],
  },
  clientes: {
    titulo: "Clientes",
    singular: "cliente",
    campos: [
      { clave: "nombre", etiqueta: "Nombre", tipo: "text" },
      { clave: "documento", etiqueta: "Documento", tipo: "text" },
      { clave: "correo", etiqueta: "Correo", tipo: "email" },
      { clave: "telefono", etiqueta: "Teléfono", tipo: "text" },
      { clave: "plan", etiqueta: "Plan", tipo: "select", opciones: ["Gratis", "Premiun"] },
      { clave: "estado", etiqueta: "Estado", tipo: "select", opciones: ["Activo", "Inactivo"] },
    ],
    datos: [],
  },
  sedes: {
    titulo: "Sedes",
    singular: "Sede",
    campos: [
      { clave: "nombre", etiqueta: "Nombre", tipo: "text" },
      { clave: "Ubicacion", etiqueta: "Ubicacion", tipo: "text" },
      { clave: "correo", etiqueta: "Correo", tipo: "email" },
      { clave: "telefono", etiqueta: "Teléfono", tipo: "text" },
      { clave: "estado", etiqueta: "Estado", tipo: "select", opciones: ["Activo", "Inactivo"] },
    ],
    datos: [
      { id: 1, nombre: "Sede Centro", ciudad: "Medellín", direccion: "Cra 50 #45-10", telefono: "3001234567", capacidad: "120", estado: "Activo" },
      { id: 2, nombre: "Sede Sur", ciudad: "Caldas", direccion: "Cll 130 Sur #50-20", telefono: "3019901911", capacidad: "80", estado: "Activo" },
      { id: 3, nombre: "Sede Norte", ciudad: "Bello", direccion: "Av 33 #52-15", telefono: "3105558899", capacidad: "100", estado: "Inactivo" },],
  },

};

/* =========================================
   Datos de ejemplo (reemplázalos por tu backend)
   ========================================= */
const nombres = ["Daniel", "Sara", "Brayan", "Mariana", "Camilo", "Laura", "Andrés", "Valentina", "Juan", "Paula", "Santiago", "Natalia"];
const apellidos = ["Martínez", "Ramírez", "Rojas", "Duque", "Gómez", "López", "Castaño", "Zapata", "Osorio", "Mejía"];

function generarDatos(modulo, cantidad) {
  const config = modulos[modulo];
  for (let i = 1; i <= cantidad; i++) {
    const nombre = nombres[i % nombres.length] + " " + apellidos[(i * 3) % apellidos.length];
    const registro = {
      id: i,
      nombre: nombre,
      documento: String(1000000000 + i * 7919),
      correo: nombre.toLowerCase().replace(/[^a-z]/g, ".").replace(/\.+/g, ".") + i + "@gmail.com",
      telefono: "300" + String(1000000 + i * 4321).slice(0, 7),
      estado: i % 5 === 0 ? "Inactivo" : "Activo",
    };
    config.campos.forEach((c) => {
      if (c.clave === "cargo" || c.clave === "plan") {
        registro[c.clave] = c.opciones[i % c.opciones.length];
      }
    });
    config.datos.push(registro);
  }
}

generarDatos("empleados", 38);
generarDatos("clientes", 32);

/* =========================================
   Estado de la aplicación
   ========================================= */
let moduloActual = "empleados";
let paginaActual = 1;
let textoBusqueda = "";
let idEditando = null; // null = modo agregar
let idPorEliminar = null;

/* =========================================
   Referencias al DOM
   ========================================= */
const barraLateral = document.getElementById("barra-lateral");
const btnToggle = document.getElementById("btn-toggle");
const itemsLaterales = document.querySelectorAll("[data-modulo]");

const tituloModulo = document.getElementById("titulo-modulo");
const inputBuscar = document.getElementById("buscar");
const btnAgregar = document.getElementById("btn-agregar");
const tablaHead = document.getElementById("tabla-head");
const tablaBody = document.getElementById("tabla-body");
const infoRegistros = document.getElementById("info-registros");
const paginacion = document.getElementById("paginacion");

const modalForm = document.getElementById("modal-form");
const tituloForm = document.getElementById("titulo-form");
const formulario = document.getElementById("formulario");
const camposForm = document.getElementById("campos-form");
const errorForm = document.getElementById("error-form");

const modalEliminar = document.getElementById("modal-eliminar");
const textoEliminar = document.getElementById("texto-eliminar");

/* =========================================
   Utilidades
   ========================================= */
function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function abrirModal(modal) {
  modal.classList.add("activo");
  modal.setAttribute("aria-hidden", "false");
}

function cerrarModal(modal) {
  modal.classList.remove("activo");
  modal.setAttribute("aria-hidden", "true");
}

function obtenerFiltrados() {
  const datos = modulos[moduloActual].datos;
  const texto = textoBusqueda.trim().toLowerCase();
  if (!texto) return datos;
  return datos.filter((registro) =>
    Object.keys(registro).some((clave) => clave !== "id" && String(registro[clave]).toLowerCase().includes(texto))
  );
}

/* =========================================
   Render de la tabla
   ========================================= */
function renderTabla() {
  const config = modulos[moduloActual];
  const filtrados = obtenerFiltrados();
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / REGISTROS_POR_PAGINA));

  if (paginaActual > totalPaginas) paginaActual = totalPaginas;

  const inicio = (paginaActual - 1) * REGISTROS_POR_PAGINA;
  const pagina = filtrados.slice(inicio, inicio + REGISTROS_POR_PAGINA);

  // Encabezado
  tablaHead.innerHTML =
    "<tr><th>#</th>" +
    config.campos.map((c) => `<th>${c.etiqueta}</th>`).join("") +
    "<th>Acciones</th></tr>";

  // Cuerpo
  if (pagina.length === 0) {
    tablaBody.innerHTML = `<tr><td class="sin-resultados" colspan="${config.campos.length + 2}">No se encontraron registros.</td></tr>`;
  } else {
    tablaBody.innerHTML = pagina
      .map((registro, i) => {
        const celdas = config.campos
          .map((c) => {
            const valor = escapar(registro[c.clave] ?? "");
            if (c.clave === "estado") {
              return `<td><span class="etiqueta-estado ${valor.toLowerCase()}">${valor}</span></td>`;
            }
            return `<td>${valor}</td>`;
          })
          .join("");
        return `<tr>
          <td>${inicio + i + 1}</td>
          ${celdas}
          <td>
            <div class="acciones">
              <button type="button" class="btn-icono btn-editar" data-id="${registro.id}" aria-label="Editar"><i class="fa-solid fa-pen"></i></button>
              <button type="button" class="btn-icono btn-eliminar" data-id="${registro.id}" aria-label="Eliminar"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>`;
      })
      .join("");
  }

  // Info
  const desde = filtrados.length === 0 ? 0 : inicio + 1;
  const hasta = inicio + pagina.length;
  infoRegistros.textContent = `Mostrando ${desde}-${hasta} de ${filtrados.length} registros`;

  renderPaginacion(totalPaginas);
}

function renderPaginacion(totalPaginas) {
  let html = `<button type="button" class="btn-pagina" data-pagina="${paginaActual - 1}" ${paginaActual === 1 ? "disabled" : ""} aria-label="Anterior"><i class="fa-solid fa-chevron-left"></i></button>`;

  for (let p = 1; p <= totalPaginas; p++) {
    html += `<button type="button" class="btn-pagina ${p === paginaActual ? "activo" : ""}" data-pagina="${p}">${p}</button>`;
  }

  html += `<button type="button" class="btn-pagina" data-pagina="${paginaActual + 1}" ${paginaActual === totalPaginas ? "disabled" : ""} aria-label="Siguiente"><i class="fa-solid fa-chevron-right"></i></button>`;
  paginacion.innerHTML = html;
}

/* =========================================
   Cambio de módulo (barra lateral)
   ========================================= */
function cambiarModulo(nombre) {
  moduloActual = nombre;
  paginaActual = 1;
  textoBusqueda = "";
  inputBuscar.value = "";
  tituloModulo.textContent = modulos[nombre].titulo;

  itemsLaterales.forEach((item) => item.classList.toggle("activo", item.dataset.modulo === nombre));
  renderTabla();
}

btnToggle.addEventListener("click", () => {
  barraLateral.classList.toggle("expandida");
});

itemsLaterales.forEach((item) => {
  item.addEventListener("click", () => {
    // Si está contraída, el clic en un icono la despliega
    barraLateral.classList.add("expandida");
    cambiarModulo(item.dataset.modulo);
  });
});

/* =========================================
   Búsqueda y paginación
   ========================================= */
inputBuscar.addEventListener("input", () => {
  textoBusqueda = inputBuscar.value;
  paginaActual = 1;
  renderTabla();
});

paginacion.addEventListener("click", (e) => {
  const boton = e.target.closest(".btn-pagina");
  if (!boton || boton.disabled) return;
  paginaActual = Number(boton.dataset.pagina);
  renderTabla();
});

/* =========================================
   Agregar / Editar
   ========================================= */
function construirFormulario(registro) {
  const config = modulos[moduloActual];
  camposForm.innerHTML = config.campos
    .map((c) => {
      const valor = registro ? registro[c.clave] : "";
      let control;
      if (c.tipo === "select") {
        control =
          `<select id="campo-${c.clave}" name="${c.clave}">` +
          c.opciones
            .map((o) => `<option value="${o}" ${o === valor ? "selected" : ""}>${o}</option>`)
            .join("") +
          "</select>";
      } else {
        control = `<input type="${c.tipo}" id="campo-${c.clave}" name="${c.clave}" value="${escapar(valor || "")}">`;
      }
      return `<div class="grupo-campo"><label for="campo-${c.clave}">${c.etiqueta}</label>${control}</div>`;
    })
    .join("");
  errorForm.textContent = "";
}

btnAgregar.addEventListener("click", () => {
  idEditando = null;
  tituloForm.textContent = "Agregar " + modulos[moduloActual].singular;
  construirFormulario(null);
  abrirModal(modalForm);
});

tablaBody.addEventListener("click", (e) => {
  const btnEditar = e.target.closest(".btn-editar");
  const btnEliminar = e.target.closest(".btn-eliminar");
  const datos = modulos[moduloActual].datos;

  if (btnEditar) {
    const registro = datos.find((r) => r.id === Number(btnEditar.dataset.id));
    if (!registro) return;
    idEditando = registro.id;
    tituloForm.textContent = "Editar " + modulos[moduloActual].singular;
    construirFormulario(registro);
    abrirModal(modalForm);
  }

  if (btnEliminar) {
    const registro = datos.find((r) => r.id === Number(btnEliminar.dataset.id));
    if (!registro) return;
    idPorEliminar = registro.id;
    textoEliminar.textContent = `Se eliminará a "${registro.nombre}". Esta acción no se puede deshacer.`;
    abrirModal(modalEliminar);
  }
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const config = modulos[moduloActual];
  const nuevo = {};

  config.campos.forEach((c) => {
    nuevo[c.clave] = document.getElementById("campo-" + c.clave).value.trim();
  });

  // Validaciones
  const vacio = config.campos.find((c) => !nuevo[c.clave]);
  if (vacio) {
    errorForm.textContent = `El campo "${vacio.etiqueta}" es obligatorio.`;
    return;
  }
  if (nuevo.correo !== undefined && !/^\S+@\S+\.\S+$/.test(nuevo.correo)) {
    errorForm.textContent = "Ingresa un correo válido.";
    return;
  }

  if (idEditando === null) {
    const siguienteId = config.datos.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    config.datos.push({ id: siguienteId, ...nuevo });
    // Ir a la última página para ver el nuevo registro
    textoBusqueda = "";
    inputBuscar.value = "";
    paginaActual = Math.ceil(config.datos.length / REGISTROS_POR_PAGINA);
  } else {
    const indice = config.datos.findIndex((r) => r.id === idEditando);
    config.datos[indice] = { id: idEditando, ...nuevo };
  }

  cerrarModal(modalForm);
  renderTabla();
});

document.getElementById("cerrar-form").addEventListener("click", () => cerrarModal(modalForm));
document.getElementById("cancelar-form").addEventListener("click", () => cerrarModal(modalForm));

/* =========================================
   Eliminar (con confirmación)
   ========================================= */
document.getElementById("confirmar-eliminar").addEventListener("click", () => {
  const config = modulos[moduloActual];
  config.datos = config.datos.filter((r) => r.id !== idPorEliminar);
  idPorEliminar = null;
  cerrarModal(modalEliminar);
  renderTabla();
});

document.getElementById("cerrar-eliminar").addEventListener("click", () => cerrarModal(modalEliminar));
document.getElementById("cancelar-eliminar").addEventListener("click", () => cerrarModal(modalEliminar));

/* =========================================
   Cerrar modales al hacer clic fuera / con Escape
   ========================================= */
[modalForm, modalEliminar].forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal(modal);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrarModal(modalForm);
    cerrarModal(modalEliminar);
  }
});

/* =========================================
   Inicio
   ========================================= */
cambiarModulo("empleados");
