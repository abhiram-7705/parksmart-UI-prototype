// =======================================================
// 🔐 GLOBAL AUTH STATE
// =======================================================

const locations = [
  "T Nagar, Chennai",
  "Marina Beach, Chennai",
  "Adyar, Chennai",
  "Velachery, Chennai",
  "Anna Nagar, Chennai"
];
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

// =======================================================
// 🚀 INIT
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  setupDateTimeDefaults();
  setupNavbar();
  setupSearch();
  setupAuthModal();

  if (window.location.pathname.includes("results.html")) {
    initResultsPage();
  }

  if (window.location.pathname.includes("slot-selection.html")) {
    initSlotPage();
  }
});


// =======================================================
// 📅 DATE DEFAULTS
// =======================================================
function setupDateTimeDefaults() {
  const arrival = document.getElementById("arrivalTime");
  const leaving = document.getElementById("leavingTime");

  if (!arrival || !leaving) return;

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
  const arrival = new Date(document.getElementById("arrivalTime")?.value);
  const leaving = new Date(document.getElementById("leavingTime")?.value);
  const error = document.getElementById("timeError");

  if (!arrival || !leaving) return true;

  if (leaving <= arrival) {
    if (error) error.textContent = "Leaving time must be after arrival.";
    return false;
  } else {
    if (error) error.textContent = "";
    return true;
  }
}


// =======================================================
// 🔐 LOGIN CHECK
// =======================================================
function requireLogin() {
  if (!isLoggedIn) {
    document.getElementById("authModal")?.classList.add("active");
    return false;
  }
  return true;
}


// =======================================================
// 🔷 NAVBAR + PROFILE DROPDOWN
// =======================================================
function setupNavbar() {
  const dropdown = document.getElementById("dropdownMenu");
  const hamburger = document.getElementById("hamburger");

  // Hamburger (if exists)
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    });
  }

  // 🔐 Restricted links
  document.querySelectorAll(".restricted").forEach(el => {
    el.addEventListener("click", (e) => {
      if (!isLoggedIn) {
        e.preventDefault();
        document.getElementById("authModal")?.classList.add("active");
      }
    });
  });

  // Login button
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("authModal")?.classList.add("active");
    });
  }

  // ===================================================
  // 👤 PROFILE DROPDOWN (NEW)
  // ===================================================
  const profileIcon = document.getElementById("profileIcon");
  const profileDropdown = document.getElementById("profileDropdown");

  if (profileIcon && profileDropdown) {

    profileIcon.addEventListener("click", () => {
      profileDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (
        !profileIcon.contains(e.target) &&
        !profileDropdown.contains(e.target)
      ) {
        profileDropdown.classList.add("hidden");
      }
    });
  }

  // Logout (dropdown option)
  document.getElementById("logoutOption")?.addEventListener("click", () => {
    localStorage.setItem("isLoggedIn", "false");
    window.location.href = "index.html";
  });
}


// =======================================================
// 🔍 SEARCH
// =======================================================
function setupSearch() {
  const searchBtn = document.getElementById("searchBtn");
  const bookBtn = document.getElementById("bookNowBtn");

  if (!searchBtn || !bookBtn) return;

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
    if (!requireLogin()) return;

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
// 🔐 AUTH MODAL
// =======================================================
function setupAuthModal() {
  const modal = document.getElementById("authModal");
  if (!modal) return;

  document.getElementById("closeModal").onclick = () => {
    modal.classList.remove("active");
  };

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });

  document.getElementById("showSignup").onclick = () => {
    document.getElementById("loginForm").classList.remove("active");
    document.getElementById("signupForm").classList.add("active");
  };

  document.getElementById("showLogin").onclick = () => {
    document.getElementById("signupForm").classList.remove("active");
    document.getElementById("loginForm").classList.add("active");
  };

  // LOGIN
  document.getElementById("loginSubmit").onclick = () => {
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true");
    modal.classList.remove("active");

    if (localStorage.getItem("searchData")) {
      window.location.href = "results.html";
    }
  };
}


// =======================================================
// 📊 DATA
// =======================================================
const parkingSpaces = [
  {
    id: 1,
    name: "Express Mall Parking",
    type: "public",
    price: 35,
    rating: 4.4,
    distance: 1.2,
    location: "Royapettah, Chennai",
    amenities: ["CCTV", "Covered"],
    lat: 13.0500,
    lng: 80.2600,
    slots: ["A1","A2","A3"]
  },
  {
    id: 2,
    name: "Shoreline Private Spot",
    type: "private",
    price: 50,
    rating: 4.8,
    distance: 2.9,
    location: "Marina Beach, Chennai",
    amenities: ["EV", "Guarded"],
    lat: 13.0600,
    lng: 80.2800,
    slots: ["B1","B2"]
  }
];


