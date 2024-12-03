export const IMG_ROOT_PATH = "./assets/img/products"; //relative to index.html
export const IMG_TYPE = "webp";
export const IMG_SIZE = "650"; //px
export const IMG_DEFAULT = "default"

export const MAX_ITEM_SUGGESTION = 5;
export const MAX_ITEM_CART_POPUP_RENDERED = 3;
export const MAX_PRODUCT_RENDERED = 10;
export const MILI_DAY_STEP = 24 * 60 * 60 * 1000;

export const CLASSNAME = { //relative to css classes
  hide: "hide--g",
  // checked: "checked",
  bgBlue: "bg--blue--g",
  bgWhite: "bg--white--g",
  btnDisable: "btn--forbidden--g",
  btnChoose: "btn--choose--g",
}

export const MSG = {
  emailInvalid: "Invalid email.",
  phoneInvalid: "Invalid phone number.",
  invalidCredential: "Invalid credentials, can't login&#33;",

  emailTaken: "This email is already taken.",
  phoneTaken: "This phone number is already taken.",
  
  noProductFound: "Sorry, no products found&#33;",
  nothingInCart: "Your shopping cart is empty",
  nothingInOrders: "No orders yet&#33;",

  addToCartSuccess: "Added success &#10003;",
  addToCart: "Add to cart",
}

export const LOCALSTORAGE = {
  productsList: "productsList",
  productsFilteredList: "productsFilteredList",

  usersList: "usersList",
  userAuth: "userAuth",

  cartsList: "cartsList",
  allItemSelected: "allItemSelected",

  ordersList: "ordersList",
  ordersFilteredList: "ordersFilteredList",
  dateStart: "dateStart",
  dateEnd: "dateEnd",
  packStatesIdListLookup: "packStatesIdListLookup",

  deliveryAddressList: "deliveryAddressList",

  categoryCheckedIndex: "categoryCheckedIndex",
  categoryHidden: "categoryHidden",

  currentProductPagination: "currentProductPagination",

  currentSectionIndex: "currentSectionIndex",

  analysisDateStart: "analysisDateStart",
  analysisDateEnd: "analysisDateEnd",

  analysisCustomersDateStart: "analysisCustomersDateStart",
  analysisCustomersDateEnd: "analysisCustomersDateEnd",
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
