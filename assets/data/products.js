import {
  MIN_PRODUCT_PRICE,
  MAX_PRODUCT_PRICE,
  LOCALSTORAGE,
} from "../../backend/settings.js";
import {
  getFromStorage,
  includesSubArr,
} from "../../backend/utils.js";


const products = [
  //11 items
  {
    "id": "1",
    "name": "Apple Watch Series 8",
    "description":
      "The latest flagship smartwatch from Apple with advanced health features and a stunning display.",
    "price": "399", //cents
    "quantity": "100",
    "img": "samsung-galaxy-watch6",
    "brandId": "1",
    "typesId": ["1","3"],
    "size": "44" //mm
  },
  {
    "id": "2",
    "name": "Samsung Galaxy Watch 6 Classic",
    "description":
      "A premium smartwatch with a rotating bezel and long-lasting battery life.",
    "price": "429",
    "quantity": "80",
    "img": "samsung-galaxy-watch6",
    "brandId": "2",
    "typesId": ["1","4"],
    "size": "42"
  },
  {
    "id": "3",
    "name": "Garmin Forerunner 255",
    "description":
      "A running-focused smartwatch with advanced GPS tracking and performance metrics.",
    "price": "349",
    "quantity": "75",
    "img": "samsung-galaxy-watch6",
    "brandId": "3",
    "typesId": ["1","3"],
    "size": "44"
  },
  {
    "id": "4",
    "name": "Fitbit Sense 2",
    "description":
      "A health-focused smartwatch with stress management tools and ECG monitoring.",
    "price": "299",
    "quantity": "90",
    "img": "samsung-galaxy-watch6",
    "brandId": "5",
    "typesId": ["1","2"],
    "size": "40",
  },
  {
    "id": "5",
    "name": "Huawei Watch GT 3 Pro",
    "description":
      "A stylish smartwatch with a sapphire crystal display and long battery life.",
    "price": "279",
    "quantity": "60",
    "img": "samsung-galaxy-watch6",
    "brandId": "6",
    "typesId": ["1","4"],
    "size": "46",
  },
  {
    "id": "6",
    "name": "Polar Vantage M2",
    "description":
      "A multisport smartwatch with advanced training features and heart rate monitoring.",
    "price": "299",
    "quantity": "55",
    "img": "samsung-galaxy-watch6",
    "brandId": "7",
    "typesId": ["1","3"],
    "size": "44"
  },
  {
    "id": "7",
    "name": "Amazfit GTR 4",
    "description":
      "A budget-friendly smartwatch with a large, AMOLED display and long battery life.",
    "price": "199",
    "quantity": "120",
    "img": "samsung-galaxy-watch6",
    "brandId": "8",
    "typesId": ["1","2"],
    "size": "46"
  },
  {
    "id": "8",
    "name": "TicWatch Pro 3",
    "description":
      "A rugged smartwatch with dual displays and long battery life.",
    "price": "249",
    "quantity": "85",
    "img": "samsung-galaxy-watch6",
    "brandId": "9",
    "typesId": ["1","3"],
    "size": "47"
  },
  {
    "id": "9",
    "name": "Withings ScanWatch Horizon",
    "description":
      "A hybrid smartwatch with a classic design and advanced health monitoring features.",
    "price": "449",
    "quantity": "40",
    "img": "samsung-galaxy-watch6",
    "brandId": "10",
    "typesId": ["1", "3"],
    "size": "42"
  },
  {
    "id": "10",
    "name": "Garmin Venu 2 Plus",
    "description":
      "A fitness-focused smartwatch with GPS tracking, music storage, and contactless payments.",
    "price": "399",
    "quantity": "70",
    "img": "samsung-galaxy-watch6",
    "brandId": "3",
    "typesId": ["1","3"],
    "size": "43"
  },
  {
    "id": "11",
    "name": "Garmin Venu 3 Plus",
    "description":
      "A fitness-focused smartwatch with GPS tracking, music storage, and contactless payments.",
    "price": "399",
    "quantity": "70",
    "img": "samsung-galaxy-watch6",
    "brandId": "3",
    "typesId": ["1","3"],
    "size": "43"
  },
];

const categories = [
  {
    "id": "1",
    "name": "smartwatch",
  },
  {
    "id": "2",
    "name": "smartband",
  },
  {
    "id": "3",
    "name": "sporty",
  },
  {
    "id": "4",
    "name": "fashion",
  },
  {
    "id": "5",
    "name": "business",
  },
];

const brands = [
  {
    "id": "1",
    "name": "apple",
  },
  {
    "id": "2",
    "name": "samsung",
  },
  {
    "id": "3",
    "name": "garmin",
  },
  {
    "id": "4",
    "name": "asus",
  },
  {
    "id": "5",
    "name": "fitbit",
  },
  {
    "id": "6",
    "name": "huawei",
  },
  {
    "id": "7",
    "name": "polar",
  },
  {
    "id": "8",
    "name": "amazfit",
  },
  {
    "id": "9",
    "name": "mobvoi",
  },
  {
    "id": "10",
    "name": "withings",
  },
];


export function getProductsList(from = 0, to = products.length) { //potential bugs
  if (from > to) [from, to] = [to, from];
  return (getFromStorage(LOCALSTORAGE.productsList) || getPlainProductsList()).slice(from, to);
}

export function getPlainProductsList(from = 0, to = products.length) {
  if (from > to) [from, to] = [to, from];
  return products.slice(from, to);
}

export function getProductAmount() {
  return getProductsList().length;
}

export function getProductDetail(id) {
  const findIndex = getProductsList().findIndex(
    (item) => item.id === id
  );
  if (findIndex !== -1) return getProductsList()[findIndex];
  console.error(`Product with an id ${id} not found!`);
  return -1;
}

export function checkProductExist(id) {
  const existingProduct = getProductsList().find(item => item.id === id);
  return existingProduct !== undefined;
}

export function filterProducts(
  productsList = getPlainProductsList(),
  value = "",
  categories = [],
  minPrice = MIN_PRODUCT_PRICE,
  maxPrice = MAX_PRODUCT_PRICE
) {
  //search engine

  if (minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];

  if (value != "") {
    //by val
    productsList = productsList.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    // console.log(`filter val ${value}`);
  }

  if (categories.length > 0) {
    //by category & brand
    productsList = productsList.filter((item) =>
      includesSubArr(item.typesId, categories)
    );
    // console.log(`filter categories ${categories}`);
  }

  productsList = productsList.filter(
    (item) => item.price >= minPrice && item.price <= maxPrice
  ); //by price
  // console.log(`filter price range ${minPrice}, ${maxPrice}`);

  return productsList;
}

export function filterProductsByBrand(
  productsList = getPlainProductsList(),
  brandId
) {
  const brand = getBrandDetail(brandId);
  return productsList.filter((item) => item.brandId === brand.id);
}

export function getCategoriesList() {
  return categories;
}


export function getBrandsList() {
  return brands;
}

export function getBrandDetail(id) {
  const findIndex = getBrandsList().findIndex(brand => brand.id === id);
  if(findIndex !== -1) return getBrandsList()[findIndex];
  console.error(`Brand with an id ${id} not found!`);
  return -1;
}

