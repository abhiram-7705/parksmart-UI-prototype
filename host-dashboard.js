let spaces = [
  {
    id: 1,
    name: "Express Mall Parking",
    location: "Royapettah, Chennai",
    city: "Chennai",
    type: "public",
    price_per_hour: 40,
    is_active: true,
    latitude: 13.0500,
    longitude: 80.2600,
    rating: 4.5,
    notes: "Basement parking. Open till 11PM.",
    facilities: {
      cctv: true,
      ev_charging: false,
      guarded: true,
      covered_fence: true
    },
    slots: [
      { id: "A1", status: "free" },
      { id: "A2", status: "occupied" },
      { id: "A3", status: "free" }
    ]
  },
  {
    id: 2,
    name: "Private Driveway",
    location: "Anna Nagar, Chennai",
    city: "Chennai",
    type: "private",
    price_per_hour: 50,
    is_active: true,
    latitude: 13.0850,
    longitude: 80.2101,
    rating: 4.8,
    notes: "Gated house parking.",
    facilities: {
      cctv: false,
      ev_charging: true,
      guarded: false,
      covered_fence: false
    },
    slots: [
      { id: "B1", status: "free" },
      { id: "B2", status: "occupied" }
    ]
  }
];
let bookings = [
  {
    id: 1,
    space_id: 1,
    slot_id: "A2",

    vehicle_number: "TN09AB1234",

    arrival: "2026-03-18T14:00",
    leaving: "2026-03-18T16:00",
    booking_time: "2026-03-17T10:00",

    total_amount: 120,
    is_refundable: true,

    status: "active"
  },

  {
    id: 2,
    space_id: 1,
    slot_id: "A1",

    vehicle_number: "TN10XY5678",

    arrival: "2026-03-20T10:00",
    leaving: "2026-03-20T12:00",
    booking_time: "2026-03-18T09:00",

    total_amount: 100,
    is_refundable: true,

    status: "upcoming"
  },

  {
    id: 3,
    space_id: 2,
    slot_id: "B2",

    vehicle_number: "TN22ZZ9999",

    arrival: "2026-03-10T09:00",
    leaving: "2026-03-10T11:00",
    booking_time: "2026-03-09T08:00",

    total_amount: 80,
    is_refundable: false,

    status: "past"
  }
];
const mockLocations = [
  {
    name: "Anna Nagar, Chennai",
    lat: 13.0850,
    lng: 80.2101
  },
  {
    name: "T Nagar, Chennai",
    lat: 13.0418,
    lng: 80.2341
  },
  {
    name: "Velachery, Chennai",
    lat: 12.9750,
    lng: 80.2200
  },
  {
    name: "OMR, Chennai",
    lat: 12.9000,
    lng: 80.2300
  },
  {
    name: "Marina Beach, Chennai",
    lat: 13.0505,
    lng: 80.2824
  }
];
/* RENDER */
function renderSpaces() {
  spaceList.innerHTML = "";

  spaces.forEach(s => {
const f = s.facilities || {};

const facilities = [
  f.cctv && "CCTV",
  f.ev_charging && "EV",
  f.guarded && "Guarded",
  f.covered_fence && "Covered"
]
.filter(Boolean)
.map(f => `<span class="chip">${f}</span>`)
.join("");
    spaceList.innerHTML += `
      <div class="space-card">

        <div class="space-header">
          <div>
            <h3>${s.name}</h3>
            <span class="badge ${s.type}">${s.type}</span>
          </div>
          <div class="rating">⭐ ${s.rating || 0}</div>
        </div>

        <div class="space-body">
          <p>📍 ${s.location}</p>
          <p>₹${s.price_per_hour}/hr</p>
          <div class="chips">${facilities}</div>
        </div>

<div class="space-actions">
  <button onclick="manageSlots(${s.id})">Slots</button>
  <button onclick="viewBookings(${s.id})">Bookings</button>
  <button onclick="openTimeline(${s.id})">Timeline</button> <!-- ✅ ADD HERE -->
  <button onclick="openMore(${s.id})">More</button>
  <button onclick="editSpace(${s.id})">Edit</button>
  <button onclick="deleteSpace(${s.id})">Delete</button>
</div>

      </div>
    `;
  });
}
function openMore(id) {
  const s = spaces.find(x => x.id === id);
const f = s.facilities || {};

const facilityHTML = [
  f.cctv ? "CCTV" : "",
  f.ev_charging ? "EV Charging" : "",
  f.guarded ? "Guarded" : "",
  f.covered_fence ? "Covered Fence" : ""
]
.filter(x => x !== "")
.map(x => `<span class="chip">${x}</span>`)
.join("");
  openModal(`
    <div class="modal-header">
      <div>
        <div class="modal-title">${s.name}</div>
        <div class="modal-sub">${s.location}</div>
      </div>
    </div>

    <div class="field">
      <b>Type:</b> ${s.type}
    </div>

    <div class="field">
      <b>Price:</b> ₹${s.price_per_hour}/hr
    </div>

    <div class="field">
      <b>City:</b> ${s.city}
    </div>

    <div class="field">
      <b>Status:</b> ${s.is_active ? "Active" : "Inactive"}
    </div>

<div class="field">
  <b>Facilities:</b>
  <div class="chips">${facilityHTML || "None"}</div>
</div>

    <div class="field">
      <b>Notes:</b> ${s.notes || "—"}
    </div>

    <div class="field">
      <b>Coordinates:</b> ${s.latitude}, ${s.longitude}
    </div>

    <iframe
      width="100%"
      height="250"
      style="border-radius:10px;border:0"
      src="https://www.google.com/maps?q=${s.latitude},${s.longitude}&output=embed">
    </iframe>
  `);
}
/* MODAL */
function openModal(content) {
  overlay.style.display = "block";
  modal.style.display = "flex";

  modal.innerHTML = `
    <div class="modal-header">
      <div>
        <div class="modal-title">Details</div>
      </div>
      <button class="close-btn" onclick="closeModal()">✖</button>
    </div>

    <div class="modal-body">
      ${content}
    </div>
  `;
}

