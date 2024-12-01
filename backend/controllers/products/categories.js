import categories from "../../../assets/models/products/categories.js";

export function getCategoriesList() {
  return categories;
}

export function getCategoryDetail(id) {
  const existingCategory = getCategoriesList().find(category => category.id === id);

  return existingCategory 
    ? existingCategory
    : console.error(`Category with an id ${id} not found`);
}
