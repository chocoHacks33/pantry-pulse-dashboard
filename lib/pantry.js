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

  function getRestockItems(items) {
    return items
      .map((item) => ({
        ...item,
        unitsNeeded: Math.max(item.restockAt + 1 - item.quantity, 0),
      }))
      .filter((item) => item.unitsNeeded > 0)
      .sort((first, second) => second.unitsNeeded - first.unitsNeeded || first.name.localeCompare(second.name));
  }

  return {
    formatCurrency,
    getInventorySummary,
    getItemValue,
    getRestockItems,
  };
});

