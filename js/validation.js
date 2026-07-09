/* =========================================================
   validation.js — STEP 4: Form validation helpers
   Loaded AFTER utils.js. Pure functions that return
   { valid: boolean, message: string } — no DOM writes here
   except the small helper at the bottom for showing errors
   next to a field.
   ========================================================= */

function validateRequired(value, fieldName = "This field") {
  const valid = value !== undefined && value !== null && value.toString().trim() !== "";
  return { valid, message: valid ? "" : `${fieldName} is required.` };
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = re.test(String(email).trim());
  return { valid, message: valid ? "" : "Please enter a valid email address." };
}

/**
 * Password rules: min 8 chars, at least one letter and one number.
 */
function validatePassword(password) {
  const value = String(password);
  if (value.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters." };
  }
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return { valid: false, message: "Password must include a letter and a number." };
  }
  return { valid: true, message: "" };
}

function validateConfirmPassword(password, confirmPassword) {
  const valid = password === confirmPassword && confirmPassword !== "";
  return { valid, message: valid ? "" : "Passwords do not match." };
}

function validatePhone(phone) {
  const re = /^[6-9]\d{9}$/; // basic 10-digit Indian mobile number pattern
  const valid = re.test(String(phone).trim());
  return { valid, message: valid ? "" : "Please enter a valid 10-digit phone number." };
}

function validateName(name) {
  const valid = String(name).trim().length >= 2;
  return { valid, message: valid ? "" : "Name must be at least 2 characters." };
}

/**
 * Run several field validators at once.
 * fieldValidators = { email: () => validateEmail(val), ... }
 * Returns { valid: boolean, errors: { fieldName: message } }
 */
function validateForm(fieldValidators) {
  const errors = {};
  let valid = true;

  for (const [field, validatorFn] of Object.entries(fieldValidators)) {
    const result = validatorFn();
    if (!result.valid) {
      valid = false;
      errors[field] = result.message;
    }
  }

  return { valid, errors };
}

/**
 * Show/clear an inline error message under a form field.
 * Expects a sibling element with class ".field-error" inside
 * the same ".form-group" wrapper as the input.
 */
function showFieldError(inputEl, message) {
  if (!inputEl) return;
  const group = inputEl.closest(".form-group") || inputEl.parentElement;
  const errorEl = group ? group.querySelector(".field-error") : null;

  inputEl.classList.toggle("invalid", Boolean(message));

  if (errorEl) {
    errorEl.textContent = message || "";
  }
}

function clearFieldError(inputEl) {
  showFieldError(inputEl, "");
}

/* -----------------------------------------------------------
   📚 LEARNING CHECKPOINT before moving to auth.js:
   - Why do validators return { valid, message } instead of
     just true/false?
   - Try writing validateForm's loop as a .reduce() instead
     of a for...of loop.
----------------------------------------------------------- */