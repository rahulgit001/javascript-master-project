/* =========================================================
   cart.js — STEP 6: Cart page rendering + interactions
   Loaded AFTER storage.js. Runs on cart.html (and updates the
   navbar cart badge on every page — see updateCartBadge()).
   ========================================================= */

/**
 * Update the little cart count badge in the navbar (#cart-count),
 * present on every page's navbar.
 */
function updateCartBadge() {
  const badge = qs("#cart-count");
  if (!badge) return;
  const count = getCartItemCount();
  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);
}

/**
 * Build the HTML for a single cart line item row.
 */
function renderCartItem(item) {
  const li = document.createElement("li");
  li.className = "cart-item";
  li.dataset.id = item.id;

  li.innerHTML = `
    <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
    <div class="cart-item-details">
      <h3 class="cart-item-name">${item.name}</h3>
      <p class="cart-item-price">${formatCurrency(item.price)}</p>
    </div>
    <div class="cart-item-qty">
      <button class="qty-decrease" aria-label="Decrease quantity">-</button>
      <span class="qty-value">${item.qty}</span>
      <button class="qty-increase" aria-label="Increase quantity">+</button>
    </div>
    <p class="cart-item-subtotal">${formatCurrency(item.price * item.qty)}</p>
    <button class="cart-item-remove" aria-label="Remove item">🗑️</button>
  `;

  return li;
}

/**
 * Render the full cart list + totals into #cart-root.
 */
function renderCart() {
  const listEl = qs("#cart-items");
  const emptyEl = qs("#cart-empty");
  const totalEl = qs("#cart-total");
  if (!listEl) return;

  const cart = getCart();

  listEl.innerHTML = "";

  if (cart.length === 0) {
    if (emptyEl) emptyEl.classList.remove("hidden");
    listEl.classList.add("hidden");
  } else {
    if (emptyEl) emptyEl.classList.add("hidden");
    listEl.classList.remove("hidden");

    const fragment = document.createDocumentFragment();
    cart.forEach((item) => fragment.appendChild(renderCartItem(item)));
    listEl.appendChild(fragment);
  }

  if (totalEl) {
    totalEl.textContent = formatCurrency(getCartTotal());
  }

  updateCartBadge();
}

/**
 * Event delegation: one listener on the list handles qty +/-
 * and remove clicks for every row, including rows added later.
 */
function initCartInteractions() {
  const listEl = qs("#cart-items");
  if (!listEl) return;

  listEl.addEventListener("click", (e) => {
    const row = e.target.closest(".cart-item");
    if (!row) return;
    const lineItemId = row.dataset.id;
    const cart = getCart();
    const item = cart.find((i) => i.id === lineItemId);
    if (!item) return;

    if (e.target.matches(".qty-increase")) {
      updateCartItemQty(lineItemId, item.qty + 1);
      renderCart();
    } else if (e.target.matches(".qty-decrease")) {
      if (item.qty <= 1) {
        removeFromCart(lineItemId);
        showToast(`${item.name} removed from cart.`, "info");
      } else {
        updateCartItemQty(lineItemId, item.qty - 1);
      }
      renderCart();
    } else if (e.target.matches(".cart-item-remove")) {
      removeFromCart(lineItemId);
      showToast(`${item.name} removed from cart.`, "info");
      renderCart();
    }
  });

  const checkoutBtn = qs("#checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (getCart().length === 0) {
        showToast("Your cart is empty.", "error");
        return;
      }
      clearCart();
      renderCart();
      showToast("Order placed! Thank you for shopping with us.", "success");
    });
  }

  const clearBtn = qs("#clear-cart-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearCart();
      renderCart();
      showToast("Cart cleared.", "info");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  initCartInteractions();
  updateCartBadge(); // also runs on pages without #cart-items, e.g. index.html
});

/* -----------------------------------------------------------
   📚 LEARNING CHECKPOINT before moving to products.js:
   - What is "event delegation" and why do we attach ONE
     listener to #cart-items instead of one per button?
   - Try adding a "Save for later" button using the same pattern.
----------------------------------------------------------- */