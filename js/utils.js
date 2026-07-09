/* =========================================================
   utils.js — STEP 1: Core JavaScript fundamentals
   Loaded FIRST on every page (before storage/api/app).

   🎯 Concepts to practice here:
   - Variables (let/const), data types, template literals
   - Functions (declarations, arrow functions, default params)
   - Array methods: map, filter, reduce, find, sort
   - Simple pure helper functions with no DOM/storage dependency

   Everything you write here should be a small, reusable,
   TESTABLE function — no document.querySelector inside utils.js.
   ========================================================= */

/**
 * TODO: Format a number as Indian Rupee currency.
 * Example: formatCurrency(68999) -> "₹68,999"
 * Hint: Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
 */
function formatCurrency(amount) {
  // your code here
   const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
  return formatter.format(amount);
}

/**
 * TODO: Debounce a function — useful for the navbar search input
 * so it doesn't fire on every keystroke.
 * Hint: use setTimeout + clearTimeout with closures.
 */
function debounce(fn, delayMs = 300) {
  // your code here
}

/**
 * TODO: Generate a simple unique id (for cart line items, toasts, etc.)
 * Hint: Date.now() + Math.random().toString(36)
 */
function generateId() {
  // your code here
}

/**
 * TODO: Clamp a number between min and max.
 * Used by the price range slider and quantity stepper.
 */
function clamp(value, min, max) {
  // your code here
}

/**
 * TODO: Show a toast message inside #toast-container (present on every page).
 * type can be "success" | "error" | "info"
 * Hint: create a div, add classes "toast" + type, set textContent,
 * append to #toast-container, then setTimeout to remove it after ~3s.
 */
function showToast(message, type = "info") {
  // your code here
}

/**
 * TODO: A tiny helper to select one element — saves typing
 * document.querySelector everywhere.
 */
function qs(selector, scope = document) {
  // your code here
}

/**
 * TODO: A tiny helper to select multiple elements as a real array
 * (querySelectorAll returns a NodeList, not an Array).
 */
function qsa(selector, scope = document) {
  // your code here
}

/* -----------------------------------------------------------
   📚 LEARNING CHECKPOINT before moving to storage.js:
   - Can you explain the difference between var, let, const?
   - Can you explain what a "pure function" is?
   - Try: [1,2,3].map(), .filter(), .reduce() in the console
     until each one feels natural.
----------------------------------------------------------- */