function closeModal() {
  overlay.style.display = "none";
  modal.style.display = "none";
}

/* ADD SPACE */
function openAddSpace() {
  openModal(`
    <div class="modal-header">
      <div>
        <div class="modal-title">Add Space</div>
        <div class="modal-sub">Enter details</div>
      </div>
    </div>

    <!-- BASIC -->
    <div class="field">
      <label>Name *</label>
      <input id="name">
    </div>

    <div class="field">
      <label>Type *</label>
      <select id="type">
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
    </div>

    <div class="field">
      <label>Price/hr *</label>
      <input id="price" type="number">
    </div>

    <!-- LOCATION -->
    <div class="field">
      <button onclick="useCurrentLocation()">📍 Use Current Location</button>
    </div>

<div class="field">
  <label>Search Location</label>
  <div class="search-wrapper">
    <input id="searchInput" placeholder="Search for area, street...">
    <div id="searchDropdown" class="search-dropdown"></div>
  </div>
</div>

    <div class="field">
      <label>Extracted Location</label>
      <p id="locationPreview">Not selected</p>
    </div>

    <!-- FACILITIES -->
<div class="field">
  <label>Facilities</label>

  <div class="facility-group">
    <label class="facility-item">
      <input type="checkbox" id="cctv">
      <span>CCTV</span>
    </label>

    <label class="facility-item">
      <input type="checkbox" id="ev">
      <span>EV Charging</span>
    </label>

    <label class="facility-item">
      <input type="checkbox" id="guarded">
      <span>Guarded</span>
    </label>

    <label class="facility-item">
      <input type="checkbox" id="covered">
      <span>Covered</span>
    </label>
  </div>
</div>

    <div class="field">
      <label>Notes</label>
      <textarea id="notes"></textarea>
    </div>

    <button class="submit-btn" onclick="addSpace()">Add Space</button>
  `);
setTimeout(() => {
  initMockSearch();
}, 100);
}let tempLocation = {};

function useCurrentLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then(res => res.json())
      .then(data => {
        tempLocation = {
          location: data.display_name,
          city: data.address.city || data.address.town,
          latitude: lat,
          longitude: lng
        };

        locationPreview.innerText = tempLocation.location;
      });
  });
}


function addSpace() {
  spaces.push({
    id: Date.now(),
    name: name.value,
    type: type.value,
    price_per_hour: price.value,
    ...tempLocation,
    cctv: cctv.checked,
    ev_charging: ev.checked,
    guarded: guarded.checked,
    covered_fence: covered.checked,
    notes: notes.value,
    is_active: true,
    rating: 0,
    slots: []
  });

  closeModal();
  renderSpaces();
}

/* DELETE */
function deleteSpace(id) {
  spaces = spaces.filter(s => s.id !== id);
  renderSpaces();
}

/* PLACEHOLDERS */
function manageSlots(id) {
  openModal("<h3>Slot Management Coming Soon</h3>");
}

function viewBookings(id) {
  openModal("<h3>Bookings View Coming Soon</h3>");
}

function editSpace(id) {
  const s = spaces.find(x => x.id === id);
  const f = s.facilities || {};

  openModal(`
    <div class="section">
      <h3>Edit Space</h3>
    </div>

    <!-- NAME -->
    <div class="field">
      <label>Name</label>
      <input id="edit_name" value="${s.name}">
    </div>

    <!-- PRICE -->
    <div class="field">
      <label>Price per hour</label>
      <input id="edit_price" type="number" value="${s.price_per_hour}">
    </div>

    <!-- FACILITIES -->
    <div class="field">
      <label>Facilities</label>
      <div class="checkbox-group">
        <label><input type="checkbox" id="edit_cctv" ${f.cctv ? "checked" : ""}> CCTV</label>
        <label><input type="checkbox" id="edit_ev" ${f.ev_charging ? "checked" : ""}> EV Charging</label>
        <label><input type="checkbox" id="edit_guarded" ${f.guarded ? "checked" : ""}> Guarded</label>
        <label><input type="checkbox" id="edit_covered" ${f.covered_fence ? "checked" : ""}> Covered</label>
      </div>
    </div>

    <!-- NOTES -->
    <div class="field">
      <label>Notes</label>
      <textarea id="edit_notes">${s.notes || ""}</textarea>
    </div>

    <!-- ACTION -->
    <div class="slot-actions">
      <button onclick="updateSpace(${id})" class="primary-btn">Save Changes</button>
    </div>
  `);
}
function updateSpace(id) {
  const s = spaces.find(x => x.id === id);

  // update basic fields
  s.name = document.getElementById("edit_name").value;
  s.price_per_hour = Number(document.getElementById("edit_price").value);
  s.notes = document.getElementById("edit_notes").value;

  // update facilities (IMPORTANT STRUCTURE)
  s.facilities = {
    cctv: document.getElementById("edit_cctv").checked,
    ev_charging: document.getElementById("edit_ev").checked,
    guarded: document.getElementById("edit_guarded").checked,
    covered_fence: document.getElementById("edit_covered").checked
  };

  closeModal();
  renderSpaces();
}
/* INIT */
renderSpaces();
let autocomplete;

function initAutocomplete() {
  const input = document.getElementById("searchInput");

  if (!input) return; // safety

  autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["geocode"]
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    if (!place.geometry) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address;

    // ✅ FIX: use tempLocation (not selectedLocation)
    tempLocation = {
      location: address,
      city: place.address_components?.find(c =>
        c.types.includes("locality")
      )?.long_name || "",
      latitude: lat,
      longitude: lng
    };

    // ✅ update UI
    document.getElementById("locationPreview").innerText = address;
  });
}
function initMockSearch() {
  const input = document.getElementById("searchInput");
  const dropdown = document.getElementById("searchDropdown");

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();

    if (!value) {
      dropdown.style.display = "none";
      return;
    }

    const matches = mockLocations.filter(loc =>
      loc.name.toLowerCase().includes(value)
    );

    dropdown.innerHTML = matches.map(loc => `
      <div onclick="selectLocation('${loc.name}', ${loc.lat}, ${loc.lng})">
        📍 ${loc.name}
      </div>
    `).join("");

    dropdown.style.display = "block";
  });
}

