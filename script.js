// Task 3.2 - Web Storage (Book Haven Bookstore)

document.addEventListener("DOMContentLoaded", () => {

  // ----------------------------
  // Subscribe button (all pages)
  // ----------------------------
  const subscribeBtn = document.getElementById("subscribeBtn");
  if (subscribeBtn) {
    subscribeBtn.addEventListener("click", () => {
      alert("Thank you for subscribing.");
    });
  }

  // ======================================================
  // GALLERY PAGE: sessionStorage cart + modal functionality
  // ======================================================

  const cartKey = "bookHavenCart";

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

  // Add to Cart buttons (use class + data attributes)
  document.querySelectorAll(".addToCartBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name || "Item";
      const img = btn.dataset.img || "";

      const cart = getCart();
      cart.push({ name, img, addedAt: new Date().toISOString() });
      saveCart(cart);

      alert("Item added to the cart.");
    });
  });

  document.querySelectorAll(".clearCartBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      clearCart();
      alert("Cart cleared.");
      renderCart(); // updates modal if it's open
    });
  });

  document.querySelectorAll(".processOrderBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      clearCart();
      alert("Thank you for your order.");
      renderCart(); // updates modal if it's open
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

  // Clear Cart + Process Order inside modal
  if (modalClearCartBtn) {
    modalClearCartBtn.addEventListener("click", () => {
      clearCart();
      renderCart();
      alert("Cart cleared.");
    });
  }

  if (modalProcessOrderBtn) {
    modalProcessOrderBtn.addEventListener("click", () => {
      clearCart();
      renderCart();
      alert("Thank you for your order.");
    });
  }

  // Click outside modal content closes it
  if (cartModal) {
    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) closeModal();
    });
  }

  // ======================================================
  // ABOUT/CONTACT PAGE: localStorage save custom order info
  // ======================================================

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
      const radio = document.querySelector(`input[name="messageType"][value="${data.messageType}"]`);
      if (radio) radio.checked = true;
    }
  }

  if (contactForm) {
    loadSavedForm();

    contactForm.addEventListener("submit", (e) => {
      if (!contactForm.checkValidity()) {
        return;
      }

      e.preventDefault();

      const data = {
        name: document.getElementById("name")?.value || "",
        email: document.getElementById("email")?.value || "",
        phone: document.getElementById("phone")?.value || "",
        messageType: document.querySelector('input[name="messageType"]:checked')?.value || "",
        item: document.getElementById("item")?.value || "",
        quantity: document.getElementById("quantity")?.value || "",
        deadline: document.getElementById("deadline")?.value || "",
        message: document.getElementById("message")?.value || "",
        savedAt: new Date().toISOString()
      };

      localStorage.setItem(contactKey, JSON.stringify(data));
      alert("Thank you for your message.");
    });
  }

});
