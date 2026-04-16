// 🔐 AUTH STATE (GLOBAL)
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

// INIT
document.addEventListener("DOMContentLoaded", () => {
  setupDateTimeDefaults();
  setupNavbar();
  setupSearch();
  setupAuthModal();
});


// =======================================================
// 📅 DATE DEFAULTS
// =======================================================
function setupDateTimeDefaults() {
  const arrival = document.getElementById("arrivalTime");
  const leaving = document.getElementById("leavingTime");

  let now = new Date();
  now.setMinutes(now.getMinutes() + 15);

  let leave = new Date(now);
  leave.setHours(leave.getHours() + 2);

  arrival.value = formatDateTime(now);
  leaving.value = formatDateTime(leave);

  arrival.addEventListener("change", validateTime);
  leaving.addEventListener("change", validateTime);
}

function formatDateTime(date) {
  return date.toISOString().slice(0, 16);
}


// =======================================================
// ⏱️ TIME VALIDATION
// =======================================================
function validateTime() {
  const arrival = new Date(document.getElementById("arrivalTime").value);
  const leaving = new Date(document.getElementById("leavingTime").value);
  const error = document.getElementById("timeError");

  if (leaving <= arrival) {
    error.textContent = "Leaving time must be after arrival.";
    return false;
  } else {
    error.textContent = "";
    return true;
  }
}


// =======================================================
// 🔐 LOGIN CHECK (REUSABLE)
// =======================================================
function requireLogin() {
  if (!isLoggedIn) {
    document.getElementById("authModal").classList.add("active");
    return false;
  }
  return true;
}


// =======================================================
// 🔷 NAVBAR
// =======================================================
function setupNavbar() {
  const dropdown = document.getElementById("dropdownMenu");
  const hamburger = document.getElementById("hamburger");

  // Toggle dropdown
  hamburger.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });

  // 🔐 Restricted links → open modal instead of redirect
  document.querySelectorAll(".restricted").forEach(el => {
    el.addEventListener("click", (e) => {
      if (!isLoggedIn) {
        e.preventDefault();
        document.getElementById("authModal").classList.add("active");
      }
    });
  });

  // 🔐 Login button → open modal
  document.getElementById("loginBtn").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("authModal").classList.add("active");
  });
}


// =======================================================
// 🔍 SEARCH LOGIC
// =======================================================
function setupSearch() {
  const searchBtn = document.getElementById("searchBtn");
  const bookBtn = document.getElementById("bookNowBtn");

  function handleSearch() {
    const location = document.getElementById("locationInput").value.trim();
    const locationError = document.getElementById("locationError");

    if (!location) {
      locationError.textContent = "Please enter a location.";
      return;
    } else {
      locationError.textContent = "";
    }

    if (!validateTime()) return;

    // 🔐 Require login (modal instead of redirect)
    if (!requireLogin()) return;

    // Save search data
    const searchData = {
      location,
      arrival: document.getElementById("arrivalTime").value,
      leaving: document.getElementById("leavingTime").value
    };

    localStorage.setItem("searchData", JSON.stringify(searchData));

    window.location.href = "results.html";
  }

  searchBtn.addEventListener("click", handleSearch);
  bookBtn.addEventListener("click", handleSearch);
}


// =======================================================
// 🔐 AUTH MODAL SYSTEM
// =======================================================
function setupAuthModal() {
  const modal = document.getElementById("authModal");
  const closeBtn = document.getElementById("closeModal");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  // CLOSE BUTTON
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  // CLICK OUTSIDE
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  // 🔄 TOGGLE FORMS
  document.getElementById("showSignup").onclick = () => {
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
  };

  document.getElementById("showLogin").onclick = () => {
    signupForm.classList.remove("active");
    loginForm.classList.add("active");
  };

  // ===================================================
  // 🔐 LOGIN
  // ===================================================
  document.getElementById("loginSubmit").onclick = () => {
    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value.trim();

    let valid = true;

    if (!validateEmail(email)) {
      document.getElementById("loginEmailError").textContent = "Invalid email";
      valid = false;
    } else {
      document.getElementById("loginEmailError").textContent = "";
    }

    if (password.length < 8) {
      document.getElementById("loginPasswordError").textContent = "Minimum 8 characters";
      valid = false;
    } else {
      document.getElementById("loginPasswordError").textContent = "";
    }

    if (!valid) return;

    // SUCCESS LOGIN
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true");

    // Close modal
    modal.classList.remove("active");
  };

  // ===================================================
  // 📝 SIGNUP
  // ===================================================
  document.getElementById("signupSubmit").onclick = () => {
    let username = document.getElementById("signupUsername").value.trim();
    let email = document.getElementById("signupEmail").value.trim();
    let phone = document.getElementById("signupPhone").value.trim();
    let password = document.getElementById("signupPassword").value.trim();
    let confirm = document.getElementById("signupConfirmPassword").value.trim();

    let valid = true;

    if (username.length < 3) {
      document.getElementById("signupUsernameError").textContent = "Min 3 characters";
      valid = false;
    } else {
      document.getElementById("signupUsernameError").textContent = "";
    }

    if (!validateEmail(email)) {
      document.getElementById("signupEmailError").textContent = "Invalid email";
      valid = false;
    } else {
      document.getElementById("signupEmailError").textContent = "";
    }

    if (!/^\d{10}$/.test(phone)) {
      document.getElementById("signupPhoneError").textContent = "Enter 10 digit phone";
      valid = false;
    } else {
      document.getElementById("signupPhoneError").textContent = "";
    }

    if (password.length < 8) {
      document.getElementById("signupPasswordError").textContent = "Min 8 characters";
      valid = false;
    } else {
      document.getElementById("signupPasswordError").textContent = "";
    }

    if (password !== confirm) {
      document.getElementById("signupConfirmPasswordError").textContent = "Passwords do not match";
      valid = false;
    } else {
      document.getElementById("signupConfirmPasswordError").textContent = "";
    }

    if (!valid) return;

    // Switch to login after signup
    signupForm.classList.remove("active");
    loginForm.classList.add("active");
  };
}


// =======================================================
// 📧 EMAIL VALIDATION
// =======================================================
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}