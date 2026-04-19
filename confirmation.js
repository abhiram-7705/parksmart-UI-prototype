// LOAD BOOKING
const booking = JSON.parse(localStorage.getItem("currentBooking"));

const loadingScreen = document.getElementById("loadingScreen");
const successScreen = document.getElementById("successScreen");
const detailsBox = document.getElementById("bookingDetails");
const countdownEl = document.getElementById("countdown");

// ===============================
// SIMULATE PAYMENT PROCESSING
// ===============================
setTimeout(() => {

  loadingScreen.classList.add("hidden");
  successScreen.classList.remove("hidden");

  showDetails();
  startCountdown();

}, 2000); // 2 sec fake processing

// ===============================
// SHOW BOOKING DETAILS
// ===============================
function showDetails() {

  detailsBox.innerHTML = `
    <h3>${booking.space.name}</h3>
    <p>📍 ${booking.space.location}</p>
    <p><strong>Slots:</strong> ${booking.slots.join(", ")}</p>
    <p><strong>Amount Paid:</strong> ₹${booking.total}</p>
    <p><strong>From:</strong> ${formatDate(booking.arrival)}</p>
    <p><strong>To:</strong> ${formatDate(booking.leaving)}</p>
  `;
}

// FORMAT TIME
function formatDate(dt) {
  const d = new Date(dt);

  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12 || 12;

  return `${d.toDateString()} • ${h}:${m} ${ampm}`;
}

// ===============================
// COUNTDOWN REDIRECT
// ===============================
let timeLeft = 30;

function startCountdown() {
  const interval = setInterval(() => {

    timeLeft--;
    countdownEl.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(interval);
      window.location.href = "dashboard.html";
    }

  }, 1000);
}