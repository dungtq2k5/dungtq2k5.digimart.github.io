export const IMG_ROOT_PATH = "./assets/img/products"; //relative to index.html
export const IMG_TYPE = "webp";
export const IMG_SIZE = "650"; //px
export const IMG_DEFAULT = "default"

export const MAX_ITEM_SUGGESTION = 5;
export const MAX_ITEM_CART_POPUP_RENDERED = 3;
export const MIN_PRODUCT_PRICE = 0, MAX_PRODUCT_PRICE = 130000; //cents

export const CLASSNAME = { //relative to css classes
  hide: "hide--g",
  // checked: "checked",
  bgBlue: "bg--blue--g",
  bgWhite: "bg--white--g",
  btnDisable: "btn--forbidden--g",
  btnChoose: "btn--choose--g",
}

export const MAX_PRODUCT_RENDERED = 5;

export const MSG = {
  emailInvalid: "Invalid email.",
  phoneInvalid: "Invalid phone number.",
  invalidCredential: "Invalid credentials, can't login!",

  emailTaken: "This email is already taken.",
  phoneTaken: "This phone number is already taken.",
  
  noProductFound: "Sorry, no products found!",
  nothingInCart: "Your shopping cart is empty",
  nothingInOrders: "No orders yet!",

  addToCartSuccess: "Added success",
  addToCart: "Add to cart",
}

export const LOCALSTORAGE = {
  productsList: "productsList",
  productsFilteredList: "productsFilteredList",
  usersList: "usersList",
  cartsList: "cartsList",
  ordersList: "ordersList",
  deliveryAddressList: "deliveryAddressList",

  userAuth: "userAuth",
  categoryCheckedIndex: "categoryCheckedIndex",
  currentProductPagination: "currentProductPagination",
  categoryHidden: "categoryHidden",
  allItemSelected: "allItemSelected",

  adminAuth: "adminAuth",
  currentSectionIndex: "currentSectionIndex",
}

export const PAGES = {
  home: "index.html",
  cart: "cart.html",
  orders: "orders.html",
  admin: "admin.html",
}

export const PLACEHOLDERS = {
  name: "nikolatesla123",
  email: "nikola.tesla@gmail.com",
  password: "password123",
  phone: "0123456789",
  address: "123 Wall Street, Los",
}