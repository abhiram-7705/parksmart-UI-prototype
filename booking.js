// ===============================
// LOAD DATA
// ===============================
const space = JSON.parse(localStorage.getItem("selectedSpace"));
const slots = JSON.parse(localStorage.getItem("selectedSlots")) || [];
const search = JSON.parse(localStorage.getItem("searchData"));

let wallet = Number(localStorage.getItem("walletBalance") || 500);
let discount = 0;
let holdExpiry = Date.now() + 5 * 60 * 1000;

// ===============================
// LEFT PANEL
// ===============================
function renderBookingLeft() {
  const container = document.getElementById("bookingLeftCard");

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
    </div>

    <div class="extra-details show">
      <div class="map-container"></div>
    </div>
  `;

  const mapBox = card.querySelector(".map-container");

  const lat = space.lat || 13.0500;
  const lng = space.lng || 80.2600;

  mapBox.innerHTML = `
    <iframe
      width="100%"
      height="100%"
      style="border:0"
      loading="lazy"
      allowfullscreen
      src="https://maps.google.com/maps?ll=${lat},${lng}&q=${lat},${lng}&z=16&output=embed">
    </iframe>
  `;

  container.appendChild(card);
}

renderBookingLeft();

// ===============================
// FORMAT TIME
// ===============================
function formatDateTime(dt) {
  const date = new Date(dt);

  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short"
  };

  const datePart = date.toLocaleDateString("en-IN", options);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${datePart} • ${hours}:${minutes} ${ampm}`;
}

document.getElementById("fromTime").value = formatDateTime(search.arrival);
document.getElementById("toTime").value = formatDateTime(search.leaving);
document.getElementById("slots").value = slots.join(", ");
document.getElementById("wallet").innerText = wallet;

// ===============================
// CALCULATIONS
// ===============================
const start = new Date(search.arrival);
const end = new Date(search.leaving);

const minutes = (end - start) / (1000 * 60);
const hours = Math.ceil(minutes / 60);

const subtotal = hours * space.price * slots.length;
const tax = subtotal * 0.18;

let total = subtotal + tax;

function updateUI() {
  document.getElementById("baseRate").innerText = `₹${space.price}/hr`;
  document.getElementById("duration").innerText = `${hours} hr`;
  document.getElementById("subtotal").innerText = `₹${subtotal}`;
  document.getElementById("tax").innerText = `₹${Math.round(tax)}`;
  document.getElementById("total").innerText = Math.round(total);
}

updateUI();

// ===============================
// PROMO
// ===============================
function applyPromo() {
  const code = document.getElementById("promoInput").value;

  if (code === "WELCOME50") discount = 50;
  else if (code === "SAVE20") discount = 20;
  else return alert("Invalid code");

  total = subtotal + tax - discount;

  document.getElementById("discount").innerText = `-₹${discount}`;
  document.getElementById("total").innerText = Math.round(total);
}

// ===============================
// EXTEND HOLD
// ===============================
document.getElementById("extendBtn").onclick = () => {
  holdExpiry += 15 * 60 * 1000;
  alert("Hold extended by 15 minutes");
};

// ===============================
// MODAL LOGIC (FIXED)
// ===============================
const modal = document.getElementById("confirmModal");
const confirmText = document.getElementById("confirmText");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

// OPEN MODAL
document.getElementById("bookBtn").onclick = () => {

  if (Date.now() > holdExpiry) {
    alert("Hold expired");
    return;
  }

  if (wallet < total) {
    alert("Insufficient balance");
    return;
  }

  confirmText.innerText =
    `You are about to pay ₹${Math.round(total)} for ${slots.length} slot(s).\nProceed?`;

  modal.classList.remove("hidden");
};

// CANCEL
cancelBtn.onclick = () => {
  modal.classList.add("hidden");
};

// CONFIRM BOOKING
confirmBtn.onclick = () => {

  modal.classList.add("hidden");

  wallet -= total;
  localStorage.setItem("walletBalance", wallet);

  const booking = {
    id: Date.now(),
    space,
    slots,
    total,
    arrival: search.arrival,
    leaving: search.leaving
  };

  localStorage.setItem("currentBooking", JSON.stringify(booking));

  window.location.href = "confirmation.html";
};

// CLOSE ON OUTSIDE CLICK
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
};