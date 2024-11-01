import {
  userAuthenticated,
  logoutUser,
} from "../../../../controllers/users.js";
import { hideElements, showElements } from "../../../../controllers/utils.js";
// import { hideAuthBtn } from "./authBtn.js";
// import { hideLoginBtn } from "./loginBtn.js";
// import { hideRegisterBtn } from "./registerBtn.js";


const logoutBtn = document.getElementById("logout-btn");


function responsiveLogoutBtn() {
  logoutBtn.addEventListener("click", () => {
    if(userAuthenticated()) {
      // logoutBtn is a link when click page refresh
      logoutUser();
    } else {
      console.error("User not login yet!");
    }
  });
}

function showLogoutBtn() {
  showElements(logoutBtn);
  console.log("Page refresh but user is already login");
}

function hideLogoutBtn() {
  hideElements(logoutBtn);
}

export default responsiveLogoutBtn;
export { showLogoutBtn, hideLogoutBtn };