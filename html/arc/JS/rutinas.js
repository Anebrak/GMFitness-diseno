/* =========================================
   Utilidades
   ========================================= */
const $ = (id) => document.getElementById(id);
const escapar = (t) => { const d = document.createElement("div"); d.textContent = t; return d.innerHTML; };
const hoyISO = () => { const f = new Date(); return f.getFullYear() + "-" + String(f.getMonth() + 1).padStart(2, "0") + "-" + String(f.getDate()).padStart(2, "0"); };
const formatearFecha = (iso) => { const [a, m, d] = iso.split("-"); return `${d}/${m}/${a}`; };
const abrirModal = (m) => { m.classList.add("activo"); m.setAttribute("aria-hidden", "false"); };
const cerrarModal = (m) => { m.classList.remove("activo"); m.setAttribute("aria-hidden", "true"); };

/* =========================================
   Datos (en tu proyecto vendrán de la base de datos)
   ========================================= */
const ejerciciosBase = [
  { id: 1, grupo: "Pecho", nombre: "Press de banca", maquina: "Barra libre", imagen: "", descripcion: "Acostado en el banco, baja la barra hasta el pecho y empuja hacia arriba sin despegar los glúteos." },
  { id: 2, grupo: "Pecho", nombre: "Aperturas en polea", maquina: "Polea doble", imagen: "", descripcion: "Con los codos ligeramente flexionados, abre y cierra los brazos manteniendo tensión en el pecho." },
  { id: 3, grupo: "Espalda", nombre: "Jalón al pecho", maquina: "Polea alta", imagen: "", descripcion: "Tira de la barra hacia la parte alta del pecho llevando los codos hacia abajo y atrás." },
  { id: 4, grupo: "Espalda", nombre: "Remo con barra", maquina: "Barra libre", imagen: "", descripcion: "Con el torso inclinado y la espalda recta, lleva la barra hacia el abdomen." },
  { id: 5, grupo: "Pierna", nombre: "Sentadilla", maquina: "Barra libre", imagen: "", descripcion: "Baja controlado hasta que los muslos queden paralelos al suelo y sube empujando con los talones." },
  { id: 6, grupo: "Pierna", nombre: "Prensa de piernas", maquina: "Prensa 45°", imagen: "", descripcion: "Empuja la plataforma sin bloquear las rodillas y regresa con control." },
  { id: 7, grupo: "Pierna", nombre: "Curl femoral", maquina: "Máquina curl femoral", imagen: "", descripcion: "Flexiona las rodillas llevando el talón hacia el glúteo y baja lentamente." },
  { id: 8, grupo: "Hombro", nombre: "Press militar", maquina: "Mancuernas", imagen: "", descripcion: "Empuja las mancuernas por encima de la cabeza sin arquear la espalda." },
  { id: 9, grupo: "Hombro", nombre: "Elevaciones laterales", maquina: "Mancuernas", imagen: "", descripcion: "Eleva los brazos a los lados hasta la altura de los hombros." },
  { id: 10, grupo: "Brazo", nombre: "Curl de bíceps", maquina: "Barra Z", imagen: "", descripcion: "Flexiona los codos llevando la barra a los hombros sin balancear el cuerpo." },
  { id: 11, grupo: "Brazo", nombre: "Extensión de tríceps", maquina: "Polea alta", imagen: "", descripcion: "Con los codos pegados al cuerpo, extiende los brazos hacia abajo." },
  { id: 12, grupo: "Core", nombre: "Plancha", maquina: "Peso corporal", imagen: "", descripcion: "Mantén el cuerpo alineado apoyado en antebrazos y puntas de los pies." },
];

const historialBase = {
  1: [{ fecha: "2026-09-20", peso: 70, reps: 10 }, { fecha: "2026-09-27", peso: 72.5, reps: 8 }, { fecha: "2026-10-04", peso: 75, reps: 8 }],
  5: [{ fecha: "2026-10-01", peso: 90, reps: 8 }, { fecha: "2026-10-08", peso: 92.5, reps: 6 }],
};

// Ayudante para armar un ejercicio dentro de una rutina
const e = (ex, series, repTipo, repA, repB, esf, esfVal) => ({ ex, series, repTipo, repA, repB, esf, esfVal });
const armar = (semanas, dias) => Array.from({ length: semanas }, () => ({ dias: dias.map((ejs) => ({ ejercicios: ejs.map((x) => ({ ...x })) })) }));

