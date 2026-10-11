/* =========================================
   Utilidades
   ========================================= */
const $ = (id) => document.getElementById(id);
const escapar = (t) => { const d = document.createElement("div"); d.textContent = t; return d.innerHTML; };
const normalizar = (t) => String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const num = (n) => Number((Math.round(n * 10) / 10).toFixed(1)); // 1 decimal sin ceros sobrantes

function fechaISO(f) {
  return f.getFullYear() + "-" + String(f.getMonth() + 1).padStart(2, "0") + "-" + String(f.getDate()).padStart(2, "0");
}
const hoyISO = () => fechaISO(new Date());
const formatearFecha = (iso) => { const [a, m, d] = iso.split("-"); return `${d}/${m}/${a}`; };
function sumarDias(iso, n) {
  const f = new Date(iso + "T00:00:00");
  f.setDate(f.getDate() + n);
  return fechaISO(f);
}

const abrirModal = (m) => { m.classList.add("activo"); m.setAttribute("aria-hidden", "false"); };
const cerrarModal = (m) => { m.classList.remove("activo"); m.setAttribute("aria-hidden", "true"); };

/* =========================================
   Datos (en tu proyecto vendrán de la base de datos)
   Valores aproximados por cada 100 g
   ========================================= */
const COMIDAS = [
  { id: "desayuno", nombre: "Desayuno", icono: "fa-mug-hot" },
  { id: "almuerzo", nombre: "Almuerzo", icono: "fa-bowl-food" },
  { id: "cena", nombre: "Cena", icono: "fa-moon" },
];

const ICONOS_CAT = {
  "Proteínas": "fa-drumstick-bite",
  "Lácteos y huevos": "fa-cheese",
  "Cereales y granos": "fa-wheat-awn",
  "Legumbres": "fa-seedling",
  "Tubérculos": "fa-carrot",
  "Frutas": "fa-apple-whole",
  "Verduras": "fa-leaf",
  "Grasas y frutos secos": "fa-droplet",
};
const iconoCat = (cat) => ICONOS_CAT[cat] || "fa-utensils";

// [id, nombre, categoría, kcal, proteína, carbohidratos, grasa, porción (g), nombre de la porción]
const alimentosBase = [
  [1, "Huevo entero", "Lácteos y huevos", 143, 12.6, 0.7, 9.5, 50, "1 unidad"],
  [2, "Leche entera", "Lácteos y huevos", 61, 3.2, 4.8, 3.3, 250, "1 vaso"],
  [3, "Yogur griego natural", "Lácteos y huevos", 59, 10, 3.6, 0.4, 150, "1 pote"],
  [4, "Queso fresco", "Lácteos y huevos", 260, 18, 3, 20, 30, "1 tajada"],
  [5, "Pechuga de pollo cocida", "Proteínas", 165, 31, 0, 3.6, 120, "1 filete"],
  [6, "Carne de res magra", "Proteínas", 217, 26, 0, 12, 120, "1 porción"],
  [7, "Salmón", "Proteínas", 208, 20, 0, 13, 120, "1 filete"],
  [8, "Atún en agua", "Proteínas", 116, 25.5, 0, 0.8, 80, "½ lata"],
  [9, "Avena en hojuelas", "Cereales y granos", 389, 16.9, 66.3, 6.9, 40, "4 cucharadas"],
  [10, "Arroz blanco cocido", "Cereales y granos", 130, 2.7, 28, 0.3, 150, "1 taza"],
  [11, "Pan integral", "Cereales y granos", 247, 13, 41, 3.4, 30, "1 rebanada"],
  [12, "Arepa de maíz", "Cereales y granos", 197, 4.2, 41, 1.6, 80, "1 arepa"],
  [13, "Pasta cocida", "Cereales y granos", 158, 5.8, 31, 0.9, 140, "1 taza"],
  [14, "Frijoles cocidos", "Legumbres", 127, 8.7, 22.8, 0.5, 130, "1 porción"],
  [15, "Lentejas cocidas", "Legumbres", 116, 9, 20, 0.4, 150, "1 porción"],
  [16, "Papa cocida", "Tubérculos", 87, 1.9, 20, 0.1, 150, "1 papa mediana"],
  [17, "Yuca cocida", "Tubérculos", 160, 1.4, 38, 0.3, 100, "1 trozo"],
  [18, "Banano", "Frutas", 89, 1.1, 22.8, 0.3, 120, "1 unidad"],
  [19, "Manzana", "Frutas", 52, 0.3, 13.8, 0.2, 180, "1 unidad"],
  [20, "Aguacate", "Frutas", 160, 2, 8.5, 14.7, 70, "½ unidad"],
  [21, "Brócoli cocido", "Verduras", 35, 2.4, 7.2, 0.4, 100, "1 porción"],
  [22, "Tomate", "Verduras", 18, 0.9, 3.9, 0.2, 120, "1 unidad"],
  [23, "Almendras", "Grasas y frutos secos", 579, 21, 22, 50, 28, "1 puñado"],
  [24, "Mantequilla de maní", "Grasas y frutos secos", 588, 25, 20, 50, 16, "1 cucharada"],
  [25, "Aceite de oliva", "Grasas y frutos secos", 884, 0, 0, 100, 10, "1 cucharada"],
].map(([id, nombre, cat, kcal, prot, carb, grasa, porcionG, porcionTxt]) =>
  ({ id, nombre, cat, kcal, prot, carb, grasa, porcionG, porcionTxt, imagen: "" }));

