let bookings = [
  {
    id: 1,
    status: "active",
    total: 120,
    arrival: "2026-03-18T14:00",
    leaving: "2026-03-18T16:00",
    slots: "A1",
    space: {
      name: "Express Mall Parking",
      location: "Royapettah, Chennai",
      type: "public",
      lat: 13.0500,
      lng: 80.2600,
      price_per_hour: 40
    }
  },
  {
    id: 2,
    status: "upcoming",
    total: 180,
    arrival: "2026-03-19T10:00",
    leaving: "2026-03-19T12:00",
    slots: "B2",
    space: {
      name: "Metro Residency Driveway",
      location: "Anna Nagar, Chennai",
      type: "private",
      lat: 13.0850,
      lng: 80.2101,
      price_per_hour: 50
    }
  },
  {
    id: 3,
    status: "past",
    total: 90,
    arrival: "2026-03-10T09:00",
    leaving: "2026-03-10T10:30",
    slots: "C3",
    space: {
      name: "Central Plaza Basement",
      location: "T Nagar, Chennai",
      type: "public",
      lat: 13.0418,
      lng: 80.2341,
      price_per_hour: 30
    }
  },
  {
    id: 4,
    status: "cancelled",
    total: 150,
    arrival: "2026-03-12T11:00",
    leaving: "2026-03-12T13:00",
    slots: "D4",
    space: {
      name: "Beachside Parking",
      location: "Marina Beach, Chennai",
      type: "private",
      lat: 13.0505,
      lng: 80.2824,
      price_per_hour: 45
    }
  }
];
/* RENDER */
function render(data = bookings) {
  bookingList.innerHTML = "";
  bookingCount.innerText = data.length + " items";

  data.forEach(b => {
    const isActiveOrUpcoming = b.status === "active" || b.status === "upcoming";

    let actions = `
      <button class="btn-primary" onclick="openMap(${b.space.lat}, ${b.space.lng})">Directions</button>
      <button onclick="openContact()">Contact</button>
      <button onclick="downloadReceipt(${b.id})">Receipt</button>
    `;

    if (isActiveOrUpcoming) {
      actions += `<button onclick="">QR</button><button onclick="extendBooking()">Extend</button>`;
    }

    if (b.status === "upcoming") {
      actions += `<button class="btn-danger" onclick="cancelBooking(${b.id})">Cancel</button>`;
    }

    const card = `
      <div class="card ${b.status}">
        <div class="card-info">
          <h3>
            ${b.space.name}
            <span class="badge ${b.space.type}">${b.space.type.charAt(0).toUpperCase() + b.space.type.slice(1)}</span>
          </h3>
          <p>📍 ${b.space.location}</p>
          <p>Slot: ${b.slots}</p>
          <p>${new Date(b.arrival).toLocaleString()} → ${new Date(b.leaving).toLocaleString()}</p>
          <h4>₹${b.total}</h4>
<p>₹${b.space.price_per_hour}/hr</p>
        </div>
        <div class="card-divider"></div>
        <div class="card-actions">${actions}</div>
      </div>
    `;

    bookingList.innerHTML += card;
  });

  updateStats();
}

/* FILTERS */
function applyFilters() {
  const text = searchInput.value.toLowerCase();
  const status = statusFilter.value;
  const type = typeFilter.value;

  let filtered = bookings.filter(b =>
    (!status || b.status === status) &&
    (!type || b.space.type === type) &&
    (b.space.name.toLowerCase().includes(text) ||
     b.space.location.toLowerCase().includes(text))
  );

  render(filtered);
}

function resetFilters() {
  searchInput.value = "";
  statusFilter.value = "";
  typeFilter.value = "";
  sortFilter.value = "";
  render();
}

