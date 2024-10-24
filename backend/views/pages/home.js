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
  renderLogoutBtn,
  responsiveCart,
  responsiveOrders,
} from "../main-header.js";
import { userAuthenticated } from "../../controllers/users.js";


const user = userAuthenticated();

//header
responsiveLogo();
responsiveCart();
responsiveOrders();
if(user) {
  renderCartAndOrdersNotifications();
  renderLogoutBtn();
  //auth
  logoutUser();

} else {
  responsiveLoginBtn();
  responsiveRegisterBtn();
  responsiveAuthBtn();
  //auth
  loginUser();
  registerUser();
}


//searching
resSearch();


//homepage content
renderCategories();
renderProducts();
resNavProducts();