const METAS_BASE = { kcal: 2000, prot: 120, carb: 220, grasa: 65 };

/* =========================================
   Estado + guardado (localStorage; cámbialo por tu API)
   ========================================= */
let alimentos = alimentosBase.map((a) => ({ ...a }));
let dieta = {};            // { "2026-10-11": { desayuno: [{id, gramos}], almuerzo: [], cena: [] } }
let metas = { ...METAS_BASE };
let fechaVista = hoyISO();
let alimentoSel = null;    // alimento seleccionado en la vista Alimentos
let seleccionModal = null; // alimento elegido dentro del modal de comida
let editando = null;       // { comida, i } cuando se edita un alimento ya agregado

function guardar() {
  try { localStorage.setItem("gm_dietas", JSON.stringify({ alimentos, dieta, metas })); } catch (err) {}
}
function cargar() {
  try {
    const g = JSON.parse(localStorage.getItem("gm_dietas"));
    if (g) { alimentos = g.alimentos || alimentos; dieta = g.dieta || dieta; metas = g.metas || metas; }
  } catch (err) {}
}

const buscarAl = (id) => alimentos.find((a) => a.id === id);
const categorias = () => [...new Set(alimentos.map((a) => a.cat))].sort((a, b) => a.localeCompare(b, "es"));

function macrosDe(a, gramos) {
  const f = gramos / 100;
  return { kcal: a.kcal * f, prot: a.prot * f, carb: a.carb * f, grasa: a.grasa * f };
}
function sumar(lista) {
  const t = { kcal: 0, prot: 0, carb: 0, grasa: 0 };
  lista.forEach((it) => {
    const a = buscarAl(it.id);
    if (!a) return;
    const m = macrosDe(a, it.gramos);
    t.kcal += m.kcal; t.prot += m.prot; t.carb += m.carb; t.grasa += m.grasa;
  });
  return t;
}
const getDia = (f) => dieta[f] || { desayuno: [], almuerzo: [], cena: [] };
function asegurarDia(f) {
  if (!dieta[f]) dieta[f] = { desayuno: [], almuerzo: [], cena: [] };
  return dieta[f];
}

/* =========================================
   Barra lateral y vistas
   ========================================= */
const barraLateral = $("barra-lateral");
const itemsLaterales = document.querySelectorAll("[data-vista]");

function mostrarVista(nombre) {
  document.querySelectorAll(".vista").forEach((v) => v.classList.toggle("activo", v.id === "vista-" + nombre));
  itemsLaterales.forEach((i) => i.classList.toggle("activo", i.dataset.vista === nombre));
}

$("btn-toggle").addEventListener("click", () => barraLateral.classList.toggle("expandida"));
itemsLaterales.forEach((item) => item.addEventListener("click", () => {
  barraLateral.classList.add("expandida");
  mostrarVista(item.dataset.vista);
}));