function selectLocation(name, lat, lng) {
  document.getElementById("searchInput").value = name;
  document.getElementById("searchDropdown").style.display = "none";

  tempLocation = {
    location: name,
    city: name.split(",")[0],
    latitude: lat,
    longitude: lng
  };

  document.getElementById("locationPreview").innerText = name;
}
function manageSlots(spaceId) {
  const space = spaces.find(s => s.id === spaceId);

  const rows = space.slots.map(slot => {
    const booking = getSlotBooking(spaceId, slot.id);

    let status = slot.status;
    let bookingInfo = "-";

    if (booking) {
      status = "occupied";
      bookingInfo = booking.vehicle_number;
    }

    return `
      <tr>
        <td>${slot.id}</td>

        <td class="status ${status}">
          ${status}
        </td>

        <td>
          ${bookingInfo}
        </td>

        <td>
          ${
            status === "occupied"
              ? `<button disabled style="opacity:0.5">Occupied</button>`
              : `<button onclick="toggleSlot(${spaceId}, '${slot.id}')">
                  ${status === "free" ? "Block" : "Free"}
                </button>`
          }
        </td>
            <td>
      ${
        status === "occupied"
          ? `<button disabled style="opacity:0.5">Delete</button>`
          : `<button onclick="deleteSlot(${spaceId}, '${slot.id}')" class="danger-btn">
              Delete
            </button>`
      }
    </td>
      </tr>
    `;
  }).join("");

  openModal(`
    <h3>${space.name} - Slots</h3>

    <table class="slot-table">
      <thead>
        <tr>
          <th>Slot</th>
          <th>Status</th>
          <th>Vehicle</th>
          <th>Action</th>
          <th>Delete</th>
        </tr>
      </thead>

      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="slot-actions">
      <input id="newSlot" placeholder="New slot">
      <button onclick="addSlot(${spaceId})">Add Slot</button>
    </div>
  `);
}
function deleteSlot(spaceId, slotId) {
  const space = spaces.find(s => s.id === spaceId);

  // safety check (extra layer)
  const hasBooking = bookings.some(b =>
    b.space_id === spaceId &&
    b.slot_id === slotId &&
    (b.status === "active" || b.status === "upcoming")
  );

  if (hasBooking) {
    openModal("<p>This slot has active/upcoming bookings and cannot be deleted.</p>");
    return;
  }

  space.slots = space.slots.filter(s => s.id !== slotId);

  manageSlots(spaceId);
}
function toggleSlot(spaceId, slotId) {
  const space = spaces.find(s => s.id === spaceId);
  const slot = space.slots.find(s => s.id === slotId);

  // 🚫 Prevent changing occupied slot
  if (slot.status === "occupied") {
    openModal("<p>This slot is currently occupied and cannot be modified.</p>");
    return;
  }

  slot.status = slot.status === "free" ? "blocked" : "free";

  manageSlots(spaceId);
}
function updateSlotStatus() {
  spaces.forEach(space => {
    space.slots.forEach(slot => {
      const hasActiveBooking = bookings.some(b =>
        b.space_id === space.id &&
        b.slot_id === slot.id &&
        (b.status === "active" || b.status === "upcoming")
      );

      if (hasActiveBooking) {
        slot.status = "occupied";
      }
    });
  });
}
function addSlot(spaceId) {
  const value = document.getElementById("newSlot").value;

  if (!value) return;

  const space = spaces.find(s => s.id === spaceId);

  space.slots.push({
    id: value,
    status: "free"
  });

  manageSlots(spaceId);
}
function viewBookings(spaceId) {
  const space = spaces.find(s => s.id === spaceId);

  openModal(`
    <h3>${space.name} - Bookings</h3>

    <!-- TABS -->
    <div class="booking-tabs">
      <button onclick="filterBookings(${spaceId}, 'all')" class="tab active">All</button>
      <button onclick="filterBookings(${spaceId}, 'active')" class="tab">Active</button>
      <button onclick="filterBookings(${spaceId}, 'upcoming')" class="tab">Upcoming</button>
      <button onclick="filterBookings(${spaceId}, 'past')" class="tab">Past</button>
    </div>

    <!-- SLOT FILTER -->
    <div class="booking-filter">
      <select onchange="filterBookings(${spaceId}, 'all', this.value)">
        <option value="">All Slots</option>
        ${space.slots.map(s => `<option value="${s.id}">${s.id}</option>`).join("")}
      </select>
    </div>

    <!-- TABLE -->
    <div id="bookingTable"></div>
  `);

  filterBookings(spaceId, "all");
}
function filterBookings(spaceId, status = "all", slot = "") {
  let filtered = bookings.filter(b => b.space_id === spaceId);

  if (status !== "all") {
    filtered = filtered.filter(b => b.status === status);
  }

  if (slot) {
    filtered = filtered.filter(b => b.slot_id === slot);
  }

  renderBookingTable(filtered);

  // highlight active tab
  document.querySelectorAll(".tab").forEach(btn => {
    btn.classList.remove("active");
    if (btn.innerText.toLowerCase() === status) {
      btn.classList.add("active");
    }
  });
}
function renderBookingTable(data) {
  const rows = data.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.slot_id}</td>
      <td>${b.vehicle_number || "-"}</td>
      <td>${formatDate(b.arrival)}</td>
      <td>${formatDate(b.leaving)}</td>
      <td>${formatDate(b.booking_time)}</td>
      <td>₹${b.total_amount}</td>
      <td class="${b.is_refundable ? "yes" : "no"}">
        ${b.is_refundable ? "Yes" : "No"}
      </td>
    </tr>
  `).join("");

  document.getElementById("bookingTable").innerHTML = `
    <table class="booking-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Slot</th>
          <th>Vehicle</th>
          <th>Arrival</th>
          <th>Leaving</th>
          <th>Booked At</th>
          <th>Amount</th>
          <th>Refundable</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="8">No bookings found</td></tr>`}
      </tbody>
    </table>
  `;
}
function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleString();
}

