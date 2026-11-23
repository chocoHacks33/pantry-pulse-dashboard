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

  function getCategoryBreakdown(items) {
    const valueByCategory = new Map();

    for (const item of items) {
      valueByCategory.set(
        item.category,
        Number(((valueByCategory.get(item.category) || 0) + getItemValue(item)).toFixed(2)),
      );
    }

    const totalValue = [...valueByCategory.values()].reduce(
      (total, value) => total + value,
      0,
    );

    return [...valueByCategory.entries()]
      .map(([category, value]) => ({
        category,
        value,
        percent: totalValue ? Number(((value / totalValue) * 100).toFixed(1)) : 0,
      }))
      .sort(
        (left, right) =>
          right.value - left.value ||
          left.category.localeCompare(right.category, "en-SG", { sensitivity: "base" }),
      );
  }

  return {
    formatCurrency,
    getCategoryBreakdown,
    getInventorySummary,
    getItemValue,
  };
});