// =======================================================
// 📋 RESULTS PAGE
// =======================================================
function initResultsPage() {
  if (!isLoggedIn) {
    window.location.href = "index.html";
    return;
  }

  const searchData = JSON.parse(localStorage.getItem("searchData"));

// if (searchData) {
//   document.getElementById("resLocation").placeholder = searchData.location;
//   document.getElementById("resArrival").value = searchData.arrival;
//   document.getElementById("resLeaving").value = searchData.leaving;
// }

setupLocationSearch();
  renderResults(parkingSpaces);

  document.querySelectorAll(".filters input, .filters select")
    .forEach(el => el.addEventListener("change", applyFilters));

    document.querySelector(".search-btn")?.addEventListener("click", () => {
  const location = document.getElementById("resLocation").value.toLowerCase();

  let filtered = parkingSpaces.filter(space =>
    space.location.toLowerCase().includes(location)
  );

  renderResults(filtered);
});
}


// =======================================================
// 🎛️ FILTERS + SORT
// =======================================================
function applyFilters() {
  let filtered = [...parkingSpaces];

  const publicChecked = document.getElementById("filterPublic").checked;
  const privateChecked = document.getElementById("filterPrivate").checked;

  if (publicChecked && !privateChecked)
    filtered = filtered.filter(s => s.type === "public");

  if (!publicChecked && privateChecked)
    filtered = filtered.filter(s => s.type === "private");

  let min = document.getElementById("minPrice").value;
  let max = document.getElementById("maxPrice").value;

  if (min) filtered = filtered.filter(s => s.price >= min);
  if (max) filtered = filtered.filter(s => s.price <= max);

  let amenities = [...document.querySelectorAll(".amenity:checked")]
    .map(a => a.value);

  if (amenities.length)
    filtered = filtered.filter(s =>
      amenities.every(a => s.amenities.includes(a))
    );

  let dist = document.getElementById("distanceRange").value;
  filtered = filtered.filter(s => s.distance <= dist);

  let sort = document.getElementById("sortBy").value;

  if (sort === "price") filtered.sort((a,b)=>a.price-b.price);
  if (sort === "distance") filtered.sort((a,b)=>a.distance-b.distance);
  if (sort === "rating") filtered.sort((a,b)=>b.rating-a.rating);

  renderResults(filtered);
}


// =======================================================
// 📦 RENDER RESULTS
// =======================================================
function renderResults(data) {
  const container = document.getElementById("results");
  if (!container) return;

  container.innerHTML = "";

  document.getElementById("resultCount").textContent =
    `Available Parking (${data.length})`;

  data.forEach(space => {
    const card = document.createElement("div");
    card.className = "result-card";

card.innerHTML = `
  <div class="card-left">
    <h3>
      ${space.name}
      <span class="badge ${space.type}">${space.type}</span>
    </h3>

    <p class="meta">
      📍 ${space.location} • ⭐ ${space.rating}
    </p>

    <p class="distance">${space.distance} km away</p>

    <div class="amenities">
      ${space.amenities.map(a => `<span class="chip">${a}</span>`).join("")}
    </div>
  </div>

  <div class="card-right">
    <div class="price">₹${space.price}/hr</div>

    <div class="actions">
      <button class="secondary-btn more-btn">More</button>
      <button class="primary-btn">Reserve</button>
    </div>
  </div>

  <!-- ✅ MUST BE HERE (not inside left) -->
  <div class="extra-details">
    <div class="map-container"></div>
  </div>
`;
const moreBtn = card.querySelector(".more-btn");

moreBtn.onclick = () => toggleMore(moreBtn, space);
    container.appendChild(card);
  });
}
function toggleMore(btn, space) {
  const card = btn.closest(".result-card");
  const extra = card.querySelector(".extra-details");
  const mapBox = card.querySelector(".map-container");

  const isOpen = extra.classList.contains("show");

  // Close all other open cards
  document.querySelectorAll(".extra-details").forEach(e => e.classList.remove("show"));
  document.querySelectorAll(".more-btn").forEach(b => {
    b.innerText = "More";
    b.classList.remove("active");
  });

  if (!isOpen) {
    extra.classList.add("show");
    btn.innerText = "Close";
    btn.classList.add("active");

    // Inject map
mapBox.innerHTML = `
  <iframe
    width="100%"
    height="100%"
    style="border:0"
    loading="lazy"
    allowfullscreen
    referrerpolicy="no-referrer-when-downgrade"
    src="https://www.google.com/maps?q=${space.lat},${space.lng}&hl=en&z=16&output=embed">
  </iframe>
`;
  }
}

