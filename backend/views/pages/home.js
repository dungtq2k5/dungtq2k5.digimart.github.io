// import { default as activateResAll } from "./responsive.js";
import { 
  default as renderProducts,
  responsiveNavigationProducts as resNavProducts
} from "../product.js";
import { default  as resSearch } from "../search.js";
import { renderCategories } from "../categories.js";
import { 
  logoutUser,
  registerUser, 
  loginUser,
} from "../auth.js";
import { 
  responsiveLogo, 
  renderCartAndOrdersNotifications,
  responsiveAuthBtn,
  responsiveRegisterBtn,
  responsiveLoginBtn,
  responsiveLogoutBtn,
} from "../main-header.js";

//header
responsiveLogo();
renderCartAndOrdersNotifications();
responsiveAuthBtn();
responsiveRegisterBtn();
responsiveLoginBtn();
responsiveLogoutBtn();


//searching
resSearch();

//auth
loginUser();
registerUser();
logoutUser();


//homepage content
renderCategories();
renderProducts();
resNavProducts();