import { hideElements, showElements } from "../../../../../controllers/utils.js";
import { CLASSNAME } from "../../../../../settings.js";


const header = document.getElementById("header");
const authBtn = header.querySelector(".auth-icon-js");
const authPopup = header.querySelector(".auth-popup-js");


function responsiveAuthBtn() {
  authBtn.addEventListener("click", () => {
    authPopup.classList.toggle(CLASSNAME.hide);
    // console.log("toggle");
  });
  document.addEventListener("click", (e) => {
    if (
      !authBtn.contains(e.target) &&
      !authPopup.classList.contains(CLASSNAME.hide)
    ) {
      authPopup.classList.add(CLASSNAME.hide);
      // console.log("hidden");
    }
  });
}

function showAuthBtn() {
  showElements(authBtn);
}

function hideAuthBtn() {
  hideElements(authBtn);
}

export default responsiveAuthBtn;
export { showAuthBtn, hideAuthBtn }