// =======================================================
// 🔍 MODAL
// =======================================================
function openMore(space) {
  document.getElementById("moreModal").classList.add("active");

  document.getElementById("detailsTab").innerHTML = `
    <h2>${space.name}</h2>
    <p>${space.location}</p>
    <p>${space.amenities.join(", ")}</p>
    <p>₹${space.price}/hr</p>
  `;

  switchTab("details");
}

function switchTab(tab) {
  document.getElementById("detailsTab").classList.add("hidden");
  document.getElementById("mapTab").classList.add("hidden");

  if (tab === "details")
    document.getElementById("detailsTab").classList.remove("hidden");
  else
    document.getElementById("mapTab").classList.remove("hidden");
}

document.getElementById("closeMore")?.addEventListener("click", () => {
  document.getElementById("moreModal").classList.remove("active");
});


// =======================================================
// 🚗 RESERVE
// =======================================================
function reserveSpace(space) {
  localStorage.setItem("selectedSpace", JSON.stringify(space));
  window.location.href = "slot-selection.html";
}


// =======================================================
// 🅿️ SLOT PAGE
// =======================================================
function initSlotPage() {
  const space = JSON.parse(localStorage.getItem("selectedSpace"));
  const search = JSON.parse(localStorage.getItem("searchData"));

  document.getElementById("spaceName").textContent = space.name;
  document.getElementById("spaceLocation").textContent = space.location;
  document.getElementById("timeWindow").textContent =
    `${search.arrival} → ${search.leaving}`;

  const grid = document.getElementById("slotsGrid");

  space.slots.forEach(slot => {
    const el = document.createElement("div");
    el.className = "slot";
    el.textContent = slot;

    el.onclick = () => selectSlot(slot, el);
    grid.appendChild(el);
  });

  startTimer();
}


// =======================================================
// ⏱️ TIMER
// =======================================================
let timerInterval;

function startTimer() {
  let time = 300;

  timerInterval = setInterval(() => {
    time--;

    let min = Math.floor(time / 60);
    let sec = time % 60;

    document.getElementById("timer").textContent =
      `⏱️ ${min}:${sec < 10 ? "0" : ""}${sec}`;

    if (time <= 0) {
      clearInterval(timerInterval);
      alert("Session expired");
      document.getElementById("continueBtn").disabled = true;
    }
  }, 1000);
}


// =======================================================
// 🎯 SLOT SELECT
// =======================================================
let selectedSlot = null;

function selectSlot(slot, el) {
  document.querySelectorAll(".slot").forEach(s =>
    s.classList.remove("selected")
  );

  el.classList.add("selected");
  selectedSlot = slot;

  document.getElementById("continueBtn").disabled = false;
}

document.getElementById("continueBtn")?.addEventListener("click", () => {
  localStorage.setItem("selectedSlot", selectedSlot);
  window.location.href = "booking.html";
});


// =======================================================
// 🔙 BACK
// =======================================================
function goBack() {
  clearInterval(timerInterval);
  window.location.href = "results.html";
}

function setupLocationSearch() {
  const input = document.getElementById("resLocation");
  const dropdown = document.getElementById("locationDropdown");

  if (!input || !dropdown) return;

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();

    dropdown.innerHTML = "";

    if (!value) {
      dropdown.classList.add("hidden");
      return;
    }

    const filtered = locations.filter(loc =>
      loc.toLowerCase().includes(value)
    );

    filtered.forEach(loc => {
      const div = document.createElement("div");
      div.className = "dropdown-item";
      div.textContent = loc;

      div.onclick = () => {
        input.value = loc;
        dropdown.classList.add("hidden");
      };

      dropdown.appendChild(div);
    });

    dropdown.classList.remove("hidden");
  });

  // close on outside click
  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });
}

function toggleSection(el) {
  const content = el.nextElementSibling;
  content.classList.toggle("collapsed");
}