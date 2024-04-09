const $btnHeader = document.querySelector(".buttons__header");

$btnHeader.addEventListener("click", (ev) => {
  if (ev.target.nodeName == "DIV") {
    [...ev.currentTarget.children].forEach((element) => {
      element.classList.remove("header__active");
    });

    const actualTarger = ev.target;
    actualTarger.classList.add("header__active");

    switch (actualTarger.className) {
      case "home__container header__active":
        section__home.style.zIndex = "10";
        section__vistaMapa.style.zIndex = "5";
        section__graficador.style.zIndex = "5";
        section__login.style.zIndex = "5";
        section__particular.style.zIndex = "5";
        console.log("hola")
        break;
      case "vistaMapa__container header__active":
        section__home.style.zIndex = "5";
        section__vistaMapa.style.zIndex = "10";
        section__graficador.style.zIndex = "5";
        section__login.style.zIndex = "5";
        section__particular.style.zIndex = "5";
        break;
      case "graficador__container header__active":
        section__home.style.zIndex = "5";
        section__vistaMapa.style.zIndex = "5";
        section__graficador.style.zIndex = "10";
        section__login.style.zIndex = "5";
        section__particular.style.zIndex = "5";
        break;
      case "login__container header__active":
        section__home.style.zIndex = "5";
        section__vistaMapa.style.zIndex = "5";
        section__graficador.style.zIndex = "5";
        section__login.style.zIndex = "10";
        section__particular.style.zIndex = "5";
        break;
    }
  }
});
