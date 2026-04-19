// ===============================
// LOAD DATA
// ===============================
const space = JSON.parse(localStorage.getItem("selectedSpace")) || {
  name: "Private Parking",
  location: "Chennai",
  slots: ["A1","A2","A3"]
};

const bookedSlots = ["A2"];
let selected = [];

// ===============================
// DISPLAY INFO
// ===============================
document.getElementById("spaceName").innerText = space.name;
document.getElementById("spaceLocation").innerText = space.location;
document.getElementById("spaceDetails").innerText =
  "Private parking • Limited slots available";

// ===============================
// SLOT RENDERING
// ===============================
const container = document.getElementById("slotsContainer");

space.slots.forEach(slot => {
  const div = document.createElement("div");
  div.className = "parking-slot";

  if (bookedSlots.includes(slot)) {
    div.classList.add("booked");
  } else {
    div.classList.add("available");
    div.onclick = () => toggleSlot(div, slot);
  }

  div.innerHTML = `<span>${slot}</span>`;
  container.appendChild(div);
});

// ===============================
// SLOT SELECTION
// ===============================
function toggleSlot(el, slot) {
  if (selected.includes(slot)) {
    selected = selected.filter(s => s !== slot);
    el.classList.remove("selected");
    el.classList.add("available");
  } else {
    if (selected.length >= 3) {
      alert("Cannot select more than 3 slots");
      return;
    }
    selected.push(slot);
    el.classList.remove("available");
    el.classList.add("selected");
  }

  updateUI();
}

// ===============================
// TIMELINE (PLAYO STYLE)
// ===============================
const startRange = document.getElementById("startRange");
const endRange = document.getElementById("endRange");
const selectedRange = document.getElementById("selectedRange");
const labelsContainer = document.getElementById("timeLabels");

const TOTAL_STEPS = 68; // 6:00 → 23:00

// Generate labels properly aligned
for (let i = 0; i <= TOTAL_STEPS; i += 4) {
  const hour = Math.floor(i / 4) + 6;

  const label = document.createElement("span");
  label.innerText = `${hour}:00`;
  label.style.left = (i / TOTAL_STEPS) * 100 + "%";

  labelsContainer.appendChild(label);
}

// Convert index → time
function indexToTime(index) {
  const hour = Math.floor(index / 4) + 6;
  const min = (index % 4) * 15;
  return `${hour.toString().padStart(2, "0")}:${min
    .toString()
    .padStart(2, "0")}`;
}

// ===============================
// UPDATE TIMELINE
// ===============================
function updateTimeline() {
  let start = parseInt(startRange.value);
  let end = parseInt(endRange.value);

  if (end <= start) {
    end = start + 1;
    endRange.value = end;
  }

  // Position bar
  const percentStart = (start / TOTAL_STEPS) * 100;
  const percentEnd = (end / TOTAL_STEPS) * 100;

  selectedRange.style.left = percentStart + "%";
  selectedRange.style.width = (percentEnd - percentStart) + "%";

  const startTime = indexToTime(start);
  const endTime = indexToTime(end);

  // Store globally (IMPORTANT FIX)
  window.selectedStart = startTime;
  window.selectedEnd = endTime;

  // Display
  document.getElementById("selectedTimeText").innerText =
    `${startTime} → ${endTime}`;

  const today = new Date().toISOString().split("T")[0];

  const startDate = new Date(`${today}T${startTime}`);
  const endDate = new Date(`${today}T${endTime}`);

  const minutes = Math.floor((endDate - startDate) / (1000 * 60));
  const billed = Math.ceil(minutes / 60);

  document.getElementById("timeMeta").innerText =
    `Duration: ${minutes} mins • Billed: ${billed} hr(s)`;

  updateUI();
}

// Bind events
startRange.addEventListener("input", updateTimeline);
endRange.addEventListener("input", updateTimeline);

// INITIALIZE TIMELINE (CRITICAL FIX)
updateTimeline();

// ===============================
// VALIDATE TIME
// ===============================
function validateTime() {
  if (!window.selectedStart || !window.selectedEnd) return false;

  const start = new Date(`2000-01-01T${window.selectedStart}`);
  const end = new Date(`2000-01-01T${window.selectedEnd}`);

  return end > start;
}

// ===============================
// UPDATE UI
// ===============================
function updateUI() {
  document.getElementById("selectedCount").innerText =
    `${selected.length} slot(s) selected`;

  const canProceed =
    selected.length > 0 && validateTime();

  document.getElementById("proceedBtn").disabled = !canProceed;
}

// ===============================
// TIMER (5 MIN)
// ===============================
let time = 300;
const timerEl = document.getElementById("timer");

const interval = setInterval(() => {
  time--;

  let min = Math.floor(time / 60);
  let sec = time % 60;

  timerEl.innerText =
    `⏱️ ${min}:${sec < 10 ? "0" : ""}${sec}`;

  if (time <= 0) {
    clearInterval(interval);
    alert("Session expired");
    document.getElementById("proceedBtn").disabled = true;
  }
}, 1000);

// ===============================
// NAVIGATION
// ===============================
function goHome() {
  window.location.href = "results.html";
}

// ===============================
// PROCEED (FINAL FIXED)
// ===============================
document.getElementById("proceedBtn").onclick = () => {

  if (!validateTime()) {
    alert("Please select valid time");
    return;
  }

  if (selected.length === 0) {
    alert("Select at least one slot");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const searchData = {
    arrival: `${today}T${window.selectedStart}`,
    leaving: `${today}T${window.selectedEnd}`
  };

  localStorage.setItem("searchData", JSON.stringify(searchData));
  localStorage.setItem("selectedSlots", JSON.stringify(selected));

  window.location.href = "booking.html";
};