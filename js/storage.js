/* =========================================================
   storage.js — STEP 2: localStorage persistence layer
   Loaded AFTER utils.js. No DOM manipulation here — only
   read/write to localStorage. Everything else (cart.js,
   auth.js, products.js) talks to localStorage through THIS
   file, never directly.
   ========================================================= */

const STORAGE_KEYS = {
  CART: "jsmp_cart",
  USERS: "jsmp_users",
  CURRENT_USER: "jsmp_current_user",
  WISHLIST: "jsmp_wishlist",
};

/**
 * Generic safe getter — returns fallback if key missing or JSON invalid.
 */
function storageGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`storageGet failed for key "${key}":`, err);
    return fallback;
  }
}

/**
 * Generic safe setter.
 */
function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`storageSet failed for key "${key}":`, err);
    return false;
  }
}

function storageRemove(key) {
  localStorage.removeItem(key);
}

/* ---------------- Cart ---------------- */

/**
 * Cart shape: [{ id, productId, name, price, image, qty }]
 */
function getCart() {
  return storageGet(STORAGE_KEYS.CART, []);
}

function saveCart(cart) {
  storageSet(STORAGE_KEYS.CART, cart);
}

function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === product.id);

  if (existing) {
    existing.qty = clamp(existing.qty + qty, 1, 99);
  } else {
    cart.push({
      id: generateId(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: clamp(qty, 1, 99),
    });
  }

  saveCart(cart);
  return cart;
}

function updateCartItemQty(lineItemId, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === lineItemId);
  if (!item) return cart;
  item.qty = clamp(qty, 1, 99);
  saveCart(cart);
  return cart;
}

function removeFromCart(lineItemId) {
  const cart = getCart().filter((i) => i.id !== lineItemId);
  saveCart(cart);
  return cart;
}

function clearCart() {
  saveCart([]);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartItemCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

/* ---------------- Users / Auth ---------------- */

/**
 * User shape: { id, name, email, passwordHash }
 * NOTE: this is a learning project. Passwords are only
 * lightly hashed client-side — never do this in production.
 */
function getUsers() {
  return storageGet(STORAGE_KEYS.USERS, []);
}

function saveUsers(users) {
  storageSet(STORAGE_KEYS.USERS, users);
}

function findUserByEmail(email) {
  return getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

function getCurrentUser() {
  return storageGet(STORAGE_KEYS.CURRENT_USER, null);
}

function setCurrentUser(user) {
  storageSet(STORAGE_KEYS.CURRENT_USER, user);
}

function logoutUser() {
  storageRemove(STORAGE_KEYS.CURRENT_USER);
}

/* ---------------- Wishlist ---------------- */

function getWishlist() {
  return storageGet(STORAGE_KEYS.WISHLIST, []);
}

function toggleWishlist(productId) {
  const wishlist = getWishlist();
  const idx = wishlist.indexOf(productId);
  if (idx === -1) {
    wishlist.push(productId);
  } else {
    wishlist.splice(idx, 1);
  }
  storageSet(STORAGE_KEYS.WISHLIST, wishlist);
  return wishlist;
}

/* -----------------------------------------------------------
   📚 LEARNING CHECKPOINT before moving to api.js:
   - Why does everything funnel through storageGet/storageSet
     instead of calling localStorage directly everywhere?
   - What happens if localStorage is full or disabled
     (e.g. private browsing)? Look at the try/catch above.
----------------------------------------------------------- */