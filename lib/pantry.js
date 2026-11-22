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

  function filterInventoryByCategory(items, category) {
    if (!category || category === "all") return [...items];
    return items.filter((item) => item.category === category);
  }

  return {
    filterInventoryByCategory,
    formatCurrency,
    getInventorySummary,
    getItemValue,
  };
});

