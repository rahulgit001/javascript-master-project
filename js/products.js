/* =========================================================
   products.js — STEP 7: Product grid rendering + filters
   Loaded AFTER api.js, storage.js, utils.js. Runs on
   index.html (featured products) and products.html (full grid
   with filters/search/sort).
   ========================================================= */

let currentFilters = {
  category: "all",
  search: "",
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: "",
};

/**
 * Build the HTML for a single product card.
 */
function renderProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.id = product.id;

  const inWishlist = getWishlist().includes(product.id);

  card.innerHTML = `
    <button class="wishlist-btn ${inWishlist ? "active" : ""}" aria-label="Toggle wishlist">
      ${inWishlist ? "❤️" : "🤍"}
    </button>
    <img src="${product.image}" alt="${product.name}" class="product-image" />
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-category">${product.category}</p>
      <p class="product-rating">⭐ ${product.rating.toFixed(1)}</p>
      <p class="product-price">${formatCurrency(product.price)}</p>
      <button class="add-to-cart-btn" ${product.stock === 0 ? "disabled" : ""}>
        ${product.stock === 0 ? "Out of stock" : "Add to Cart"}
      </button>
    </div>
  `;

  return card;
}

/**
 * Render a list of products into a given container element.
 */
function renderProductGrid(products, containerEl) {
  if (!containerEl) return;

  containerEl.innerHTML = "";

  if (products.length === 0) {
    containerEl.innerHTML = `<p class="no-results">No products match your filters.</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  products.forEach((product) => fragment.appendChild(renderProductCard(product)));
  containerEl.appendChild(fragment);
}

/**
 * Event delegation for "Add to Cart" and wishlist buttons on the grid.
 */
function initProductGridInteractions(containerEl, productsById) {
  if (!containerEl) return;

  containerEl.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    if (!card) return;
    const product = productsById.get(card.dataset.id);
    if (!product) return;

    if (e.target.matches(".add-to-cart-btn")) {
      addToCart(product, 1);
      updateCartBadge();
      showToast(`${product.name} added to cart.`, "success");
    }

    if (e.target.matches(".wishlist-btn")) {
      toggleWishlist(product.id);
      const nowActive = getWishlist().includes(product.id);
      e.target.classList.toggle("active", nowActive);
      e.target.textContent = nowActive ? "❤️" : "🤍";
    }
  });
}

/**
 * Build category filter buttons dynamically from the product data.
 */
async function initCategoryFilters(onChange) {
  const filterBar = qs("#category-filters");
  if (!filterBar) return;

  const categories = await fetchCategories();

  filterBar.innerHTML = `<button class="filter-btn active" data-category="all">All</button>`;
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.category = cat;
    btn.textContent = cat;
    filterBar.appendChild(btn);
  });

  filterBar.addEventListener("click", (e) => {
    if (!e.target.matches(".filter-btn")) return;

    qsa(".filter-btn", filterBar).forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    currentFilters.category = e.target.dataset.category;
    onChange();
  });
}

/**
 * Wire up the search input (debounced) and sort dropdown.
 */
function initSearchAndSort(onChange) {
  const searchInput = qs("#product-search");
  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce((e) => {
        currentFilters.search = e.target.value;
        onChange();
      }, 300)
    );
  }

  const sortSelect = qs("#sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentFilters.sortBy = e.target.value;
      onChange();
    });
  }
}

/**
 * Wire up min/max price range inputs.
 */
function initPriceRange(onChange) {
  const minInput = qs("#price-min");
  const maxInput = qs("#price-max");
  if (!minInput && !maxInput) return;

  const handlePriceChange = () => {
    currentFilters.minPrice = minInput?.value ? Number(minInput.value) : undefined;
    currentFilters.maxPrice = maxInput?.value ? Number(maxInput.value) : undefined;
    onChange();
  };

  if (minInput) minInput.addEventListener("change", handlePriceChange);
  if (maxInput) maxInput.addEventListener("change", handlePriceChange);
}

/**
 * Main entry point for products.html: fetch + render + wire filters.
 */
async function initProductsPage() {
  const grid = qs("#products-grid");
  if (!grid) return;

  const refresh = async () => {
    const products = await fetchFilteredProducts(currentFilters);
    const productsById = new Map(products.map((p) => [p.id, p]));
    renderProductGrid(products, grid);
    initProductGridInteractions(grid, productsById);
  };

  await initCategoryFilters(refresh);
  initSearchAndSort(refresh);
  initPriceRange(refresh);
  await refresh();
}

/**
 * Entry point for index.html: show a handful of featured products.
 */
async function initFeaturedProducts() {
  const grid = qs("#featured-products-grid");
  if (!grid) return;

  const products = await fetchProducts();
  const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const productsById = new Map(featured.map((p) => [p.id, p]));

  renderProductGrid(featured, grid);
  initProductGridInteractions(grid, productsById);
}

document.addEventListener("DOMContentLoaded", () => {
  initProductsPage();
  initFeaturedProducts();
});

/* -----------------------------------------------------------
   📚 LEARNING CHECKPOINT before moving to app.js:
   - Why is currentFilters a module-level object instead of
     being passed around as a function argument everywhere?
   - Try adding a "clear filters" button that resets
     currentFilters and re-runs refresh().
----------------------------------------------------------- */