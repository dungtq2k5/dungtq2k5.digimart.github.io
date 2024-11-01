import {
  userAuthenticated,
  logoutUser,
} from "../../../../controllers/users.js";
import { hideElements, showElements } from "../../../../controllers/utils.js";


const logoutBtn = document.getElementById("logout-btn");
const logoutName = logoutBtn.querySelector(".logout-name-js");


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
  showElements(logoutBtn);
  console.log("Page refresh but user is already login");
}

function hideLogoutBtn() {
  logoutName.innerHTML = "";
  hideElements(logoutBtn);
}

export default responsiveLogoutBtn;
export { showLogoutBtn, hideLogoutBtn };