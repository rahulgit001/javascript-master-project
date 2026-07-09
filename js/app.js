/* =========================================================
   app.js — STEP 8: Global glue code
   Loaded LAST on every page, after utils/storage/api/
   products/cart/auth/validation. Handles things that are
   common to every page: navbar state, mobile menu toggle,
   active nav link, footer year, etc.
   ========================================================= */

/**
 * Highlight the current page's nav link based on the URL.
 */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  qsa(".nav-link").forEach((link) => {
    const linkPage = link.getAttribute("href");
    link.classList.toggle("active", linkPage === currentPage);
  });
}

/**
 * Toggle the mobile hamburger menu.
 */
function initMobileMenu() {
  const toggleBtn = qs("#menu-toggle");
  const nav = qs("#nav-menu");
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggleBtn.classList.toggle("open");
  });

  // Close menu when a link is clicked (nice on mobile)
  qsa(".nav-link", nav).forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

/**
 * Show login/logout state in the navbar depending on whether
 * someone's logged in.
 */
function updateAuthNav() {
  const authLink = qs("#nav-auth-link");
  if (!authLink) return;

  const user = getCurrentUser();
  if (user) {
    authLink.textContent = user.name.split(" ")[0];
    authLink.setAttribute("href", "profile.html");
  } else {
    authLink.textContent = "Login";
    authLink.setAttribute("href", "login.html");
  }
}

/**
 * Wire up the navbar search bar to redirect to products.html
 * with a query string, e.g. products.html?q=headphones
 */
function initNavbarSearch() {
  const form = qs("#navbar-search-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = qs("#navbar-search-input", form);
    const term = input.value.trim();
    if (!term) return;
    window.location.href = `products.html?q=${encodeURIComponent(term)}`;
  });
}

/**
 * If we landed on products.html via a navbar search (?q=...),
 * pre-fill the search box and trigger the filter.
 */
function applySearchFromQueryString() {
  const params = new URLSearchParams(window.location.search);
  const term = params.get("q");
  if (!term) return;

  const searchInput = qs("#product-search");
  if (searchInput) {
    searchInput.value = term;
    searchInput.dispatchEvent(new Event("input"));
  }
}

function setFooterYear() {
  const yearEl = qs("#footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNavLink();
  initMobileMenu();
  updateAuthNav();
  initNavbarSearch();
  applySearchFromQueryString();
  setFooterYear();
});

/* -----------------------------------------------------------
   📚 LEARNING CHECKPOINT — you've now built a full mini app!
   - Trace one full user flow end-to-end: type in navbar search
     -> app.js redirects -> products.js reads ?q= -> api.js
     filters -> storage.js/cart.js on "Add to Cart".
   - Try adding a "Recently viewed" feature using storage.js.
----------------------------------------------------------- */