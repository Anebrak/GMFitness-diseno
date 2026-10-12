/* =========================================
   Utilidades de fecha
   ========================================= */
function fechaISO(fecha) {
  return (
    fecha.getFullYear() +
    "-" +
    String(fecha.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(fecha.getDate()).padStart(2, "0")
  );
}

function hoyISO() {
  return fechaISO(new Date());
}

function formatearFecha(iso) {
  if (!iso) return "-";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

/* =========================================
   Estado
   ========================================= */
let tablaActiva = null; // "mediciones" | "objetivos"
let idPorEliminar = null;

const membresia = {
  plan: "Gratis",
  inicio: null,
  fin: null,
};
const DURACION_PREMIUN = 30; // días

/* =========================================
   Referencias al DOM
   ========================================= */
const barraLateral = document.getElementById("barra-lateral");
const btnToggle = document.getElementById("btn-toggle");
const itemsLaterales = document.querySelectorAll("[data-vista]");
const vistas = document.querySelectorAll(".vista");

const modalEliminar = document.getElementById("modal-eliminar");
const textoEliminar = document.getElementById("texto-eliminar");
const modalPremiun = document.getElementById("modal-premiun");

/* =========================================
   Utilidades generales
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
  if (modal === modalMedida) renderMediciones();
}

/* =========================================
   Barra lateral y cambio de vista
   ========================================= */
function mostrarVista(nombre) {
  vistas.forEach((v) => v.classList.toggle("activo", v.id === "vista-" + nombre));
  itemsLaterales.forEach((i) => i.classList.toggle("activo", i.dataset.vista === nombre));

  if (nombre === "mensajes") {
    const chatBox = document.getElementById("chat-mensajes");
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

btnToggle.addEventListener("click", () => {
  barraLateral.classList.toggle("expandida");
});

itemsLaterales.forEach((item) => {
  item.addEventListener("click", () => {
    // Si está contraída, el clic en un icono la despliega
    barraLateral.classList.add("expandida");
    mostrarVista(item.dataset.vista);
    if (item.dataset.vista === "objetivos") iniciarObjetivos();
  });
});

/* =========================================
   Mediciones (personaje)
   ========================================= */
const partes = {
  cuello: { nombre: "Cuello", min: 20, max: 80 },
  hombros: { nombre: "Hombros", min: 60, max: 200 },
  pecho: { nombre: "Pecho", min: 50, max: 200 },
  brazo: { nombre: "Brazo", min: 15, max: 80 },
  cintura: { nombre: "Cintura", min: 40, max: 200 },
  cadera: { nombre: "Cadera", min: 50, max: 200 },
  muslo: { nombre: "Muslo", min: 25, max: 120 },
  pantorrilla: { nombre: "Pantorrilla", min: 15, max: 80 },
};

// Medidas por parte: [{ id, fecha, valor }]  (valor en cm)
const medidas = {
  cuello: [
    { id: 1, fecha: "2026-05-02", valor: 38 },
    { id: 2, fecha: "2026-10-01", valor: 37 },
  ],
  hombros: [],
  pecho: [
    { id: 1, fecha: "2026-05-02", valor: 102 },
    { id: 2, fecha: "2026-10-01", valor: 99 },
  ],
  brazo: [
    { id: 1, fecha: "2026-05-02", valor: 33 },
    { id: 2, fecha: "2026-10-01", valor: 35 },
  ],
  cintura: [
    { id: 1, fecha: "2026-05-02", valor: 92 },
    { id: 2, fecha: "2026-07-01", valor: 88 },
    { id: 3, fecha: "2026-10-01", valor: 82 },
  ],
  cadera: [
    { id: 1, fecha: "2026-05-02", valor: 100 },
    { id: 2, fecha: "2026-10-01", valor: 95 },
  ],
  muslo: [
    { id: 1, fecha: "2026-05-02", valor: 59 },
    { id: 2, fecha: "2026-10-01", valor: 56.5 },
  ],
  pantorrilla: [],
};

let parteActual = null;
let medidaEditando = null;

const modalMedida = document.getElementById("modal-medida");
const formMedida = document.getElementById("form-medida");
const errorMedida = document.getElementById("error-medida");

function ordenarMedidas(parte) {
  return [...medidas[parte]].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.id - b.id);
}

/* ---------- Tabla de la derecha + marcas en el personaje ---------- */
function renderMediciones() {
  const abierta = modalMedida.classList.contains("activo") ? parteActual : null;

  document.getElementById("body-partes").innerHTML = Object.keys(partes)
    .map((clave) => {
      const lista = ordenarMedidas(clave);
      const primera = lista.length ? lista[0].valor + " cm" : '<span class="sin-medida">Sin medir</span>';
      const actual = lista.length ? lista[lista.length - 1].valor + " cm" : '<span class="sin-medida">Sin medir</span>';
      return `<tr data-parte="${clave}" class="${clave === abierta ? "seleccionada" : ""}">
        <td>${partes[clave].nombre}</td><td>${primera}</td><td>${actual}</td>
      </tr>`;
    })
    .join("");

  document.querySelectorAll("#personaje .parte").forEach((el) => {
    const p = el.dataset.parte;
    el.classList.toggle("medida", medidas[p].length > 0);
    el.classList.toggle("seleccionada", p === abierta);
  });
}

/* ---------- Historial dentro del modal ---------- */
function renderHistorialMedida() {
  const lista = ordenarMedidas(parteActual).reverse();
  document.getElementById("body-historial-medida").innerHTML = lista.length
    ? lista
        .map(
          (m) => `<tr>
        <td>${formatearFecha(m.fecha)}</td>
        <td>${m.valor} cm</td>
        <td>
          <div class="acciones">
            <button type="button" class="btn-icono btn-editar" data-id="${m.id}" aria-label="Editar"><i class="fa-solid fa-pen"></i></button>
            <button type="button" class="btn-icono btn-eliminar" data-id="${m.id}" aria-label="Eliminar"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`
        )
        .join("")
    : '<tr><td class="sin-resultados" colspan="3">Aún no hay medidas de esta parte.</td></tr>';
}

/* ---------- Abrir el modal al elegir una parte ---------- */
function abrirMedida(parte) {
  parteActual = parte;
  medidaEditando = null;

  const fecha = document.getElementById("medida-fecha");
  fecha.value = hoyISO();
  fecha.max = hoyISO();
  document.getElementById("medida-valor").value = "";
  document.getElementById("titulo-medida").textContent = "Medir " + partes[parte].nombre.toLowerCase();
  errorMedida.textContent = "";

  renderHistorialMedida();
  abrirModal(modalMedida);
  renderMediciones();
}

document.getElementById("personaje").addEventListener("click", (e) => {
  const el = e.target.closest(".parte");
  if (el) abrirMedida(el.dataset.parte);
});

document.getElementById("body-partes").addEventListener("click", (e) => {
  const fila = e.target.closest("tr[data-parte]");
  if (fila) abrirMedida(fila.dataset.parte);
});

/* ---------- Editar / eliminar desde el historial ---------- */
document.getElementById("body-historial-medida").addEventListener("click", (e) => {
  const btnEditar = e.target.closest(".btn-editar");
  const btnEliminar = e.target.closest(".btn-eliminar");
  if (!btnEditar && !btnEliminar) return;

  const id = Number((btnEditar || btnEliminar).dataset.id);
  const medida = medidas[parteActual].find((m) => m.id === id);
  if (!medida) return;

  if (btnEditar) {
    medidaEditando = medida.id;
    document.getElementById("titulo-medida").textContent = "Modificar " + partes[parteActual].nombre.toLowerCase();
    document.getElementById("medida-fecha").value = medida.fecha;
    document.getElementById("medida-valor").value = medida.valor;
    errorMedida.textContent = "";
  } else {
    tablaActiva = "mediciones";
    idPorEliminar = medida.id;
    textoEliminar.textContent = `Se eliminará la medida de ${partes[parteActual].nombre.toLowerCase()} del ${formatearFecha(medida.fecha)}. Esta acción no se puede deshacer.`;
    abrirModal(modalEliminar);
  }
});

/* ---------- Guardar ---------- */
formMedida.addEventListener("submit", (e) => {
  e.preventDefault();
  const parte = partes[parteActual];
  const fecha = document.getElementById("medida-fecha").value;
  const valor = Number(document.getElementById("medida-valor").value);

  if (!fecha) {
    errorMedida.textContent = "La fecha es obligatoria.";
    return;
  }
  if (fecha > hoyISO()) {
    errorMedida.textContent = "La fecha no puede ser futura.";
    return;
  }
  if (Number.isNaN(valor) || valor < parte.min || valor > parte.max) {
    errorMedida.textContent = `La medida debe estar entre ${parte.min} y ${parte.max} cm.`;
    return;
  }

  const lista = medidas[parteActual];
  if (medidaEditando === null) {
    const siguienteId = lista.reduce((max, m) => Math.max(max, m.id), 0) + 1;
    lista.push({ id: siguienteId, fecha: fecha, valor: valor });
  } else {
    const medida = lista.find((m) => m.id === medidaEditando);
    medida.fecha = fecha;
    medida.valor = valor;
  }

  cerrarModal(modalMedida);
});

document.getElementById("cerrar-medida").addEventListener("click", () => cerrarModal(modalMedida));
document.getElementById("cancelar-medida").addEventListener("click", () => cerrarModal(modalMedida));

/* ---------- Confirmar eliminación (mediciones y objetivo) ---------- */
document.getElementById("confirmar-eliminar").addEventListener("click", () => {
  if (tablaActiva === "objetivos") {
    objetivo = null;
    pesos = [];
    guardarObjetivos();
    cerrarModal(modalEliminar);
    renderObjetivos();
    return;
  }

  if (tablaActiva === "mediciones") {
    medidas[parteActual] = medidas[parteActual].filter((m) => m.id !== idPorEliminar);
    idPorEliminar = null;
    cerrarModal(modalEliminar);
    renderMediciones();
    renderHistorialMedida();
  }
});

document.getElementById("cerrar-eliminar").addEventListener("click", () => cerrarModal(modalEliminar));
document.getElementById("cancelar-eliminar").addEventListener("click", () => cerrarModal(modalEliminar));

/* =========================================
   Membresía
   ========================================= */
function renderMembresia() {
  const plan = document.getElementById("mem-plan");
  const precio = document.getElementById("mem-precio");
  const inicio = document.getElementById("mem-inicio");
  const fin = document.getElementById("mem-fin");
  const restante = document.getElementById("mem-restante");
  const barra = document.getElementById("mem-barra");
  const boton = document.getElementById("btn-premiun");

  plan.textContent = membresia.plan;

  if (membresia.plan === "Premiun") {
    const hoy = new Date(hoyISO() + "T00:00:00");
    const vence = new Date(membresia.fin + "T00:00:00");
    const dias = Math.max(0, Math.round((vence - hoy) / 86400000));

    precio.textContent = "$89.000 / al mes";
    inicio.textContent = formatearFecha(membresia.inicio);
    fin.textContent = formatearFecha(membresia.fin);
    restante.textContent = dias === 1 ? "1 día" : dias + " días";
    barra.style.width = Math.min(100, (dias / DURACION_PREMIUN) * 100) + "%";
    boton.style.display = "none";
  } else {
    precio.textContent = "$0 / siempre";
    inicio.textContent = "-";
    fin.textContent = "Sin vencimiento";
    restante.textContent = "Ilimitado";
    barra.style.width = "100%";
    boton.style.display = "";
  }
}

document.getElementById("btn-premiun").addEventListener("click", () => abrirModal(modalPremiun));
document.getElementById("cerrar-premiun").addEventListener("click", () => cerrarModal(modalPremiun));
document.getElementById("cancelar-premiun").addEventListener("click", () => cerrarModal(modalPremiun));

document.getElementById("confirmar-premiun").addEventListener("click", () => {
  const vence = new Date();
  vence.setDate(vence.getDate() + DURACION_PREMIUN);
  membresia.plan = "Premiun";
  membresia.inicio = hoyISO();
  membresia.fin = fechaISO(vence);
  cerrarModal(modalPremiun);
  renderMembresia();
});

/* =========================================
   Mensajes (chat estilo WhatsApp)
   ========================================= */
const chats = {
  entrenador: {
    nombre: "Carlos Restrepo",
    rol: "Entrenador",
    iniciales: "CR",
    mensajes: [
      { de: "profesional", texto: "¡Hola Daniel! ¿Cómo te fue con la rutina de esta semana?", hora: "08:15" },
      { de: "cliente", texto: "Muy bien, subí peso en press de banca 💪", hora: "08:20" },
      { de: "profesional", texto: "Excelente. La próxima semana subimos un poco el volumen de piernas.", hora: "08:22" },
    ],
  },
  nutricionista: {
    nombre: "Laura Henao",
    rol: "Nutricionista",
    iniciales: "LH",
    mensajes: [
      { de: "profesional", texto: "Daniel, revisé tu registro de comidas. Vas muy bien con las proteínas.", hora: "10:05" },
      { de: "cliente", texto: "Gracias. ¿Puedo cambiar el arroz del almuerzo por quinoa?", hora: "10:12" },
    ],
  },
  fisioterapeuta: {
    nombre: "Mateo Ríos",
    rol: "Fisioterapeuta",
    iniciales: "MR",
    mensajes: [
      { de: "profesional", texto: "¿Cómo sigue la molestia en el hombro?", hora: "Ayer" },
    ],
  },
};

let chatActivo = null;

const listaContactos = document.getElementById("lista-contactos");
const chatMensajes = document.getElementById("chat-mensajes");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

function ultimoMensaje(clave) {
  const lista = chats[clave].mensajes;
  if (lista.length === 0) return "";
  const m = lista[lista.length - 1];
  return (m.de === "cliente" ? "Tú: " : "") + m.texto;
}

function renderContactos() {
  listaContactos.innerHTML = Object.keys(chats)
    .map((clave) => {
      const c = chats[clave];
      return `<button type="button" class="contacto ${clave === chatActivo ? "activo" : ""}" data-chat="${clave}">
        <div class="avatar-chat">${c.iniciales}</div>
        <div class="contacto-info">
          <h3>${c.nombre}</h3>
          <small>${c.rol}</small>
          <p>${escapar(ultimoMensaje(clave))}</p>
        </div>
      </button>`;
    })
    .join("");
}

function renderMensajes() {
  chatMensajes.innerHTML = "";
  chats[chatActivo].mensajes.forEach((m) => {
    const burbuja = document.createElement("div");
    burbuja.className = "burbuja " + (m.de === "cliente" ? "enviado" : "recibido");

    const texto = document.createElement("span");
    texto.textContent = m.texto;

    const hora = document.createElement("span");
    hora.className = "hora";
    hora.textContent = m.hora;

    burbuja.appendChild(texto);
    burbuja.appendChild(hora);
    chatMensajes.appendChild(burbuja);
  });
  chatMensajes.scrollTop = chatMensajes.scrollHeight;
}

function abrirChat(clave) {
  chatActivo = clave;
  const c = chats[clave];
  document.getElementById("chat-avatar").textContent = c.iniciales;
  document.getElementById("chat-nombre").textContent = c.nombre;
  document.getElementById("chat-rol").textContent = c.rol;
  renderContactos();
  renderMensajes();
}

listaContactos.addEventListener("click", (e) => {
  const boton = e.target.closest(".contacto");
  if (!boton) return;
  abrirChat(boton.dataset.chat);
  chatInput.focus();
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = chatInput.value.trim();
  if (!texto) return;

  const hora = new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false });
  chats[chatActivo].mensajes.push({ de: "cliente", texto: texto, hora: hora });
  chatInput.value = "";
  renderMensajes();
  renderContactos();
});

/* =========================================
   Objetivos (gráfica de peso)
   ========================================= */
let objetivo = null; // { altura, pesoObjetivo, grasaObjetivo }
let pesos = []; // [{ id, fecha, peso }]
let grafica = null;

const modalObjetivo = document.getElementById("modal-objetivo");
const formObjetivo = document.getElementById("form-objetivo");
const errorObjetivo = document.getElementById("error-objetivo");
const modalPeso = document.getElementById("modal-peso");
const formPeso = document.getElementById("form-peso");
const errorPeso = document.getElementById("error-peso");

/* ---------- Guardado (localStorage; cámbialo por tu API) ---------- */
function guardarObjetivos() {
  try {
    localStorage.setItem("gm_objetivos", JSON.stringify({ objetivo, pesos }));
  } catch (e) {}
}

function cargarObjetivos() {
  try {
    const g = JSON.parse(localStorage.getItem("gm_objetivos"));
    if (g && g.objetivo && g.pesos && g.pesos.length) {
      objetivo = g.objetivo;
      pesos = g.pesos;
    }
  } catch (e) {}
}

/* ---------- % graso aproximado a partir de peso y altura ----------
   Usa el IMC (fórmula de Deurenberg) con edad 30 y promedio hombre/mujer,
   por eso es solo una aproximación. */
function estimarGrasa(peso, alturaCm) {
  const m = alturaCm / 100;
  const imc = peso / (m * m);
  const grasa = 1.2 * imc - 3.9;
  return Math.round(Math.min(60, Math.max(3, grasa)) * 10) / 10;
}

/* ---------- Render ---------- */
function renderObjetivos() {
  const hay = objetivo !== null;
  document.getElementById("objetivos-vacio").classList.toggle("oculto", hay);
  document.getElementById("objetivos-contenido").classList.toggle("oculto", !hay);
  document.getElementById("acciones-objetivo").classList.toggle("oculto", !hay);

  if (!hay) {
    if (grafica) {
      grafica.destroy();
      grafica = null;
    }
    return;
  }

  const asc = [...pesos].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.id - b.id);
  const inicial = asc[0].peso;
  const actual = asc[asc.length - 1].peso;

  document.getElementById("res-inicial").textContent = inicial + " kg";
  document.getElementById("res-actual").textContent = actual + " kg";
  document.getElementById("res-meta").textContent = objetivo.pesoObjetivo + " kg";
  document.getElementById("res-grasa-actual").textContent = "~" + estimarGrasa(actual, objetivo.altura) + " %";
  document.getElementById("res-grasa-meta").textContent = objetivo.grasaObjetivo + " %";

  // Tabla: últimos 5 registros
  document.getElementById("body-pesos").innerHTML = [...asc]
    .reverse()
    .slice(0, 5)
    .map((p) => `<tr><td>${formatearFecha(p.fecha)}</td><td>${p.peso} kg</td></tr>`)
    .join("");

  // Gráfica: empieza en el peso inicial y termina en el peso objetivo
  const etiquetas = asc.map((p) => formatearFecha(p.fecha)).concat("Meta");
  const datosPeso = asc.map((p) => p.peso).concat(null);
  const datosMeta = asc.map((p, i) => (i === asc.length - 1 ? p.peso : null)).concat(objetivo.pesoObjetivo);

  const todos = asc.map((p) => p.peso).concat(objetivo.pesoObjetivo);
  const min = Math.floor(Math.min(...todos)) - 1;
  const max = Math.ceil(Math.max(...todos)) + 1;

  if (grafica) grafica.destroy();
  grafica = new Chart(document.getElementById("grafica-peso"), {
    type: "line",
    data: {
      labels: etiquetas,
      datasets: [
        {
          label: "Peso (kg)",
          data: datosPeso,
          borderColor: "#fe6c05",
          backgroundColor: "rgba(254, 108, 5, 0.15)",
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: "#fe6c05",
        },
        {
          label: "Camino a la meta",
          data: datosMeta,
          borderColor: "#9699ae",
          borderDash: [8, 6],
          pointRadius: 5,
          pointBackgroundColor: "#ffffff",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#ffffff" } } },
      scales: {
        x: { ticks: { color: "#9699ae" }, grid: { color: "#262b4e" } },
        y: {
          min: min,
          max: max,
          ticks: { color: "#9699ae" },
          grid: { color: "#262b4e" },
          title: { display: true, text: "kg", color: "#9699ae" },
        },
      },
    },
  });
}

/* ---------- Primera vez: pedir datos ---------- */
function iniciarObjetivos() {
  renderObjetivos();
  if (!objetivo) abrirObjetivoModal(false);
}

function abrirObjetivoModal(editar) {
  document.getElementById("titulo-objetivo").textContent = editar ? "Editar objetivo" : "Cuéntanos sobre ti";
  document.getElementById("texto-objetivo").textContent = editar
    ? "Modifica tu altura o tus metas."
    : "Con estos datos calcularemos tu % de grasa aproximado y armaremos tu gráfica de progreso.";
  document.getElementById("grupo-obj-peso").classList.toggle("oculto", editar);
  document.getElementById("obj-peso").value = "";
  document.getElementById("obj-altura").value = editar ? objetivo.altura : "";
  document.getElementById("obj-meta-peso").value = editar ? objetivo.pesoObjetivo : "";
  document.getElementById("obj-meta-grasa").value = editar ? objetivo.grasaObjetivo : "";
  errorObjetivo.textContent = "";
  abrirModal(modalObjetivo);
}

formObjetivo.addEventListener("submit", (e) => {
  e.preventDefault();
  const editando = objetivo !== null;
  const peso = Number(document.getElementById("obj-peso").value);
  const altura = Number(document.getElementById("obj-altura").value);
  const pesoMeta = Number(document.getElementById("obj-meta-peso").value);
  const grasaMeta = Number(document.getElementById("obj-meta-grasa").value);

  const revisar = [
    ...(editando ? [] : [[peso, "Peso actual", 20, 400, "kg"]]),
    [altura, "Altura", 100, 250, "cm"],
    [pesoMeta, "Peso objetivo", 20, 400, "kg"],
    [grasaMeta, "% graso objetivo", 1, 70, "%"],
  ];

  for (const [valor, nombre, min, max, unidad] of revisar) {
    if (Number.isNaN(valor) || valor < min || valor > max) {
      errorObjetivo.textContent = `"${nombre}" debe estar entre ${min} y ${max} ${unidad}.`;
      return;
    }
  }

  if (!editando) pesos = [{ id: 1, fecha: hoyISO(), peso: peso }];
  objetivo = { altura: altura, pesoObjetivo: pesoMeta, grasaObjetivo: grasaMeta };

  guardarObjetivos();
  cerrarModal(modalObjetivo);
  renderObjetivos();
});

document.getElementById("btn-config-objetivo").addEventListener("click", () => abrirObjetivoModal(false));
document.getElementById("btn-editar-objetivo").addEventListener("click", () => abrirObjetivoModal(true));
document.getElementById("cerrar-objetivo").addEventListener("click", () => cerrarModal(modalObjetivo));
document.getElementById("cancelar-objetivo").addEventListener("click", () => cerrarModal(modalObjetivo));

/* ---------- Eliminar objetivo (usa el modal de confirmación) ---------- */
document.getElementById("btn-eliminar-objetivo").addEventListener("click", () => {
  tablaActiva = "objetivos";
  textoEliminar.textContent = "Se eliminará tu objetivo y todo el historial de pesos de la gráfica. Esta acción no se puede deshacer.";
  abrirModal(modalEliminar);
});

/* ---------- Ingresar nuevo peso ---------- */
document.getElementById("btn-nuevo-peso").addEventListener("click", () => {
  const fecha = document.getElementById("peso-fecha");
  fecha.value = hoyISO();
  fecha.max = hoyISO();
  document.getElementById("peso-valor").value = "";
  errorPeso.textContent = "";
  abrirModal(modalPeso);
});

formPeso.addEventListener("submit", (e) => {
  e.preventDefault();
  const fecha = document.getElementById("peso-fecha").value;
  const peso = Number(document.getElementById("peso-valor").value);

  if (!fecha) {
    errorPeso.textContent = "La fecha es obligatoria.";
    return;
  }
  if (fecha > hoyISO()) {
    errorPeso.textContent = "La fecha no puede ser futura.";
    return;
  }
  if (Number.isNaN(peso) || peso < 20 || peso > 400) {
    errorPeso.textContent = '"Peso" debe estar entre 20 y 400 kg.';
    return;
  }

  const siguienteId = pesos.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  pesos.push({ id: siguienteId, fecha: fecha, peso: peso });

  guardarObjetivos();
  cerrarModal(modalPeso);
  renderObjetivos();
});

document.getElementById("cerrar-peso").addEventListener("click", () => cerrarModal(modalPeso));
document.getElementById("cancelar-peso").addEventListener("click", () => cerrarModal(modalPeso));

/* =========================================
   Cerrar modales al hacer clic fuera / con Escape
   ========================================= */
const todosLosModales = [modalMedida, modalEliminar, modalPremiun, modalObjetivo, modalPeso];

todosLosModales.forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal(modal);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") todosLosModales.forEach((modal) => cerrarModal(modal));
});

/* =========================================
   Inicio
   ========================================= */
renderMediciones();
renderMembresia();
cargarObjetivos();
abrirChat("entrenador");
mostrarVista("menu");
