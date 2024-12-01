import { addClassName, getFromStorage, removeClassName, saveToStorage } from "../../controllers/utils.js";
import { CLASSNAME, LOCALSTORAGE } from "../../settings.js";

const header = document.getElementById("header");
const main = document.getElementById("content");

//navbar
const navLinks = header.querySelectorAll(".nav-list-js li button");
const sections = main.querySelectorAll("section");

let currSecIndex = getFromStorage(LOCALSTORAGE.currentSectionIndex) || 0;

//auth
const authName = header.querySelector(".auth-name-js");
const logoutBtn = header.querySelector(".logout-btn-js");

function responsiveHeader(username) {
  responsiveNavBar();
  renderNavBar();
  renderAuthName(username);
  responsiveLogoutBtn();
}

function responsiveNavBar() {
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      currSecIndex = link.dataset.section - 1;
      saveToStorage(LOCALSTORAGE.currentSectionIndex, currSecIndex);
      
      renderNavBar();
    });
  });
}

function renderNavBar() {
  sections.forEach((section, index) => {
    if(index === currSecIndex) {
      addClassName(navLinks[index], CLASSNAME.btnChoose);
      section.style.display = "block";
    } else {
      removeClassName(navLinks[index], CLASSNAME.btnChoose);
      section.style.display = "none";
    }
  });
}

function renderAuthName(username) {
  authName.innerHTML = username;
}

function responsiveLogoutBtn() {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(LOCALSTORAGE.userAuth);
    location.reload(); //reload page
  });
}

export default responsiveHeader;