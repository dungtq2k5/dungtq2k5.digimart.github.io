function calculatePages(totalProducts, maxProductsPerPage) {
  // Ensure both arguments are numbers
  totalProducts = parseInt(totalProducts);
  maxProductsPerPage = parseInt(maxProductsPerPage);

  // Handle invalid inputs
  if (isNaN(totalProducts) || isNaN(maxProductsPerPage) || totalProducts <= 0 || maxProductsPerPage <= 0) {
    return 0;
  }

  // Calculate the number of pages needed
  const pages = Math.ceil(totalProducts / maxProductsPerPage);
  return pages;
}

console.log(calculatePages());