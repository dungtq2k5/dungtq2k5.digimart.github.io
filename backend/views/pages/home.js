// import { default as activateResAll } from "./responsive.js";
import { 
  default as renderProducts,
  responsiveNavigationProducts as resNavProducts
} from "../product.js";
import { default  as resSearch } from "../search.js";
import { renderCategories } from "../categories.js";
import { 
  responsiveAuthBtn as resAuthBtn, 
  responsiveRegisterBtn as resResgisterBtn, 
  responsiveLoginBtn as resLoginBtn,
  logoutUser,
  registerUser, 
  loginUser,
  responsiveAuthBtn
} from "../auth.js";
// import { renderCartPopUp } from "./cart.js";
// import { getData } from "../assets/data/products.js";



// activateResAll();
resSearch();

resAuthBtn();
resResgisterBtn();
responsiveAuthBtn();
resLoginBtn();

registerUser();
logoutUser();
loginUser();

// renderCartPopUp();

renderCategories();
renderProducts();
resNavProducts();