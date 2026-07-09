/* =========================================================
   api.js — STEP 3: Fetching data (async/await, fetch, promises)
   Loaded AFTER storage.js. This is the ONLY file allowed to
   call fetch(). Everything else asks api.js for data.
   ========================================================= */

const PRODUCTS_URL = "data/products.json";

// Simple in-memory cache so we don't re-fetch on every page nav
// within the same session.
let _productsCache = null;

/**
 * Fetch all products from data/products.json.
 * Returns a Promise<Array<Product>>.
 */
async function fetchProducts() {
  if (_productsCache) return _productsCache;

  try {
    const response = await fetch(PRODUCTS_URL);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    _productsCache = data;
    return data;
  } catch (err) {
    console.error("fetchProducts failed:", err);
    showToast("Couldn't load products. Please try again.", "error");
    return [];
  }
}

/**
 * Fetch a single product by id.
 * Reuses the cached list if we already have it.
 */
async function fetchProductById(productId) {
  const products = await fetchProducts();
  return products.find((p) => p.id === productId) || null;
}

/**
 * Fetch products filtered by category, search term, and price range.
 * Filtering happens client-side since our "backend" is a static JSON file.
 *
 * filters = { category, search, minPrice, maxPrice, sortBy }
 * sortBy: "priceAsc" | "priceDesc" | "rating" | "name"
 */
async function fetchFilteredProducts(filters = {}) {
  const { category, search, minPrice, maxPrice, sortBy } = filters;
  let products = await fetchProducts();

  if (category && category !== "all") {
    products = products.filter((p) => p.category === category);
  }

  if (search) {
    const term = search.trim().toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  if (typeof minPrice === "number") {
    products = products.filter((p) => p.price >= minPrice);
  }

  if (typeof maxPrice === "number") {
    products = products.filter((p) => p.price <= maxPrice);
  }

  switch (sortBy) {
    case "priceAsc":
      products = [...products].sort((a, b) => a.price - b.price);
      break;
    case "priceDesc":
      products = [...products].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      products = [...products].sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      products = [...products].sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  return products;
}

/**
 * Get the list of unique categories, for building filter buttons.
 */
async function fetchCategories() {
  const products = await fetchProducts();
  const categories = products.map((p) => p.category);
  return [...new Set(categories)];
}

/* -----------------------------------------------------------
   📚 LEARNING CHECKPOINT before moving to products.js:
   - Why is fetchProducts() wrapped in try/catch?
   - What's the difference between .then()/.catch() chaining
     and async/await? Try rewriting fetchProducts with .then().
   - Why cache in a module-level variable instead of localStorage?
----------------------------------------------------------- */