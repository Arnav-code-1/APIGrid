let originalProducts; // To store the original products data

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://s3.amazonaws.com/open-to-cors/assignment.json")
    .then(response => response.json())
    .then(data => {
      originalProducts = Object.values(data.products);
      // Save products data
      const products = [...originalProducts];
      // Display the first page
      displayProducts(products, 1);
      // Create pagination
      createPagination(products);
      // Populate subcategory filter
      populateSubcategoryFilter(products);
    })
    .catch(error => console.error('Error fetching data:', error));
});

function displayProducts(products, page) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Clear previous content

  // Sort products by popularity in descending order
  products.sort((a, b) => b.popularity - a.popularity);

  // Calculate start and end index for the current page
  const startIndex = (page - 1) * 100;
  const endIndex = Math.min(startIndex + 100, products.length);

  // Display products for the current page with numbering
  for (let i = startIndex; i < endIndex; i++) {
    const product = products[i];

    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const titleElement = document.createElement("div");
    titleElement.classList.add("product-title");
    titleElement.textContent = `${i + 1}. ${product.title}`; // Include numbering

    const priceElement = document.createElement("div");
    priceElement.classList.add("product-price");
    priceElement.textContent = `Price: $${product.price}`;

    const popularityElement = document.createElement("div");
    popularityElement.classList.add("product-popularity");
    popularityElement.textContent = `Popularity: ${product.popularity}`;

    productCard.appendChild(titleElement);
    productCard.appendChild(priceElement);
    productCard.appendChild(popularityElement);

    productList.appendChild(productCard);
  }
}

function createPagination(products) {
  const totalPages = Math.ceil(products.length / 100);
  const pagination = document.getElementById("pagination");

  for (let i = 1; i <= totalPages; i++) {
    const pageNumber = document.createElement("div");
    pageNumber.classList.add("page-number");
    pageNumber.textContent = i;
    pageNumber.addEventListener("click", () => {
      displayProducts(products, i);
      updateActivePage(i);
    });

    pagination.appendChild(pageNumber);
  }

  // Set the first page as active initially
  updateActivePage(1);
}

function updateActivePage(activePage) {
  const pageNumbers = document.querySelectorAll(".page-number");
  pageNumbers.forEach(pageNumber => {
    pageNumber.classList.remove("active");
    if (Number(pageNumber.textContent) === activePage) {
      pageNumber.classList.add("active");
    }
  });
}

function applyFilters() {
  const subcategoryFilterValue = document.getElementById("subcategory-filter").value;
  const titleFilterValue = document.getElementById("title-filter").value.toLowerCase();
  const priceFilterValue = parseFloat(document.getElementById("price-filter").value);
  const popularityFilterValue = parseFloat(document.getElementById("popularity-filter").value);

  const filteredProducts = originalProducts.filter(product => {
    const matchesSubcategory = !subcategoryFilterValue || product.subcategory === subcategoryFilterValue;
    const matchesTitle = !titleFilterValue || product.title.toLowerCase().includes(titleFilterValue);
    const matchesPrice = isNaN(priceFilterValue) || product.price <= priceFilterValue;
    const matchesPopularity = isNaN(popularityFilterValue) || product.popularity <= popularityFilterValue;

    return matchesSubcategory && matchesTitle && matchesPrice && matchesPopularity;
  });

  // Clear existing pagination
  clearPagination();

  // Display filtered products on the first page
  displayProducts(filteredProducts, 1);

  // Create pagination for filtered products
  createPagination(filteredProducts);
}

function clearPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
}

function populateSubcategoryFilter(products) {
  const subcategoryFilter = document.getElementById("subcategory-filter");
  const subcategories = new Set(products.map(product => product.subcategory));
  
  subcategories.forEach(subcategory => {
    const option = document.createElement("option");
    option.value = subcategory;
    option.textContent = subcategory;
    subcategoryFilter.appendChild(option);
  });
}