const rutinasProfesionales = [
  { id: "p1", nombre: "Full Body Principiante", autor: "Carlos Restrepo", nivel: "Principiante",
    semanas: armar(4, [
      [e(5, 3, "rango", 8, 12, "rir", 2), e(1, 3, "rango", 8, 12, "rir", 2), e(4, 3, "rango", 8, 12, "rir", 2)],
      [e(6, 3, "rango", 10, 12, "rir", 2), e(8, 3, "rango", 8, 12, "rir", 2), e(3, 3, "rango", 10, 12, "rir", 2)],
    ]) },
  { id: "p2", nombre: "Torso / Pierna", autor: "Carlos Restrepo", nivel: "Intermedio",
    semanas: armar(6, [
      [e(1, 4, "rango", 6, 10, "rir", 1), e(4, 4, "rango", 6, 10, "rir", 1), e(8, 3, "rango", 8, 12, "rir", 2), e(10, 3, "max", 12, 0, "arm", 0)],
      [e(5, 4, "rango", 6, 10, "rir", 1), e(6, 3, "rango", 10, 12, "rir", 2), e(7, 3, "rango", 10, 15, "arm", 0), e(12, 3, "amrap", 0, 0, "arm", 0)],
      [e(2, 3, "rango", 10, 15, "rir", 2), e(3, 4, "rango", 8, 12, "rir", 1), e(9, 4, "rango", 12, 15, "arm", 0), e(11, 3, "rango", 10, 12, "rir", 1)],
    ]) },
  { id: "p3", nombre: "Fuerza 5x5", autor: "Mateo Ríos", nivel: "Avanzado",
    semanas: armar(8, [
      [e(5, 5, "max", 5, 0, "rir", 1), e(1, 5, "max", 5, 0, "rir", 1), e(4, 5, "max", 5, 0, "rir", 1)],
      [e(5, 3, "max", 8, 0, "rir", 2), e(8, 5, "max", 5, 0, "rir", 1), e(3, 3, "amrap", 0, 0, "arm", 0)],
    ]) },
];

/* =========================================
   Estado + guardado (localStorage; cámbialo por tu API)
   ========================================= */
let ejercicios = ejerciciosBase.map((x) => ({ ...x }));
let historial = JSON.parse(JSON.stringify(historialBase));
let misRutinas = [];
let actual = null; // copia de la rutina elegida
let borrador = null; // rutina que se está creando
let diaDestino = null; // { s, d }
let ejercicioSel = null;
let fuenteIniciar = "mias";

function guardar() {
  try { localStorage.setItem("gm_rutinas", JSON.stringify({ ejercicios, historial, misRutinas, actual })); } catch (err) {}
}
function cargar() {
  try {
    const g = JSON.parse(localStorage.getItem("gm_rutinas"));
    if (g) { ejercicios = g.ejercicios || ejercicios; historial = g.historial || historial; misRutinas = g.misRutinas || []; actual = g.actual || null; }
  } catch (err) {}
}

/* =========================================
   Barra lateral y vistas
   ========================================= */
const barraLateral = $("barra-lateral");
const itemsLaterales = document.querySelectorAll("[data-vista]");

function mostrarVista(nombre, resaltar) {
  document.querySelectorAll(".vista").forEach((v) => v.classList.toggle("activo", v.id === "vista-" + nombre));
  itemsLaterales.forEach((i) => i.classList.toggle("activo", i.dataset.vista === (resaltar || nombre)));
}

$("btn-toggle").addEventListener("click", () => barraLateral.classList.toggle("expandida"));
itemsLaterales.forEach((item) => item.addEventListener("click", () => {
  barraLateral.classList.add("expandida");
  mostrarVista(item.dataset.vista);
}));

/* =========================================
   Texto de un ejercicio dentro de la rutina
   ========================================= */
function textoReps(x) {
  if (x.repTipo === "rango") return `${x.repA}-${x.repB} reps`;
  if (x.repTipo === "amrap") return "AMRAP";
  return `${x.repA} reps máx.`;
}
const textoEsf = (x) => (x.esf === "rir" ? `RIR ${x.esfVal}` : "ARM");
const buscarEj = (id) => ejercicios.find((x) => x.id === id);

