import brands from "../../../assets/models/products/brands.js";

export function getBrandsList() {
  return brands;
}

export function getBrandDetail(id) {
  const findIndex = getBrandsList().findIndex(brand => brand.id === id);
  if(findIndex !== -1) return getBrandsList()[findIndex];
  console.error(`Brand with an id ${id} not found!`);
  return -1;
}

