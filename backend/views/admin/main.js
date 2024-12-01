import { isSuperUser, userAuthenticated } from "../../controllers/users/users.js";
import { genEmailToUsername } from "../../controllers/utils.js";
import { renderAuthForm } from "./auth.js";
import responsiveHeader from "./header.js";
import {
  renderItems as renderUsers,
  responsiveCreateBtn as resCreateUserBtn
} from "./users.js";
import { 
  renderItems as renderProducts, 
  responsiveCreateBtn as resCreateProductBtn 
} from "./products.js";
import renderPackagesManagement from "./orders.js";
import renderProductsAnalysis from "./analysis/products.js";
import renderCustomersAnalysis from "./analysis/customers.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = userAuthenticated();
  
  if(!(user && isSuperUser(user.id))) {
    renderAuthForm();
  } else {
    console.log("Login to admin page success");
    responsiveHeader(genEmailToUsername(user.email));
  
    //users
    renderUsers();
    resCreateUserBtn();
  
    //products
    renderProducts();
    resCreateProductBtn();
  
    //packages
    renderPackagesManagement();
  
    //products analysis
    renderProductsAnalysis();
  
    //customers analysis
    renderCustomersAnalysis();
  }
});
