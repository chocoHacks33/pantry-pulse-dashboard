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

  function getDaysUntilExpiry(expiryDate, today = new Date()) {
    const [year, month, day] = expiryDate.split("-").map(Number);
    const expiryDay = Date.UTC(year, month - 1, day);
    const currentDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.round((expiryDay - currentDay) / 86_400_000);
  }

  function getExpiringItems(items, today = new Date(), withinDays = 7) {
    return items
      .map((item) => ({ ...item, daysUntil: getDaysUntilExpiry(item.expires, today) }))
      .filter((item) => item.daysUntil >= 0 && item.daysUntil <= withinDays)
      .sort((first, second) => first.daysUntil - second.daysUntil || first.name.localeCompare(second.name));
  }

  return {
    formatCurrency,
    getDaysUntilExpiry,
    getExpiringItems,
    getInventorySummary,
    getItemValue,
  };
});

