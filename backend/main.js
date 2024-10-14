import { default as activateResAll } from "./responsive.js";
import { navigationProducts, default as renderProducts } from "./product.js";
import { default  as resSearch } from "./search.js";
import { renderCategories } from "./categories.js";
import { 
  responsiveAuthBtn as resAuthBtn, 
  responsiveRegisterBtn as resResgisterBtn, 
  responsiveLoginBtn as resLoginBtn,
  logoutUser,
  registerUser, 
  loginUser
} from "./auth.js";
// import { getData } from "../assets/data/products.js";


// activateResAll();
// resSearch();


renderCategories();
renderProducts();
navigationProducts();

