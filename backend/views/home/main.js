import { userAuthenticated } from "../../controllers/users.js";
import { default as logo } from "./header/logo.js";
import { default as search } from "./header/search.js";
import { default as cartIcon } from "./header/cart-icon.js";
import { default as ordersIcon } from "./header/orders-icon.js";
import {
  default as loginBtn,
  hideLoginBtn,
  showLoginBtn,
} from "./header/auth/login.js";
import {
  default as registerBtn,
  hideRegisterBtn,
  showRegisterBtn,
} from "./header/auth/register.js";
import {
  default as logoutBtn,
  hideLogoutBtn,
  showLogoutBtn,
} from "./header/auth/logout.js";
import {
  default as authBtn,
  hideAuthBtn,
  showAuthBtn,
} from "./header/auth/auth.js";
import { renderCategories } from "./categories.js";
import 
renderProducts, 
{ responsivePaginatProducts } 
from "./product.js";
import { genEmailToUsername } from "../../controllers/utils.js";


const user = userAuthenticated();

//responsive header
logo();
search();
cartIcon();
ordersIcon();
loginBtn();
registerBtn();
logoutBtn();
authBtn();

if (user) {
  hideLoginBtn();
  hideRegisterBtn();
  hideAuthBtn();
  showLogoutBtn(genEmailToUsername(user.email));
} else {
  hideLogoutBtn();
  showLoginBtn();
  showRegisterBtn();
  showAuthBtn();
}

//responsive & render menu(categories)
renderCategories();

//responsive & render products
renderProducts();
responsivePaginatProducts();
