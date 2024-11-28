import products from "../../../assets/models/products/products.js";
import {
  MIN_PRODUCT_PRICE,
  MAX_PRODUCT_PRICE,
  LOCALSTORAGE,
} from "../../settings.js";
import { generateUID, getFromStorage, includesSubArr, saveToStorage } from "../utils.js";
import { getBrandDetail } from "./brands.js";
import { filterOrdersList, getEarliestOrderPlacedDate, getEarliestOrderReceivedDate, getOrdersList } from "../orders.js";
import { isDelivered } from "../delivery/states.js";


function getPlainProductsList(from = 0, to = products.length) {
  if (from > to) [from, to] = [to, from];
  return products.slice(from, to);
}


export function getProductsList(from, to) {
  if (from > to) [from, to] = [to, from];
  return (
    getFromStorage(LOCALSTORAGE.productsList) || getPlainProductsList()
  ).slice(from, to);
}

export function getProductsFilteredList(from, to) {
  if (from > to) [from, to] = [to, from];
  return (
    getFromStorage(LOCALSTORAGE.productsFilteredList) || getProductsList()
  ).slice(from, to);
}

export function getProductAmount(productsList=getProductsFilteredList()) {
  return productsList.length;
}

export function getProductDetail(id, productsList=getProductsList()) {
  const findIndex = productsList.findIndex((item) => item.id === id);

  if (findIndex !== -1) return productsList[findIndex];
  console.error(`Product with an id ${id} not found!`);
  return -1;
}

export function addProduct(product, productsList=getProductsList()) {
  product.id = generateUID();
  product.sold = "0";
  productsList.push(product);
  saveToStorage(LOCALSTORAGE.productsList, productsList);

  return product;
}

export function deleteProduct(id, productsList=getProductsList()) {
  const findIndex = productsList.findIndex(item => item.id === id);

  if(findIndex !== -1) {
    productsList.splice(findIndex, 1);
    saveToStorage(LOCALSTORAGE.productsList, productsList);
    console.log(`Delete product with an id ${id}`);
    return true;
  }

  console.error(`Product with an id ${id} not found!`);
  return false;
}

export function updateProduct(id, product, productsList=getProductsList()) { //update all props except id
  const findIndex = productsList.findIndex(product => product.id === id);

  if(findIndex !== -1) {
    product.id = productsList[findIndex].id;
    productsList[findIndex] = product;

    saveToStorage(LOCALSTORAGE.productsList, productsList);
    console.log("product updated");
    return true;
  };

  console.error(`Product with an id ${id} not found`);
  return false;
}

// export function updateProductImg(id, imgLink) {
//   const productsList = getProductsList();
//   const findIndex = productsList.findIndex()
// }

export function checkProductExist(id, productsList=getProductsList()) {
  const existingProduct = productsList.find((item) => item.id === id);
  return existingProduct !== undefined;
}

export function filterProducts(
  value = "",
  categories = [],
  minPrice = MIN_PRODUCT_PRICE,
  maxPrice = MAX_PRODUCT_PRICE,
  productsList = getProductsList()
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
  brandId,
  productsList = getProductsList()
) {
  const brand = getBrandDetail(brandId);
  return productsList.filter((item) => item.brandId === brand.id);
}


export function getProductSoldList(dateStart=getEarliestOrderReceivedDate(), dateEnd=new Date(), ordersList=filterOrdersList({statesIdList: ["3"]})) {
  /**
   * filtered by received datetime, delivery state is delivered
   * return list of objs, each contain productId and quantity(sold)
   */

  let result = [];

  if(!(dateStart instanceof Date)) dateStart = new Date(parseInt(dateStart));
  if(!(dateEnd instanceof Date)) dateEnd = new Date(parseInt(dateEnd));
  if(dateStart > dateEnd) [dateStart, dateEnd] = [dateEnd, dateStart];
  
  ordersList.forEach(order => {
    const receivedDate = new Date(order.receivedDate);
    
    if(receivedDate >= dateStart && receivedDate <= dateEnd) {
      const packages = order.packages;

      packages.forEach(pack => {
        const copiedPack = {...pack}; //avoid Pass-by-Reference

        const findIndex = result.findIndex(item => item.productId === copiedPack.productId);
        if(findIndex !== -1) { //exist -> accum quant
          const currentQuant = Number(result[findIndex].quantity);
          result[findIndex].quantity = String(currentQuant + Number(copiedPack.quantity));
        } else {
          result.push(copiedPack);
        }
      });
    }
  });

  getProductsList().forEach(product => {
    const existingProduct = result.find(item => item.productId === product.id);
    if(!existingProduct) {
      result.push({
        productId: product.id,
        quantity: "0"
      });
    }
  });

  return result;
}

export function getTopProductsSoldList(dateStart, dateEnd) {
  const productsSoldList = getProductSoldList(dateStart, dateEnd);
  const maxSold = Math.max(...productsSoldList.map(item => item.quantity));

  return maxSold != 0
    ? productsSoldList.filter(item => item.quantity == maxSold)
    : [];
}

export function getLowProductsSoldList(dateStart, dateEnd) {
  const productsSoldList = getProductSoldList(dateStart, dateEnd);
  const minSold = Math.min(...productsSoldList.map(item => item.quantity));
  // console.log(productsSoldList);
  // console.log(minSold);

  return productsSoldList.filter(item => item.quantity == minSold);
}