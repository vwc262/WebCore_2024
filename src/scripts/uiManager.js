import Login from "./Entities/Login/Login.js";

const $btnHeader = document.querySelector(".header__buttons");
const btnHome = document.querySelector(".headerBtn__Home");

$btnHeader.addEventListener("click", (ev) => {
  if (ev.target.nodeName == "DIV") {
    [...ev.currentTarget.children].forEach((element) => {
      element.classList.remove("header__active");
    });

    const actualTarger = ev.target;
    actualTarger.classList.add("header__active");

    switch (actualTarger.className) {
      case "headerBtn__Home header__active":
        section__home.style.zIndex = "10";
        section__mapa.style.zIndex = "5";
        section__graficador.style.zIndex = "5";
        section__login.style.zIndex = "5";
        section__particular.style.zIndex = "5";
        break;
      case "headerBtn__Mapa header__active":
        section__home.style.zIndex = "5";
        section__mapa.style.zIndex = "10";
        section__graficador.style.zIndex = "5";
        section__login.style.zIndex = "5";
        section__particular.style.zIndex = "5";
        break;
      case "headerBtn__Graficador header__active":
        section__home.style.zIndex = "5";
        section__mapa.style.zIndex = "5";
        section__graficador.style.zIndex = "10";
        section__login.style.zIndex = "5";
        section__particular.style.zIndex = "5";
        break;
      case "headerBtn__Login header__active":
        section__home.style.zIndex = "5";
        section__mapa.style.zIndex = "5";
        section__graficador.style.zIndex = "5";
        section__login.style.zIndex = "10";
        section__particular.style.zIndex = "5";
        Login.Instace.create();
        break;
    }
  }
});

function GoHome() {
  btnHome.click();
}

export { GoHome };
