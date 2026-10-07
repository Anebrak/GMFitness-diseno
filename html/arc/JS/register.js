const modal = document.getElementById("modal-register");
const abrir = document.getElementById("abrir-register");
const cerrar = document.getElementById("cerrar-register");

function abrirModal() {
  modal.classList.add("activo");
  modal.setAttribute("aria-hidden", "false");
}
function cerrarModal() {
  modal.classList.remove("activo");
  modal.setAttribute("aria-hidden", "true");
}

abrir.addEventListener("click", abrirModal);
cerrar.addEventListener("click", cerrarModal);

// Cerrar al hacer clic fuera de la caja
modal.addEventListener("click", (e) => {
  if (e.target === modal) cerrarModal();
});

// Cerrar con la tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarModal();
});
