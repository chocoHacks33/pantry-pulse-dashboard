(function exposePantryMetrics(root, factory) {
  const metrics = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = metrics;
  }

  if (root) {
    root.PantryMetrics = metrics;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createPantryMetrics() {
  function getItemValue(item) {
    return Number((item.quantity * item.unitPrice).toFixed(2));
  }

  function getInventorySummary(items) {
    const categories = new Set();
    let totalUnits = 0;
    let totalValue = 0;

    for (const item of items) {
      categories.add(item.category);
      totalUnits += item.quantity;
      totalValue += getItemValue(item);
    }

    return {
      totalItems: items.length,
      totalUnits,
      totalValue: Number(totalValue.toFixed(2)),
      categoryCount: categories.size,
    };
  }

  function formatCurrency(amount, currency = "SGD") {
    return new Intl.NumberFormat("en-SG", {
      style: "currency",
      currency,
    }).format(amount);
  }

  function escapeCsvCell(value) {
    let text = value == null ? "" : String(value);

    if (/^\s*[=+\-@]/.test(text)) {
      text = `'${text}`;
    }

    return `"${text.replace(/"/g, '""')}"`;
  }

  function buildInventoryCsv(items) {
    const rows = [
      ["Item", "Category", "Quantity", "Unit", "Unit price", "Estimated value", "Expires"],
      ...items.map((item) => [
        item.name,
        item.category,
        item.quantity,
        item.unit,
        item.unitPrice.toFixed(2),
        getItemValue(item).toFixed(2),
        item.expires,
      ]),
    ];

    return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
  }

  return {
    buildInventoryCsv,
    escapeCsvCell,
    formatCurrency,
    getInventorySummary,
    getItemValue,
  };
});