/* =========================================
   MI DIETA
   ========================================= */
const CIRC = 2 * Math.PI * 90;

function textoFecha(iso) {
  let t = new Date(iso + "T00:00:00").toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
  t = t.charAt(0).toUpperCase() + t.slice(1);
  return iso === hoyISO() ? "Hoy, " + t : t;
}

function renderDieta() {
  const dia = getDia(fechaVista);
  $("dia-label").textContent = textoFecha(fechaVista);
  $("dia-hoy").classList.toggle("oculto", fechaVista === hoyISO());

  // Totales del día
  const total = sumar([...dia.desayuno, ...dia.almuerzo, ...dia.cena]);
  const kcal = Math.round(total.kcal);
  const resta = metas.kcal - kcal;
  const anillo = $("anillo-valor");
  anillo.style.strokeDasharray = CIRC;
  anillo.style.strokeDashoffset = CIRC * (1 - Math.min(1, kcal / metas.kcal));
  anillo.classList.toggle("exceso", resta < 0);
  $("anillo-texto").innerHTML =
    `<strong>${Math.abs(resta)}</strong><span>${resta >= 0 ? "kcal restantes" : "kcal de exceso"}</span><small>${kcal} / ${metas.kcal} kcal</small>`;

  [["prot", "mac-prot"], ["carb", "mac-carb"], ["grasa", "mac-grasa"]].forEach(([k, id]) => {
    $(id + "-txt").textContent = `${num(total[k])} / ${metas[k]} g`;
    $(id + "-barra").style.width = Math.min(100, (total[k] / metas[k]) * 100) + "%";
  });

  // Tarjetas de comidas
  $("comidas").innerHTML = COMIDAS.map((c) => {
    const lista = dia[c.id];
    const t = sumar(lista);
    const filas = lista.length
      ? lista.map((it, i) => {
          const a = buscarAl(it.id);
          if (!a) return "";
          const m = macrosDe(a, it.gramos);
          return `<div class="item-comida">
            <div><p class="nombre">${escapar(a.nombre)}</p>
              <small>${num(it.gramos)} g · ${Math.round(m.kcal)} kcal · P ${num(m.prot)} · C ${num(m.carb)} · G ${num(m.grasa)}</small></div>
            <div class="acciones">
              <button type="button" class="btn-icono btn-editar" data-editar="${c.id}" data-i="${i}" aria-label="Editar cantidad"><i class="fa-solid fa-pen"></i></button>
              <button type="button" class="btn-icono btn-eliminar" data-quitar="${c.id}" data-i="${i}" aria-label="Quitar"><i class="fa-solid fa-trash"></i></button>
            </div></div>`;
        }).join("")
      : '<p class="comida-vacia">Aún no has agregado alimentos.</p>';
    return `<article class="tarjeta-comida" id="comida-${c.id}">
      <div class="comida-cab"><i class="fa-solid ${c.icono}"></i>
        <div><h2>${c.nombre}</h2><small>${Math.round(t.kcal)} kcal</small></div></div>
      ${filas}
      <button type="button" class="btn boton-primario btn-agregar-comida" data-add="${c.id}"><i class="fa-solid fa-plus"></i> Agregar alimento</button>
    </article>`;
  }).join("");
}

$("dia-anterior").addEventListener("click", () => { fechaVista = sumarDias(fechaVista, -1); renderDieta(); });
$("dia-siguiente").addEventListener("click", () => { fechaVista = sumarDias(fechaVista, 1); renderDieta(); });
$("dia-hoy").addEventListener("click", () => { fechaVista = hoyISO(); renderDieta(); });

$("comidas").addEventListener("click", (ev) => {
  const add = ev.target.closest("[data-add]");
  if (add) return abrirComida(add.dataset.add);

  const ed = ev.target.closest("[data-editar]");
  if (ed) {
    const i = Number(ed.dataset.i);
    return abrirComida(ed.dataset.editar, null, { comida: ed.dataset.editar, i });
  }

  const q = ev.target.closest("[data-quitar]");
  if (q) {
    asegurarDia(fechaVista)[q.dataset.quitar].splice(Number(q.dataset.i), 1);
    guardar();
    renderDieta();
  }
});

