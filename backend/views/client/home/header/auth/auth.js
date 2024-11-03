import { hideElements, showElements } from "../../../../../controllers/utils.js";
import { CLASSNAME } from "../../../../../settings.js";


const authBtn = document.getElementById("header-auth-profile");
const authPopup = document.getElementById("header-auth-profile-popup");


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