function getSlotBooking(spaceId, slotId) {
  return bookings.find(b =>
    b.space_id === spaceId &&
    b.slot_id === slotId &&
    (b.status === "active" || b.status === "upcoming")
  );
}

function openTimeline(spaceId) {
  const space = spaces.find(s => s.id === spaceId);

  const startHour = 6;   // timeline start
  const endHour = 24;    // timeline end

  const timelineRows = space.slots.map(slot => {
    const slotBookings = bookings.filter(b =>
      b.space_id === spaceId && b.slot_id === slot.id
    );

    const bars = slotBookings.map(b => {
      const start = new Date(b.arrival).getHours();
      const end = new Date(b.leaving).getHours();

      const left = ((start - startHour) / (endHour - startHour)) * 100;
      const width = ((end - start) / (endHour - startHour)) * 100;

      return `
        <div class="timeline-bar ${b.status}"
             style="left:${left}%; width:${width}%">
          ${b.vehicle_number}
        </div>
      `;
    }).join("");

    return `
      <div class="timeline-row">
        <div class="slot-label">${slot.id}</div>
        <div class="timeline-track">
          ${bars}
        </div>
      </div>
    `;
  }).join("");

  openModal(`
    <h3>${space.name} - Timeline</h3>

    <div class="timeline-header">
      ${generateTimelineHours(startHour, endHour)}
    </div>

    <div class="timeline-container">
      ${timelineRows}
    </div>
  `);
}
function generateTimelineHours(start, end) {
  let hours = "";

  for (let i = start; i <= end; i++) {
    hours += `<div>${i}:00</div>`;
  }

  return hours;
}