/* Tabla de una rutina: filas = semanas, columnas = días */
function tablaRutina(r, editable) {
  const maxDias = Math.max(1, ...r.semanas.map((s) => s.dias.length));
  let html = '<table class="tabla tabla-rutina"><thead><tr><th>Semana</th>';
  for (let i = 1; i <= maxDias; i++) html += `<th>Día ${i}</th>`;
  html += "</tr></thead><tbody>";

  r.semanas.forEach((sem, s) => {
    html += `<tr><td class="celda-semana"><strong>Semana ${s + 1}</strong>`;
    if (editable) html += `<button type="button" class="btn boton-secundario btn-mini" data-a="dia" data-s="${s}"><i class="fa-solid fa-plus"></i> Agregar día</button>`;
    html += "</td>";

    for (let d = 0; d < maxDias; d++) {
      const dia = sem.dias[d];
      if (!dia) { html += "<td></td>"; continue; }
      html += "<td>";
      html += dia.ejercicios.length
        ? dia.ejercicios.map((x, i) => {
            const ej = buscarEj(x.ex);
            return `<div class="item-ej"><div>${escapar(ej ? ej.nombre : "Ejercicio eliminado")}<small>${x.series} x ${textoReps(x)} · ${textoEsf(x)}</small></div>` +
              (editable ? `<button type="button" data-a="quitar" data-s="${s}" data-d="${d}" data-i="${i}" aria-label="Quitar"><i class="fa-solid fa-xmark"></i></button>` : "") + "</div>";
          }).join("")
        : '<p class="dia-vacio">Sin ejercicios</p>';
      if (editable) html += `<button type="button" class="btn boton-secundario btn-mini" data-a="ej" data-s="${s}" data-d="${d}"><i class="fa-solid fa-plus"></i> Agregar ejercicio</button>`;
      html += "</td>";
    }
    html += "</tr>";
  });
  return html + "</tbody></table>";
}

const totalEjercicios = (r) => r.semanas[0].dias.reduce((n, d) => n + d.ejercicios.length, 0);
const diasPorSemana = (r) => r.semanas[0].dias.length;

/* =========================================
   Mis rutinas
   ========================================= */
function renderMisRutinas() {
  $("grid-mis-rutinas").innerHTML =
    `<div class="caja-crear" id="btn-crear" role="button" tabindex="0"><i class="fa-solid fa-plus"></i><h2>Crear rutina</h2></div>` +
    misRutinas.map((r) => tarjetaRutina(r, "mia")).join("");
}

function tarjetaRutina(r, tipo) {
  const autor = tipo === "pro" ? `<p>Por ${escapar(r.autor)}</p>` : "<p>Creada por ti</p>";
  const extra = tipo === "pro" ? `<span class="chip">${escapar(r.nivel)}</span>` : "";
  return `<article class="tarjeta-rutina"><h2>${escapar(r.nombre)}</h2>${autor}
    <div class="datos"><span class="chip">${r.semanas.length} semanas</span><span class="chip">${diasPorSemana(r)} días/sem</span>${extra}</div>
    <div class="tarjeta-botones">
      <button type="button" class="btn boton-primario btn-mini" data-ver="${tipo}" data-id="${r.id}">Ver</button>
      ${tipo === "pro" ? `<button type="button" class="btn boton-secundario btn-mini" data-agregar="${r.id}">Agregar a mis rutinas</button>` : ""}
    </div></article>`;
}

$("grid-mis-rutinas").addEventListener("click", (ev) => {
  if (ev.target.closest("#btn-crear")) { $("error-semanas").textContent = ""; abrirModal($("modal-semanas")); return; }
  const v = ev.target.closest("[data-ver]");
  if (v) verRutina(v.dataset.ver, v.dataset.id);
});

/* ---------- Paso 1: cantidad de semanas ---------- */
$("form-semanas").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const n = Number($("num-semanas").value);
  if (!Number.isInteger(n) || n < 1 || n > 24) { $("error-semanas").textContent = "Ingresa entre 1 y 24 semanas."; return; }
  borrador = { semanas: Array.from({ length: n }, () => ({ dias: [] })) };
  $("rutina-nombre").value = "";
  $("error-rutina").textContent = "";
  cerrarModal($("modal-semanas"));
  renderConstructor();
  mostrarVista("constructor", "mis-rutinas");
});

/* ---------- Paso 2: tabla de semanas ---------- */
function renderConstructor() { $("constructor-tabla").innerHTML = tablaRutina(borrador, true); }

$("constructor-tabla").addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-a]");
  if (!b) return;
  const s = Number(b.dataset.s), d = Number(b.dataset.d);
  if (b.dataset.a === "dia") {
    if (borrador.semanas[s].dias.length >= 7) return;
    borrador.semanas[s].dias.push({ ejercicios: [] });
  } else if (b.dataset.a === "quitar") {
    borrador.semanas[s].dias[d].ejercicios.splice(Number(b.dataset.i), 1);
  } else if (b.dataset.a === "ej") {
    diaDestino = { s, d };
    abrirAgregarEj();
    return;
  }
  renderConstructor();
});

