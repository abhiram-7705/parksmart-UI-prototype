// MOCK USER DATA (replace later with backend)
const user = {
  user_name: "John Doe",
  email: "john@example.com",
  phone_number: "9876543210",
  role: "User",
  wallet_balance: 9550
};

// MOCK TRANSACTIONS
const transactions = [
  {
    transaction_id: 1,
    amount: 10000,
    description: "Added to wallet on first signup",
    timestamp: "2026-04-15",
    transaction_type: "CREDIT"
  },
  {
    transaction_id: 2,
    amount: 50,
    description: "Parking payment",
    timestamp: "2026-04-16",
    transaction_type: "DEBIT"
  },
    {
    transaction_id: 3,
    amount: 150,
    description: "Parking payment",
    timestamp: "2026-04-16",
    transaction_type: "DEBIT"
  },
    {
    transaction_id: 4,
    amount: 250,
    description: "Parking payment",
    timestamp: "2026-04-16",
    transaction_type: "DEBIT"
  }
];

// LOAD DATA
document.getElementById("userName").innerText = user.user_name;
document.getElementById("userEmail").innerText = user.email;
document.getElementById("userPhone").innerText = user.phone_number;
document.getElementById("userRole").innerText = user.role;
document.getElementById("walletBalance").innerText = "₹" + user.wallet_balance;

// RENDER TRANSACTIONS
const tbody = document.getElementById("transactionBody");

transactions.forEach(t => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${t.transaction_id}</td>
    <td>₹${t.amount}</td>
    <td>${t.transaction_type}</td>
    <td>${t.description}</td>
    <td>${t.timestamp}</td>
  `;

  tbody.appendChild(row);
});

// TOGGLE TABLE
function toggleTransactions() {
  document.getElementById("transactionsTable")
    .classList.toggle("collapsed");
}

// ADD BALANCE MODAL
document.getElementById("addBalanceBtn").onclick = () => {
  document.getElementById("balanceModal").classList.add("active");
};

document.getElementById("closeModal").onclick = () => {
  document.getElementById("balanceModal").classList.remove("active");
};

window.onclick = (e) => {
  if (e.target.id === "balanceModal") {
    document.getElementById("balanceModal").classList.remove("active");
  }
};