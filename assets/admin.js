const STORAGE_KEY = "toxexpress_shipments_v1";

function readShipments() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveShipments(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function generateTrackingCode() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const serial = Math.floor(Math.random() * 9000) + 1000;
  return `TX-${datePart}-${serial}`;
}

function statusClass(status) {
  switch (status) {
    case "On Hold":
      return "badge badge-hold";
    case "Processing":
      return "badge badge-processing";
    case "Delivered":
      return "badge badge-delivered";
    default:
      return "badge badge-transit";
  }
}

function setKpi(shipments) {
  const total = shipments.length;
  const transit = shipments.filter((item) => item.status === "In Transit").length;
  const hold = shipments.filter((item) => item.status === "On Hold").length;
  const totalWeight = shipments.reduce((sum, item) => sum + Number(item.weightKg || 0), 0);

  document.getElementById("admin-kpi-total").textContent = total;
  document.getElementById("admin-kpi-transit").textContent = transit;
  document.getElementById("admin-kpi-hold").textContent = hold;
  document.getElementById("admin-kpi-weight").textContent = totalWeight.toFixed(1);
}

function renderTable(shipments, query = "") {
  const tbody = document.getElementById("admin-table-body");
  const empty = document.getElementById("admin-empty");
  const keyword = query.trim().toLowerCase();
  const filtered = shipments.filter((item) => {
    if (!keyword) {
      return true;
    }

    const haystack = [
      item.trackingCode,
      item.productName,
      item.recipient,
      item.origin,
      item.destination,
      item.priority,
      item.status,
    ].join(" ").toLowerCase();

    return haystack.includes(keyword);
  });

  tbody.innerHTML = "";
  if (!filtered.length) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  for (const item of filtered) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.trackingCode}</td>
      <td>${item.origin} → ${item.destination}</td>
      <td>${item.productName}</td>
      <td>${item.recipient}</td>
      <td>${Number(item.weightKg).toFixed(1)} kg</td>
      <td>${item.priority}</td>
      <td><span class="${statusClass(item.status)}">${item.status}</span></td>
      <td>
        <div class="action-row">
          <select class="status-select" data-action="status" data-id="${item.id}">
            <option value="In Transit" ${item.status === "In Transit" ? "selected" : ""}>In Transit</option>
            <option value="Processing" ${item.status === "Processing" ? "selected" : ""}>Processing</option>
            <option value="Delivered" ${item.status === "Delivered" ? "selected" : ""}>Delivered</option>
            <option value="On Hold" ${item.status === "On Hold" ? "selected" : ""}>On Hold</option>
          </select>
          <button type="button" data-action="hold" data-id="${item.id}">${item.status === "On Hold" ? "Release" : "Hold"}</button>
          <button type="button" data-action="delete" data-id="${item.id}">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  }
}

function handleTableActions(event, shipments, rerender) {
  const action = event.target.getAttribute("data-action");
  const id = event.target.getAttribute("data-id");
  if (!action || !id) {
    return;
  }

  const index = shipments.findIndex((item) => item.id === id);
  if (index === -1) {
    return;
  }

  if (action === "delete") {
    shipments.splice(index, 1);
  }

  if (action === "hold") {
    shipments[index].status = shipments[index].status === "On Hold" ? "In Transit" : "On Hold";
  }

  if (action === "status") {
    shipments[index].status = event.target.value;
  }

  saveShipments(shipments);
  rerender();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("shipment-form");
  const searchInput = document.getElementById("search-input");
  const message = document.getElementById("form-message");
  const codeInput = document.getElementById("trackingCode");
  const generateBtn = document.getElementById("generate-code-btn");
  const tableBody = document.getElementById("admin-table-body");

  let shipments = readShipments();

  const rerender = () => {
    setKpi(shipments);
    renderTable(shipments, searchInput.value);
  };

  codeInput.value = generateTrackingCode();
  rerender();

  generateBtn.addEventListener("click", () => {
    codeInput.value = generateTrackingCode();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nextRecord = {
      id: crypto.randomUUID(),
      trackingCode: codeInput.value.trim(),
      productName: form.productName.value.trim(),
      recipient: form.recipient.value.trim(),
      weightKg: Number(form.weightKg.value),
      origin: form.origin.value.trim(),
      destination: form.destination.value.trim(),
      priority: form.priority.value,
      status: form.status.value,
      createdAt: new Date().toISOString(),
    };

    shipments.unshift(nextRecord);
    saveShipments(shipments);
    form.reset();
    codeInput.value = generateTrackingCode();
    message.textContent = `Shipment ${nextRecord.trackingCode} created successfully.`;
    rerender();

    setTimeout(() => {
      message.textContent = "";
    }, 2600);
  });

  searchInput.addEventListener("input", () => {
    renderTable(shipments, searchInput.value);
  });

  tableBody.addEventListener("click", (event) => {
    handleTableActions(event, shipments, rerender);
  });

  tableBody.addEventListener("change", (event) => {
    if (event.target.matches("select[data-action='status']")) {
      handleTableActions(event, shipments, rerender);
    }
  });
});
