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

function renderKpi(shipments) {
  const total = shipments.length;
  const transit = shipments.filter((item) => item.status === "In Transit").length;
  const hold = shipments.filter((item) => item.status === "On Hold").length;
  const totalWeight = shipments.reduce((sum, item) => sum + Number(item.weightKg || 0), 0);

  document.getElementById("kpi-total").textContent = total;
  document.getElementById("kpi-transit").textContent = transit;
  document.getElementById("kpi-hold").textContent = hold;
  document.getElementById("kpi-weight").textContent = totalWeight.toFixed(1);
}

function renderLiveRows(shipments) {
  const body = document.getElementById("shipment-live-body");
  const empty = document.getElementById("shipment-empty");

  body.innerHTML = "";
  if (!shipments.length) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  const sorted = shipments
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12);

  for (const item of sorted) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="padding:12px 10px;border-bottom:1px solid rgba(148,163,184,0.18);">${item.trackingCode}</td>
      <td style="padding:12px 10px;border-bottom:1px solid rgba(148,163,184,0.18);">${item.origin} → ${item.destination}</td>
      <td style="padding:12px 10px;border-bottom:1px solid rgba(148,163,184,0.18);">${item.productName}</td>
      <td style="padding:12px 10px;border-bottom:1px solid rgba(148,163,184,0.18);">${Number(item.weightKg).toFixed(1)} kg</td>
      <td style="padding:12px 10px;border-bottom:1px solid rgba(148,163,184,0.18);">${item.priority}</td>
      <td style="padding:12px 10px;border-bottom:1px solid rgba(148,163,184,0.18);">${item.status}</td>
      <td style="padding:12px 10px;border-bottom:1px solid rgba(148,163,184,0.18);">${new Date(item.createdAt).toLocaleString()}</td>
    `;
    body.appendChild(row);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const shipments = readShipments();
  renderKpi(shipments);
  renderLiveRows(shipments);

  const cards = document.querySelectorAll(".grid-4 .card");
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(12px)";
    card.style.transition = "opacity 360ms ease, transform 360ms ease";

    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 100 * (index + 1));
  });
});