$("btn-cancelar-rutina").addEventListener("click", () => { borrador = null; mostrarVista("mis-rutinas"); });

$("btn-crear-rutina").addEventListener("click", () => {
  const nombre = $("rutina-nombre").value.trim();
  if (!nombre) { $("error-rutina").textContent = "Escribe un nombre para la rutina."; return; }
  if (!borrador.semanas.some((s) => s.dias.some((d) => d.ejercicios.length))) { $("error-rutina").textContent = "Agrega al menos un día con un ejercicio."; return; }
  borrador.id = "m" + Date.now();
  borrador.nombre = nombre;
  misRutinas.push(borrador);
  borrador = null;
  guardar();
  renderMisRutinas();
  mostrarVista("mis-rutinas");
});

/* ---------- Modal: agregar ejercicio ---------- */
const gruposUnicos = () => [...new Set(ejercicios.map((x) => x.grupo))];

function llenarEjerciciosSelect() {
  const g = $("ae-grupo").value;
  $("ae-ejercicio").innerHTML = ejercicios.filter((x) => x.grupo === g)
    .map((x) => `<option value="${x.id}">${escapar(x.nombre)} (${escapar(x.maquina)})</option>`).join("");
}

function ajustarCamposReps() {
  const t = $("ae-rep-tipo").value, esf = $("ae-esf").value;
  $("ae-reps-cajas").classList.toggle("oculto", t === "amrap");
  $("ae-rep-b-grupo").classList.toggle("oculto", t !== "rango");
  $("ae-rep-a-label").textContent = t === "rango" ? "Reps iniciales" : "Reps máximas";
  $("ae-esf-grupo").classList.toggle("oculto", esf === "arm");
}

function abrirAgregarEj() {
  $("ae-grupo").innerHTML = gruposUnicos().map((g) => `<option>${escapar(g)}</option>`).join("");
  llenarEjerciciosSelect();
  $("ae-series").value = 3;
  $("ae-rep-tipo").value = "max";
  $("ae-esf").value = "rir";
  ajustarCamposReps();
  $("error-agregar-ej").textContent = "";
  abrirModal($("modal-agregar-ej"));
}

$("ae-grupo").addEventListener("change", llenarEjerciciosSelect);
$("ae-rep-tipo").addEventListener("change", ajustarCamposReps);
$("ae-esf").addEventListener("change", ajustarCamposReps);

$("form-agregar-ej").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const x = {
    ex: Number($("ae-ejercicio").value),
    series: Number($("ae-series").value),
    repTipo: $("ae-rep-tipo").value,
    repA: Number($("ae-rep-a").value),
    repB: Number($("ae-rep-b").value),
    esf: $("ae-esf").value,
    esfVal: Number($("ae-esf-val").value),
  };
  const err = $("error-agregar-ej");
  if (!x.ex) { err.textContent = "Selecciona un ejercicio."; return; }
  if (!(x.series >= 1 && x.series <= 20)) { err.textContent = "Las series deben estar entre 1 y 20."; return; }
  if (x.repTipo !== "amrap" && !(x.repA >= 1)) { err.textContent = "Ingresa las repeticiones."; return; }
  if (x.repTipo === "rango" && x.repB <= x.repA) { err.textContent = "Las reps finales deben ser mayores a las iniciales."; return; }
  if (x.esf === "rir" && !(x.esfVal >= 0 && x.esfVal <= 10)) { err.textContent = "El RIR debe estar entre 0 y 10."; return; }

  borrador.semanas[diaDestino.s].dias[diaDestino.d].ejercicios.push(x);
  cerrarModal($("modal-agregar-ej"));
  renderConstructor();
});

/* =========================================
   Rutinas de profesionales + ver rutina
   ========================================= */
function renderProfesionales() {
  $("grid-profesionales").innerHTML = rutinasProfesionales.map((r) => tarjetaRutina(r, "pro")).join("");
}

function clonar(r) { return JSON.parse(JSON.stringify(r)); }

function agregarAMis(r) {
  if (misRutinas.some((m) => m.origen === r.id)) return false;
  const copia = clonar(r);
  copia.origen = r.id;
  copia.id = "m" + Date.now();
  misRutinas.push(copia);
  guardar();
  renderMisRutinas();
  return true;
}