/* SEARCH DROPDOWN */
searchInput.addEventListener("input", () => {
  const val = searchInput.value.toLowerCase();
  if (!val) {
    searchDropdown.style.display = "none";
    return;
  }

  const matches = bookings.filter(b =>
    b.space.name.toLowerCase().includes(val)
  );

  searchDropdown.innerHTML = matches.map(m =>
    `<div onclick="selectSearch('${m.space.name}')">${m.space.name}</div>`
  ).join("");

  searchDropdown.style.display = "block";
});

function selectSearch(val) {
  searchInput.value = val;
  searchDropdown.style.display = "none";
  applyFilters();
}

/* MODAL */
function openModal(html) {
  overlay.style.display = "block";
  modal.style.display = "block";
  modal.innerHTML = html;
}

function closeModal() {
  overlay.style.display = "none";
  modal.style.display = "none";
}

/* MAP */
function openMap(lat, lng) {
  openModal(`
    <h3>Directions</h3>

    <iframe
      width="100%"
      height="300"
      style="border:0;border-radius:12px"
      loading="lazy"
      allowfullscreen
      src="https://www.google.com/maps?q=${lat},${lng}&hl=en&z=16&output=embed">
    </iframe>

    <div style="margin-top:10px;text-align:right;">
      <button onclick="closeModal()">Close</button>
    </div>
  `);
}

/* CONTACT */
function openContact() {
  openModal(`
    <div class="modal-header">
      <div>
        <div class="modal-title">Contact owner</div>
        <div class="modal-sub">We'll pass your details along directly</div>
      </div>
      <button class="close-btn" onclick="closeModal()">&#x2715;</button>
    </div>

    <div class="field-row">
      <div class="field">
        <label>Name</label>
        <input type="text" placeholder="Your name" />
      </div>
      <div class="field">
        <label>Phone</label>
        <input type="tel" placeholder="+91 00000 00000" />
      </div>
    </div>

    <div class="field">
      <label>Email</label>
      <input type="email" placeholder="you@example.com" />
    </div>

    <div class="field">
      <label>Preferred contact method</label>
      <select>
        <option value="" disabled selected>Select one…</option>
        <option>Email</option>
        <option>Phone call</option>
        <option>WhatsApp</option>
        <option>SMS</option>
      </select>
    </div>

    <div class="field">
      <label>Message</label>
      <textarea placeholder="Hi, I'm interested in your listing…"></textarea>
    </div>

    <hr class="modal-divider" />
    <button class="submit-btn">Send request</button>
    <p class="footer-note">The owner typically responds within 24 hours</p>
  `);
}

/* CANCEL RULE */
function cancelBooking(id) {
  const b = bookings.find(x => x.id === id);
  const diff = (new Date(b.arrival) - new Date()) / 3600000;

  if (diff < 4) {
    openModal("<p>Cannot cancel within 4 hours</p>");
    return;
  }

  b.status = "cancelled";
  render();
}

/* RECEIPT */
function downloadReceipt(id) {
  const b = bookings.find(x => x.id === id);

  const win = window.open();
  win.document.write(`
    <h2>Receipt</h2>
    <p>${b.space.name}</p>
    <p>${b.space.location}</p>
    <p>Slot: ${b.slots}</p>
    <p>Total: ₹${b.total}</p>
  `);
  win.print();
}

/* STATS */
function updateStats() {
  activeCount.innerText = bookings.filter(b=>b.status==="active").length;
  upcomingCount.innerText = bookings.filter(b=>b.status==="upcoming").length;
  pastCount.innerText = bookings.filter(b=>b.status==="past").length;
  cancelCount.innerText = bookings.filter(b=>b.status==="cancelled").length;
}

/* STATUS CLICK */
function filterByStatus(status) {
  statusFilter.value = status;
  applyFilters();
}

/* TOGGLE */
function showOwner() {
  document.querySelector(".dashboard").style.display = "none";
  ownerView.style.display = "block";
}

function showUser() {
  document.querySelector(".dashboard").style.display = "block";
  ownerView.style.display = "none";
}

/* INIT */
render();