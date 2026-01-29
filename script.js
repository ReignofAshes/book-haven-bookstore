// Book Haven Bookstore - Touchstone Tasks 3.1 + 3.2 (+ duplicate-order prevention)
// Alerts + Web Storage (sessionStorage + localStorage)

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // SUBSCRIBE (ALL PAGES)
  // =========================
  const subscribeBtn = document.getElementById("subscribeBtn");
  if (subscribeBtn) {
    subscribeBtn.addEventListener("click", () => {
      alert("Thank you for subscribing.");
    });
  }

  // ==========================================
  // SHOPPING CART (GALLERY) - sessionStorage
  // ==========================================
  const cartKey = "bookHavenCart";

  // Duplicate-order prevention flag (session-based)
  const orderProcessedKey = "orderProcessed";

  function isOrderProcessed() {
    return sessionStorage.getItem(orderProcessedKey) === "true";
  }

  function markOrderProcessed() {
    sessionStorage.setItem(orderProcessedKey, "true");
  }

  function resetOrderProcessed() {
    sessionStorage.removeItem(orderProcessedKey);
  }

  function getCart() {
    const raw = sessionStorage.getItem(cartKey);
    return raw ? JSON.parse(raw) : [];
  }

  function saveCart(cart) {
    sessionStorage.setItem(cartKey, JSON.stringify(cart));
  }

  function clearCart() {
    sessionStorage.removeItem(cartKey);
  }

  // Add to Cart buttons (supports data-name and data-img)
  // Example:
  // <button class="addToCartBtn" data-name="Featured Book 1" data-img="images/Client3_Book1.png">Add to Cart</button>
  document.querySelectorAll(".addToCartBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // If an order was previously processed, allow a new order by resetting the flag
      // (User is starting a new cart/order)
      if (isOrderProcessed()) resetOrderProcessed();

      const name = btn.dataset.name || "Item";
      const img = btn.dataset.img || "";

      const cart = getCart();
      cart.push({ name, img, addedAt: new Date().toISOString() });
      saveCart(cart);

      alert("Item added to the cart.");
    });
  });

  // Modal elements (only exist on pages that include the modal)
  const viewCartBtn = document.getElementById("viewCartBtn");
  const cartModal = document.getElementById("cartModal");
  const cartItemsDiv = document.getElementById("cartItems");

  const closeCartBtn = document.getElementById("closeCartBtn");
  const modalClearCartBtn = document.getElementById("modalClearCartBtn");
  const modalProcessOrderBtn = document.getElementById("modalProcessOrderBtn");

  function renderCart() {
    // Safe to call even on pages without the modal/cart items
    if (!cartItemsDiv) return;

    const cart = getCart();

    if (cart.length === 0) {
      cartItemsDiv.innerHTML = "<p>Your cart is currently empty.</p>";
      return;
    }

    let html = "<ul>";
    cart.forEach((item) => {
      html += `<li style="margin-bottom:10px;">
        ${item.img ? `<img src="${item.img}" alt="${item.name}" width="60" style="vertical-align:middle; margin-right:10px;">` : ""}
        <strong>${item.name}</strong>
      </li>`;
    });
    html += "</ul>";

    cartItemsDiv.innerHTML = html;
  }

  function openModal() {
    if (!cartModal) return;
    renderCart();
    cartModal.style.display = "block";
  }

  function closeModal() {
    if (!cartModal) return;
    cartModal.style.display = "none";
  }

  if (viewCartBtn && cartModal) {
    viewCartBtn.addEventListener("click", openModal);
  }

  if (closeCartBtn && cartModal) {
    closeCartBtn.addEventListener("click", closeModal);
  }

  // =========================
  // CLEAR CART (table buttons)
  // =========================
  document.querySelectorAll(".clearCartBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      clearCart();
      resetOrderProcessed(); // allow a new order after clearing
      renderCart();
      alert("Cart cleared.");
    });
  });

  // ===========================
  // PROCESS ORDER (table buttons)
  // ===========================
  document.querySelectorAll(".processOrderBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isOrderProcessed()) {
        alert("This order has already been processed.");
        return;
      }

      clearCart();
      markOrderProcessed();
      renderCart();
      alert("Thank you for your order.");
    });
  });

  // =========================
  // MODAL CLEAR CART
  // =========================
  if (modalClearCartBtn) {
    modalClearCartBtn.addEventListener("click", () => {
      clearCart();
      resetOrderProcessed();
      renderCart();
      alert("Cart cleared.");
    });
  }

  // =========================
  // MODAL PROCESS ORDER
  // =========================
  if (modalProcessOrderBtn) {
    modalProcessOrderBtn.addEventListener("click", () => {
      if (isOrderProcessed()) {
        alert("This order has already been processed.");
        return;
      }

      clearCart();
      markOrderProcessed();
      renderCart();
      alert("Thank you for your order.");
    });
  }

  // Optional: click outside modal content closes it
  if (cartModal) {
    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) closeModal();
    });
  }

  // ==========================================
  // ABOUT/CONTACT PAGE - localStorage
  // ==========================================
  const contactForm = document.getElementById("contactForm");
  const contactKey = "bookHavenContact";

  function loadSavedForm() {
    const raw = localStorage.getItem(contactKey);
    if (!raw) return;

    const data = JSON.parse(raw);

    const setVal = (id, value) => {
      const el = document.getElementById(id);
      if (el && value !== undefined && value !== null) el.value = value;
    };

    setVal("name", data.name);
    setVal("email", data.email);
    setVal("phone", data.phone);
    setVal("item", data.item);
    setVal("quantity", data.quantity);
    setVal("deadline", data.deadline);
    setVal("message", data.message);

    if (data.messageType) {
      const radio = document.querySelector(
        `input[name="messageType"][value="${data.messageType}"]`
      );
      if (radio) radio.checked = true;
    }
  }

  if (contactForm) {
    // Autofill proves localStorage is working
    loadSavedForm();

    contactForm.addEventListener("submit", (e) => {
      // Let browser required-field validation happen first
      if (!contactForm.checkValidity()) {
        return;
      }

      // Valid: prevent sending anywhere (assignment requirement)
      e.preventDefault();

      const data = {
        name: document.getElementById("name")?.value || "",
        email: document.getElementById("email")?.value || "",
        phone: document.getElementById("phone")?.value || "",
        messageType:
          document.querySelector('input[name="messageType"]:checked')?.value || "",
        item: document.getElementById("item")?.value || "",
        quantity: document.getElementById("quantity")?.value || "",
        deadline: document.getElementById("deadline")?.value || "",
        message: document.getElementById("message")?.value || "",
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(contactKey, JSON.stringify(data));

      alert("Thank you for your message.");
      // Optional: contactForm.reset();
    });
  }

});