/* ---------- Modal metas ---------- */
$("btn-metas").addEventListener("click", () => {
  $("mt-kcal").value = metas.kcal; $("mt-prot").value = metas.prot;
  $("mt-carb").value = metas.carb; $("mt-grasa").value = metas.grasa;
  $("error-metas").textContent = "";
  abrirModal($("modal-metas"));
});

$("form-metas").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const v = { kcal: Number($("mt-kcal").value), prot: Number($("mt-prot").value), carb: Number($("mt-carb").value), grasa: Number($("mt-grasa").value) };
  const reglas = [["kcal", "Calorías", 800, 6000, "kcal"], ["prot", "Proteínas", 20, 400, "g"], ["carb", "Carbohidratos", 20, 800, "g"], ["grasa", "Grasas", 10, 300, "g"]];
  for (const [k, nombre, min, max, u] of reglas) {
    if (!Number.isFinite(v[k]) || $("mt-" + k).value === "" || v[k] < min || v[k] > max) {
      $("error-metas").textContent = `"${nombre}" debe estar entre ${min} y ${max} ${u}.`;
      return;
    }
  }
  metas = v;
  guardar();
  cerrarModal($("modal-metas"));
  renderDieta();
});

/* =========================================
   Modal: agregar / editar alimento en una comida
   ========================================= */
function llenarCategorias(select, textoTodas) {
  select.innerHTML = `<option value="">${textoTodas}</option>` + categorias().map((c) => `<option>${escapar(c)}</option>`).join("");
}

function filtrar(texto, cat) {
  const q = normalizar(texto.trim());
  return alimentos
    .filter((a) => (!cat || a.cat === cat) && (!q || normalizar(a.nombre).includes(q)))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

function renderResultadosModal() {
  const lista = filtrar($("mc-buscar").value, $("mc-cat").value);
  $("mc-resultados").innerHTML = lista.length
    ? lista.map((a) => `<button type="button" class="res-item ${a.id === seleccionModal ? "seleccionada" : ""}" data-id="${a.id}">
        <span><i class="fa-solid ${iconoCat(a.cat)}"></i> ${escapar(a.nombre)}</span><small>${a.kcal} kcal / 100 g</small></button>`).join("")
    : '<p class="sin-resultados">No se encontraron alimentos.</p>';
}

function actualizarPreview() {
  const a = buscarAl(seleccionModal);
  const g = Number($("mc-gramos").value);
  if (!a || !(g > 0)) { $("mc-preview").innerHTML = ""; return; }
  const m = macrosDe(a, g);
  $("mc-preview").innerHTML =
    `<div class="preview-macros"><div><strong>${Math.round(m.kcal)}</strong><span>kcal</span></div>
     <div><strong>${num(m.prot)} g</strong><span>Proteínas</span></div>
     <div><strong>${num(m.carb)} g</strong><span>Carbohidratos</span></div>
     <div><strong>${num(m.grasa)} g</strong><span>Grasas</span></div></div>`;
}

function renderSeleccionModal() {
  const a = buscarAl(seleccionModal);
  $("mc-seleccion").classList.toggle("oculto", !a);
  $("mc-guardar").disabled = !a;
  if (!a) return;
  $("mc-nombre").textContent = a.nombre;
  $("mc-usar-porcion").textContent = `${a.porcionTxt || "Porción"} (${num(a.porcionG)} g)`;
  actualizarPreview();
}

function abrirComida(comida, alimentoId, edit) {
  editando = edit || null;
  $("mc-comida").value = comida;
  $("mc-titulo").textContent = edit ? "Editar alimento" : "Agregar alimento";
  $("mc-guardar").textContent = edit ? "Guardar" : "Agregar";
  $("mc-busqueda-zona").classList.toggle("oculto", !!edit);
  $("error-comida").textContent = "";
  llenarCategorias($("mc-cat"), "Todas");
  $("mc-buscar").value = "";

  if (edit) {
    const it = getDia(fechaVista)[edit.comida][edit.i];
    seleccionModal = it.id;
    $("mc-gramos").value = it.gramos;
  } else {
    seleccionModal = alimentoId || null;
    const a = buscarAl(seleccionModal);
    $("mc-gramos").value = a ? a.porcionG : "";
  }
  renderResultadosModal();
  renderSeleccionModal();
  abrirModal($("modal-comida"));
}

$("mc-buscar").addEventListener("input", renderResultadosModal);
$("mc-cat").addEventListener("change", renderResultadosModal);
$("mc-gramos").addEventListener("input", actualizarPreview);

$("mc-resultados").addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-id]");
  if (!b) return;
  seleccionModal = Number(b.dataset.id);
  $("mc-gramos").value = buscarAl(seleccionModal).porcionG;
  renderResultadosModal();
  renderSeleccionModal();
});

