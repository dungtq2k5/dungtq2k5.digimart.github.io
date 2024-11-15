import { isSuperUser, userAuthenticated } from "../../controllers/users/users.js";
import { renderAuthForm } from "./auth.js";
import { responsiveNavBar } from "./header.js";

const user = userAuthenticated();

if(!(user && isSuperUser(user.id))) {
  renderAuthForm();
} else {
  console.log("Login to admin page success");
  responsiveNavBar();
}