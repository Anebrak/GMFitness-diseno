function configurarModal(idModal, idAbrir, idCerrar) {
  const modal = document.getElementById(idModal);
  const abrir = document.getElementById(idAbrir);
  const cerrar = document.getElementById(idCerrar);

  const abrirModal = () => {
    modal.classList.add('activo');
    modal.setAttribute('aria-hidden', 'false');
  };
  const cerrarModal = () => {
    modal.classList.remove('activo');
    modal.setAttribute('aria-hidden', 'true');
  };

  abrir.addEventListener('click', abrirModal);
  cerrar.addEventListener('click', cerrarModal);

  // Cerrar al hacer clic fuera de la caja
  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModal();
  });
}

configurarModal('modal-login', 'abrir-login', 'cerrar-login');
configurarModal('modal-register', 'abrir-register', 'cerrar-register');