$("mc-usar-porcion").addEventListener("click", () => {
  const a = buscarAl(seleccionModal);
  if (a) { $("mc-gramos").value = a.porcionG; actualizarPreview(); }
});

$("form-comida").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const gramos = Number($("mc-gramos").value);
  if (!buscarAl(seleccionModal)) { $("error-comida").textContent = "Selecciona un alimento."; return; }
  if (!(gramos >= 1 && gramos <= 2000)) { $("error-comida").textContent = "La cantidad debe estar entre 1 y 2000 g."; return; }

  const dia = asegurarDia(fechaVista);
  const destino = $("mc-comida").value;
  if (editando) dia[editando.comida].splice(editando.i, 1);
  dia[destino].push({ id: seleccionModal, gramos });

  editando = null;
  guardar();
  cerrarModal($("modal-comida"));
  renderDieta();
  mostrarVista("dieta");
});

/* =========================================
   ALIMENTOS
   ========================================= */
function renderAlimentos() {
  const sel = $("filtro-cat").value;
  llenarCategorias($("filtro-cat"), "Todas las categorías");
  $("filtro-cat").value = categorias().includes(sel) ? sel : "";
  $("lista-categorias").innerHTML = categorias().map((c) => `<option value="${escapar(c)}">`).join("");

  const lista = filtrar($("buscar-alimento").value, $("filtro-cat").value);
  $("lista-alimentos").innerHTML = lista.length
    ? lista.map((a) => `<button type="button" class="tile-al ${a.id === alimentoSel ? "seleccionada" : ""}" data-al="${a.id}">
        <i class="fa-solid ${iconoCat(a.cat)}"></i><span>${escapar(a.nombre)}</span><small>${a.kcal} kcal</small></button>`).join("")
    : '<p class="sin-resultados sin-res-al">No se encontraron alimentos con esa búsqueda.</p>';
  renderDetalleAlimento();
}

function renderDetalleAlimento() {
  const a = buscarAl(alimentoSel);
  if (!a) {
    $("detalle-alimento").innerHTML = '<div class="detalle-vacio"><i class="fa-solid fa-hand-pointer"></i><p>Selecciona un alimento para ver su información nutricional.</p></div>';
    return;
  }
  const pm = macrosDe(a, a.porcionG);
  // Distribución de calorías por macronutriente (4-4-9 kcal/g)
  const kp = a.prot * 4, kc = a.carb * 4, kg = a.grasa * 9, kt = kp + kc + kg || 1;
  const pp = Math.round((kp / kt) * 100), pc = Math.round((kc / kt) * 100), pg = Math.max(0, 100 - pp - pc);
  const imagen = a.imagen
    ? `<img src="${escapar(a.imagen)}" alt="${escapar(a.nombre)}" onerror="this.replaceWith(Object.assign(document.createElement('i'),{className:'fa-solid ${iconoCat(a.cat)}'}))">`
    : `<i class="fa-solid ${iconoCat(a.cat)}"></i>`;

  $("detalle-alimento").innerHTML = `
    <div class="img-al-grande">${imagen}</div>
    <h2>${escapar(a.nombre)}</h2>
    <span class="chip">${escapar(a.cat)}</span>
    <p class="etiqueta-pequena" style="margin-top:14px">Información nutricional por 100 g</p>
    <div class="info-al">
      <div><p>Calorías</p><strong>${num(a.kcal)} kcal</strong></div>
      <div><p>Proteínas</p><strong>${num(a.prot)} g</strong></div>
      <div><p>Carbohidratos</p><strong>${num(a.carb)} g</strong></div>
      <div><p>Grasas</p><strong>${num(a.grasa)} g</strong></div>
    </div>
    <div class="barra-distribucion" title="Distribución de calorías">
      <div class="d-prot" style="width:${pp}%"></div><div class="d-carb" style="width:${pc}%"></div><div class="d-grasa" style="width:${pg}%"></div>
    </div>
    <div class="leyenda-distribucion"><span class="l-prot">Prot ${pp}%</span><span class="l-carb">Carb ${pc}%</span><span class="l-grasa">Grasa ${pg}%</span></div>
    <div class="porcion-al">
      <p class="etiqueta-pequena">Porción típica: ${escapar(a.porcionTxt || "Porción")} (${num(a.porcionG)} g)</p>
      <strong>${Math.round(pm.kcal)} kcal</strong> · P ${num(pm.prot)} g · C ${num(pm.carb)} g · G ${num(pm.grasa)} g
    </div>
    <button type="button" class="btn boton-primario btn-agregar-detalle" id="btn-detalle-agregar"><i class="fa-solid fa-plus"></i> Agregar a mi dieta</button>`;
}

