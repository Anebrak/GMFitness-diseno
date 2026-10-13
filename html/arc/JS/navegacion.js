const rutasNavegacion = {
  "of-1": "rutinas.html",
  "of-2": "dietas.html",
  "of-3": "cliente.html#mediciones",
  "of-4": "admin.html",
  "menu-1": "rutinas.html",
  "menu-2": "dietas.html",
  "menu-3": "cliente.html#mediciones",
  "menu-4": "admin.html",
  "btn-gratis": "cliente.html",
  "btn-premiun": "cliente.html",
};

function navegarA(ruta) {
  window.location.href = ruta;
}

Object.entries(rutasNavegacion).forEach(([id, ruta]) => {
  const elemento = document.getElementById(id);
  if (!elemento) return;

  elemento.setAttribute("role", "link");
  elemento.setAttribute("tabindex", "0");
  elemento.addEventListener("click", () => navegarA(ruta));
  elemento.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      navegarA(ruta);
    }
  });
});

const logo = document.querySelector("header nav h1");
if (logo) {
  logo.setAttribute("role", "link");
  logo.setAttribute("tabindex", "0");
  logo.addEventListener("click", () => navegarA("index.html"));
  logo.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      navegarA("index.html");
    }
  });
}

const usuario = document.getElementById("usuario-bola");
if (usuario) {
  usuario.setAttribute("role", "link");
  usuario.setAttribute("tabindex", "0");
  usuario.addEventListener("click", () => navegarA("cliente.html"));
  usuario.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      navegarA("cliente.html");
    }
  });
}

const destino = window.location.hash.slice(1);
const vistaDestino = document.querySelector(`[data-vista="${destino}"]`);
if (vistaDestino) vistaDestino.click();
