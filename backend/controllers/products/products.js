import products from "../../../assets/models/products/products.js";
import {
  MIN_PRODUCT_PRICE,
  MAX_PRODUCT_PRICE,
  LOCALSTORAGE,
} from "../../settings.js";
import { getFromStorage, includesSubArr, saveToStorage } from "../utils.js";
import { getBrandDetail } from "./brands.js";

export function getProductsList(from = 0, to = products.length) {
  //potential bugs
  if (from > to) [from, to] = [to, from];
  return (
    getFromStorage(LOCALSTORAGE.productsList) || getPlainProductsList()
  ).slice(from, to);
}

export function getPlainProductsList(from = 0, to = products.length) {
  if (from > to) [from, to] = [to, from];
  return products.slice(from, to);
}

export function getProductAmount() {
  return getProductsList().length;
}

export function getProductDetail(id, productsList=getPlainProductsList()) {
  const findIndex = productsList.findIndex((item) => item.id === id);

  if (findIndex !== -1) return productsList[findIndex];
  console.error(`Product with an id ${id} not found!`);
  return -1;
}

export function deleteProduct(id) {
  const productList = getProductsList();
  const findIndex = productList.findIndex(item => item.id === id);

  if(findIndex !== -1) {
    productList.splice(findIndex, 1);
    saveToStorage(LOCALSTORAGE.productsList, productList);
    console.log(`Delete product with an id ${id}`);
    return true;
  }

  console.error(`Product with an id ${id} not found!`);
  return false;
}

export function updateProduct(id, product) { //update all props except id
  const productsList = getProductsList();
  const findIndex = productsList.findIndex(product => product.id === id);

  if(findIndex !== -1) {
    product["id"] = productsList[findIndex].id;
    productsList[findIndex] = product;

    saveToStorage(LOCALSTORAGE.productsList, productsList);
    console.log("product updated");
    return true;
  };

  console.error(`Product with an id ${id} not found`);
  return false;
}

export function checkProductExist(id) {
  const existingProduct = getPlainProductsList().find((item) => item.id === id);
  return existingProduct !== undefined;
}

export function filterProducts(
  productsList = getPlainProductsList(),
  value = "",
  categories = [],
  minPrice = MIN_PRODUCT_PRICE,
  maxPrice = MAX_PRODUCT_PRICE
) {
  minPrice = Number(minPrice);
  maxPrice = Number(maxPrice);

  if (minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];

  //by val
  if (value != "") {
    productsList = productsList.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    // console.log(`filter val ${value}`);
  }

  //by category & brand
  if (categories.length > 0) {
    productsList = productsList.filter((item) =>
      includesSubArr(item.typesId, categories)
    );
    // console.log(`filter categories ${categories}`);
  }

  //by price
  productsList = productsList.filter(
    (item) => Number(item.price) >= minPrice && Number(item.price) <= maxPrice
  ); 
  // console.log(`filter price range ${minPrice}, ${maxPrice}`);

  // console.log(productsList);

  return productsList;
}

export function filterProductsByBrand(
  productsList = getPlainProductsList(),
  brandId
) {
  const brand = getBrandDetail(brandId);
  return productsList.filter((item) => item.brandId === brand.id);
}