$("buscar-alimento").addEventListener("input", renderAlimentos);
$("filtro-cat").addEventListener("change", renderAlimentos);

$("lista-alimentos").addEventListener("click", (ev) => {
  const t = ev.target.closest("[data-al]");
  if (!t) return;
  alimentoSel = Number(t.dataset.al);
  renderAlimentos();
});

$("detalle-alimento").addEventListener("click", (ev) => {
  if (ev.target.closest("#btn-detalle-agregar")) abrirComida("desayuno", alimentoSel);
});

/* ---------- Nuevo alimento ---------- */
$("btn-nuevo-alimento").addEventListener("click", () => {
  $("form-nuevo-al").reset();
  $("na-porcion").value = 100;
  $("error-nuevo-al").textContent = "";
  abrirModal($("modal-nuevo-al"));
});

$("form-nuevo-al").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const err = $("error-nuevo-al");
  const nombre = $("na-nombre").value.trim();
  const cat = $("na-cat").value.trim();
  const v = { kcal: $("na-kcal").value, prot: $("na-prot").value, carb: $("na-carb").value, grasa: $("na-grasa").value };
  const porcionG = Number($("na-porcion").value);

  if (!nombre || !cat) { err.textContent = "El nombre y la categoría son obligatorios."; return; }
  if (alimentos.some((a) => normalizar(a.nombre) === normalizar(nombre))) { err.textContent = "Ese alimento ya existe."; return; }
  if (!(porcionG >= 1 && porcionG <= 1000)) { err.textContent = "La porción debe estar entre 1 y 1000 g."; return; }
  for (const [k, nombreCampo, max] of [["kcal", "Calorías", 900], ["prot", "Proteínas", 100], ["carb", "Carbohidratos", 100], ["grasa", "Grasas", 100]]) {
    const n = Number(v[k]);
    if (v[k] === "" || !Number.isFinite(n) || n < 0 || n > max) { err.textContent = `"${nombreCampo}" debe estar entre 0 y ${max}.`; return; }
  }
  if (Number(v.prot) + Number(v.carb) + Number(v.grasa) > 100) { err.textContent = "Proteínas + carbohidratos + grasas no pueden superar 100 g."; return; }

  const id = alimentos.reduce((m, a) => Math.max(m, a.id), 0) + 1;
  alimentos.push({
    id, nombre, cat, kcal: Number(v.kcal), prot: Number(v.prot), carb: Number(v.carb), grasa: Number(v.grasa),
    porcionG, porcionTxt: $("na-porcion-txt").value.trim(), imagen: $("na-imagen").value.trim(),
  });
  alimentoSel = id;
  $("buscar-alimento").value = "";
  $("filtro-cat").value = "";
  guardar();
  cerrarModal($("modal-nuevo-al"));
  renderAlimentos();
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
renderDieta();
renderAlimentos();
mostrarVista("dieta");
