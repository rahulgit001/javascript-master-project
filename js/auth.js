/* =========================================================
   auth.js — STEP 5: Login / Register logic
   Loaded AFTER storage.js and validation.js.
   Runs only on login.html / profile.html, but safe to include
   everywhere since it just wires up listeners if elements exist.

   ⚠️ Learning-project disclaimer: real auth needs a server and
   proper password hashing (bcrypt etc). This is client-side only,
   for practicing JS — not for a real production login system.
   ========================================================= */

/**
 * Extremely lightweight "hash" so we're not storing raw passwords
 * in localStorage as plain text. NOT cryptographically secure.
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}

function registerUser({ name, email, password }) {
  if (findUserByEmail(email)) {
    return { success: false, message: "An account with this email already exists." };
  }

  const user = {
    id: generateId(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: simpleHash(password),
  };

  addUser(user);
  setCurrentUser({ id: user.id, name: user.name, email: user.email });

  return { success: true, message: "Account created successfully." };
}

function loginUser({ email, password }) {
  const user = findUserByEmail(email);

  if (!user || user.passwordHash !== simpleHash(password)) {
    return { success: false, message: "Invalid email or password." };
  }

  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  return { success: true, message: `Welcome back, ${user.name}!` };
}

function handleLogout() {
  logoutUser();
  showToast("Logged out.", "info");
  window.location.href = "index.html";
}

/**
 * Wire up the login form (#login-form) if present on the page.
 */
function initLoginForm() {
  const form = qs("#login-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = qs("#login-email", form);
    const passwordInput = qs("#login-password", form);

    const { valid, errors } = validateForm({
      email: () => validateEmail(emailInput.value),
      password: () => validateRequired(passwordInput.value, "Password"),
    });

    showFieldError(emailInput, errors.email);
    showFieldError(passwordInput, errors.password);

    if (!valid) return;

    const result = loginUser({
      email: emailInput.value,
      password: passwordInput.value,
    });

    if (result.success) {
      showToast(result.message, "success");
      setTimeout(() => (window.location.href = "profile.html"), 800);
    } else {
      showToast(result.message, "error");
    }
  });
}

/**
 * Wire up the register form (#register-form) if present on the page.
 */
function initRegisterForm() {
  const form = qs("#register-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = qs("#register-name", form);
    const emailInput = qs("#register-email", form);
    const passwordInput = qs("#register-password", form);
    const confirmInput = qs("#register-confirm-password", form);

    const { valid, errors } = validateForm({
      name: () => validateName(nameInput.value),
      email: () => validateEmail(emailInput.value),
      password: () => validatePassword(passwordInput.value),
      confirm: () => validateConfirmPassword(passwordInput.value, confirmInput.value),
    });

    showFieldError(nameInput, errors.name);
    showFieldError(emailInput, errors.email);
    showFieldError(passwordInput, errors.password);
    showFieldError(confirmInput, errors.confirm);

    if (!valid) return;

    const result = registerUser({
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    });

    if (result.success) {
      showToast(result.message, "success");
      setTimeout(() => (window.location.href = "profile.html"), 800);
    } else {
      showToast(result.message, "error");
    }
  });
}

/**
 * Fill in profile.html with the current user's info, or redirect
 * to login.html if nobody's logged in.
 */
function initProfilePage() {
  const profileRoot = qs("#profile-root");
  if (!profileRoot) return;

  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const nameEl = qs("#profile-name", profileRoot);
  const emailEl = qs("#profile-email", profileRoot);
  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;

  const logoutBtn = qs("#logout-btn", profileRoot);
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
}

document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initRegisterForm();
  initProfilePage();
});

/* -----------------------------------------------------------
   📚 LEARNING CHECKPOINT before moving to cart.js:
   - Why do we store only { id, name, email } in CURRENT_USER
     rather than the full user object with passwordHash?
   - Trace through what happens end-to-end when a form submits:
     validation.js -> auth.js -> storage.js -> utils.js (toast)
----------------------------------------------------------- */