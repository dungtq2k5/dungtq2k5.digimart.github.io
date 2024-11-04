import {
  userAuthenticated,
  logoutUser,
} from "../../../../../controllers/users.js";
import { hideElements, showElements } from "../../../../../controllers/utils.js";


const logoutContainer = document.getElementById("logout");
const logoutBtn = logoutContainer.querySelector(".logout-btn-js");
const logoutName = logoutContainer.querySelector(".logout-name-js");


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

function showLogoutBtn(username) {
  logoutName.innerHTML = username;
  showElements(logoutContainer);
  console.log("Page refresh but user is already login");
}

function hideLogoutBtn() {
  logoutName.innerHTML = "";
  hideElements(logoutContainer);
}

export default responsiveLogoutBtn;
export { showLogoutBtn, hideLogoutBtn };