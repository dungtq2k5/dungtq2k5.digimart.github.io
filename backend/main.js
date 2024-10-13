import { default as activateResAll } from "./responsive.js";
import { default as renderProducts } from "./product.js";
import { default  as search } from "./search.js";
import { renderCategories } from "./categories.js";
import { 
  responsiveAuthBtn as authBtn, 
  responsiveRegisterBtn as resigsterBtn, 
  responsiveLoginBtn as loginBtn,
  responsiveLogoutBtn as logoutBtn,
  registerUser,
} from "./auth.js";
// import { getData } from "../assets/data/products.js";


// activateResAll();
search();

authBtn();
loginBtn();
logoutBtn();
resigsterBtn();
registerUser();

renderCategories();
renderProducts();