function verRutina(tipo, id) {
  const r = (tipo === "pro" ? rutinasProfesionales : misRutinas).find((x) => String(x.id) === String(id));
  if (!r) return;
  $("ver-titulo").textContent = r.nombre;
  $("ver-tabla").innerHTML = tablaRutina(r, false);
  $("ver-botones").innerHTML = tipo === "pro"
    ? `<button type="button" class="btn boton-primario" id="ver-agregar" style="width:auto">Agregar a mis rutinas</button>` : "";
  if (tipo === "pro") $("ver-agregar").addEventListener("click", () => {
    $("ver-agregar").textContent = agregarAMis(r) ? "¡Agregada!" : "Ya la tienes";
    $("ver-agregar").disabled = true;
  });
  abrirModal($("modal-ver"));
}

$("grid-profesionales").addEventListener("click", (ev) => {
  const v = ev.target.closest("[data-ver]");
  if (v) return verRutina("pro", v.dataset.id);
  const a = ev.target.closest("[data-agregar]");
  if (a) {
    const r = rutinasProfesionales.find((x) => x.id === a.dataset.agregar);
    a.textContent = agregarAMis(r) ? "¡Agregada!" : "Ya la tienes";
    a.disabled = true;
  }
});

/* =========================================
   Mi rutina actual
   ========================================= */
function renderActual() {
  const hay = actual !== null;
  $("actual-vacio").classList.toggle("oculto", hay);
  $("actual-contenido").classList.toggle("oculto", !hay);
  $("btn-cambiar-rutina").classList.toggle("oculto", !hay);
  if (hay) $("actual-contenido").innerHTML = `<h2>${escapar(actual.nombre)}</h2><div class="tabla-contenedor">${tablaRutina(actual, false)}</div>`;
}

function renderListaIniciar() {
  const lista = fuenteIniciar === "mias" ? misRutinas : rutinasProfesionales;
  document.querySelectorAll("[data-fuente]").forEach((b) => {
    const on = b.dataset.fuente === fuenteIniciar;
    b.classList.toggle("boton-primario", on);
    b.classList.toggle("boton-secundario", !on);
  });
  $("lista-iniciar").innerHTML = lista.length
    ? lista.map((r) => `<div class="item-iniciar"><div><strong>${escapar(r.nombre)}</strong><p>${r.semanas.length} semanas · ${totalEjercicios(r)} ejercicios/semana</p></div>
        <button type="button" class="btn boton-primario btn-mini" data-elegir="${r.id}">Iniciar</button></div>`).join("")
    : '<p class="sin-resultados">Aún no tienes rutinas creadas.</p>';
}

function abrirIniciar() { fuenteIniciar = "mias"; renderListaIniciar(); abrirModal($("modal-iniciar")); }
$("btn-iniciar-rutina").addEventListener("click", abrirIniciar);
$("btn-cambiar-rutina").addEventListener("click", abrirIniciar);

$("modal-iniciar").addEventListener("click", (ev) => {
  const f = ev.target.closest("[data-fuente]");
  if (f) { fuenteIniciar = f.dataset.fuente; renderListaIniciar(); return; }
  const el = ev.target.closest("[data-elegir]");
  if (!el) return;
  const lista = fuenteIniciar === "mias" ? misRutinas : rutinasProfesionales;
  actual = clonar(lista.find((r) => String(r.id) === el.dataset.elegir));
  guardar();
  cerrarModal($("modal-iniciar"));
  renderActual();
});

/* =========================================
   Ejercicios
   ========================================= */
function renderEjercicios() {
  $("lista-ejercicios").innerHTML = ejercicios.map((x) =>
    `<button type="button" class="tile-ej ${x.id === ejercicioSel ? "seleccionada" : ""}" data-ej="${x.id}">
      <i class="fa-solid fa-dumbbell"></i><span>${escapar(x.nombre)}</span><small>${escapar(x.grupo)}</small></button>`).join("");
  $("lista-grupos").innerHTML = gruposUnicos().map((g) => `<option value="${escapar(g)}">`).join("");
  renderDetalle();
}

