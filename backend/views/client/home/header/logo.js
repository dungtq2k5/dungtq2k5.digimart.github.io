import { LOCALSTORAGE } from "../../../../settings.js";


const header = document.getElementById("header");
const logo = header.querySelector(".logo-js");


function responsiveLogo() {
  logo.addEventListener("click", () => {
    //refresh homepage
    localStorage.removeItem(LOCALSTORAGE.categoryHidden);
    localStorage.removeItem(LOCALSTORAGE.categoryCheckedIndex);
    localStorage.removeItem(LOCALSTORAGE.productsList);
    localStorage.removeItem(LOCALSTORAGE.currentProductPagination);
  });
}

export default responsiveLogo;