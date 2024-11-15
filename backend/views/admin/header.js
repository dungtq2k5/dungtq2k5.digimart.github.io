import { addClassName, removeClassName } from "../../controllers/utils.js";
import { CLASSNAME } from "../../settings.js";

const header = document.getElementById("header");
const main = document.getElementById("content");

//navbar
const navLinks = header.querySelectorAll(".nav-list-js li button");
const sections = main.querySelectorAll("section");

//auth
const authName = header.querySelector(".auth-name-js");
const logoutBtn = header.querySelector(".logout-btn-js");


export function responsiveNavBar() {
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const sectionIndex = link.dataset.section - 1;

      sections.forEach((section, index) => {
        if(index === sectionIndex) {
          addClassName(navLinks[index], CLASSNAME.btnChoose);
          section.style.display = "block";
        } else {
          removeClassName(navLinks[index], CLASSNAME.btnChoose);
          section.style.display = "none";
        }
      });
    });
  });
}