function renderDetalle() {
  const x = buscarEj(ejercicioSel);
  if (!x) {
    $("detalle-ejercicio").innerHTML = '<div class="detalle-vacio"><i class="fa-solid fa-hand-pointer"></i><p>Selecciona un ejercicio para ver su información.</p></div>';
    return;
  }
  const reg = [...(historial[x.id] || [])].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 8);
  $("detalle-ejercicio").innerHTML = `
    <div class="img-ej-grande">${x.imagen ? `<img src="${escapar(x.imagen)}" alt="${escapar(x.nombre)}" onerror="this.replaceWith(Object.assign(document.createElement('i'),{className:'fa-solid fa-dumbbell'}))">` : '<i class="fa-solid fa-dumbbell"></i>'}</div>
    <h2>${escapar(x.nombre)}</h2>
    <p class="texto-ayuda">${escapar(x.descripcion || "Sin descripción.")}</p>
    <div class="info-ej"><div><p>Grupo muscular</p><strong>${escapar(x.grupo)}</strong></div><div><p>Máquina</p><strong>${escapar(x.maquina)}</strong></div></div>
    <div class="cabecera-historial"><h3>Historial</h3><button type="button" class="btn boton-primario btn-mini" id="btn-nuevo-registro" style="margin:0"><i class="fa-solid fa-plus"></i> Registro</button></div>
    <div class="tabla-contenedor"><table class="tabla"><thead><tr><th>Fecha</th><th>Peso</th><th>Reps</th></tr></thead><tbody>${
      reg.length ? reg.map((r) => `<tr><td>${formatearFecha(r.fecha)}</td><td>${r.peso} kg</td><td>${r.reps}</td></tr>`).join("")
        : '<tr><td class="sin-resultados" colspan="3">Sin registros todavía.</td></tr>'}</tbody></table></div>`;
}

$("lista-ejercicios").addEventListener("click", (ev) => {
  const t = ev.target.closest("[data-ej]");
  if (!t) return;
  ejercicioSel = Number(t.dataset.ej);
  renderEjercicios();
});

/* ---------- Registro de peso y reps ---------- */
$("detalle-ejercicio").addEventListener("click", (ev) => {
  if (!ev.target.closest("#btn-nuevo-registro")) return;
  $("rg-peso").value = ""; $("rg-reps").value = ""; $("error-registro").textContent = "";
  abrirModal($("modal-registro"));
});

$("form-registro").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const peso = Number($("rg-peso").value), reps = Number($("rg-reps").value);
  if (Number.isNaN(peso) || peso < 0 || $("rg-peso").value === "") { $("error-registro").textContent = "Ingresa un peso válido."; return; }
  if (!Number.isInteger(reps) || reps < 1) { $("error-registro").textContent = "Ingresa las repeticiones."; return; }
  (historial[ejercicioSel] = historial[ejercicioSel] || []).push({ fecha: hoyISO(), peso, reps });
  guardar();
  cerrarModal($("modal-registro"));
  renderDetalle();
});

/* ---------- Nuevo ejercicio ---------- */
$("btn-nuevo-ejercicio").addEventListener("click", () => {
  $("form-nuevo-ej").reset();
  $("error-nuevo-ej").textContent = "";
  abrirModal($("modal-nuevo-ej"));
});

$("form-nuevo-ej").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const nombre = $("ne-nombre").value.trim(), grupo = $("ne-grupo").value.trim(), maquina = $("ne-maquina").value.trim();
  if (!nombre || !grupo || !maquina) { $("error-nuevo-ej").textContent = "Nombre, grupo muscular y máquina son obligatorios."; return; }
  if (ejercicios.some((x) => x.nombre.toLowerCase() === nombre.toLowerCase() && x.maquina.toLowerCase() === maquina.toLowerCase())) {
    $("error-nuevo-ej").textContent = "Ese ejercicio ya existe."; return;
  }
  const id = ejercicios.reduce((m, x) => Math.max(m, x.id), 0) + 1;
  ejercicios.push({ id, nombre, grupo, maquina, imagen: $("ne-imagen").value.trim(), descripcion: $("ne-desc").value.trim() });
  ejercicioSel = id;
  guardar();
  cerrarModal($("modal-nuevo-ej"));
  renderEjercicios();
});

/* =========================================
   Cerrar modales
   ========================================= */
const modales = document.querySelectorAll(".modal-overlay");
modales.forEach((m) => {
  m.addEventListener("click", (ev) => { if (ev.target === m || ev.target.closest("[data-cerrar]")) cerrarModal(m); });
});
document.addEventListener("keydown", (ev) => { if (ev.key === "Escape") modales.forEach(cerrarModal); });

/* =========================================
   Inicio
   ========================================= */
cargar();
renderMisRutinas();
renderProfesionales();
renderActual();
renderEjercicios();
mostrarVista("mis-rutinas");
