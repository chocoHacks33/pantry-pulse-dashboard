const pantryItems = [
  { id: 1, name: "Jasmine rice", category: "Grains", quantity: 2, unit: "bags", unitPrice: 8.9, expires: "2027-06-18", restockAt: 1 },
  { id: 2, name: "Chickpeas", category: "Canned goods", quantity: 4, unit: "cans", unitPrice: 1.85, expires: "2027-09-03", restockAt: 2 },
  { id: 3, name: "Rolled oats", category: "Breakfast", quantity: 1, unit: "pack", unitPrice: 5.4, expires: "2026-12-01", restockAt: 1 },
  { id: 4, name: "Coconut milk", category: "Canned goods", quantity: 2, unit: "cans", unitPrice: 2.2, expires: "2026-11-26", restockAt: 2 },
  { id: 5, name: "Peanut butter", category: "Spreads", quantity: 1, unit: "jar", unitPrice: 6.75, expires: "2027-03-14", restockAt: 1 },
  { id: 6, name: "Wholemeal pasta", category: "Grains", quantity: 3, unit: "packs", unitPrice: 3.15, expires: "2027-04-22", restockAt: 2 },
  { id: 7, name: "Green lentils", category: "Pulses", quantity: 2, unit: "packs", unitPrice: 4.1, expires: "2027-01-19", restockAt: 1 },
  { id: 8, name: "Tomato passata", category: "Sauces", quantity: 1, unit: "bottle", unitPrice: 3.8, expires: "2026-11-29", restockAt: 2 },
];

const {
  formatCurrency,
  getCategoryBreakdown,
  getInventorySummary,
  getItemValue,
} = PantryMetrics;

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function createCell(value, className = "") {
  const cell = document.createElement("td");
  cell.textContent = value;
  if (className) cell.className = className;
  return cell;
}

function renderInventory(items) {
  const body = document.getElementById("inventory-body");
  body.replaceChildren();

  for (const item of items) {
    const row = document.createElement("tr");
    const categoryCell = document.createElement("td");
    const category = document.createElement("span");

    category.className = "category-pill";
    category.textContent = item.category;
    categoryCell.append(category);

    row.append(
      createCell(item.name, "item-name"),
      categoryCell,
      createCell(`${item.quantity} ${item.unit}`, "number-cell"),
      createCell(formatCurrency(item.unitPrice), "number-cell"),
      createCell(formatCurrency(getItemValue(item)), "number-cell"),
    );
    body.append(row);
  }
}

function renderCategoryInsights(items) {
  const container = document.getElementById("category-insights");
  container.replaceChildren();

  for (const insight of getCategoryBreakdown(items)) {
    const card = document.createElement("article");
    const heading = document.createElement("div");
    const label = document.createElement("strong");
    const value = document.createElement("span");
    const track = document.createElement("div");
    const fill = document.createElement("div");

    card.className = "category-insight";
    heading.className = "insight-heading";
    label.textContent = insight.category;
    value.textContent = `${formatCurrency(insight.value)} · ${insight.percent}%`;
    track.className = "value-track";
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", `${insight.category} share of inventory value`);
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-valuenow", String(insight.percent));
    fill.className = "value-fill";
    fill.style.width = `${insight.percent}%`;

    heading.append(label, value);
    track.append(fill);
    card.append(heading, track);
    container.append(card);
  }
}

function renderDashboard() {
  const summary = getInventorySummary(pantryItems);

  setText("item-count", summary.totalItems);
  setText("unit-count", summary.totalUnits);
  setText("inventory-value", formatCurrency(summary.totalValue));
  setText("category-count", summary.categoryCount);
  setText("last-updated", `Updated ${new Intl.DateTimeFormat("en-SG", { dateStyle: "medium" }).format(new Date())}`);
  renderCategoryInsights(pantryItems);
  renderInventory(pantryItems);
}

renderDashboard();

