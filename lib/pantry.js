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

  function calculateBudgetProgress(spent, target) {
    if (!Number.isFinite(target) || target <= 0) {
      throw new RangeError("Budget target must be a positive number");
    }

    const safeSpent = Number.isFinite(spent) && spent > 0 ? spent : 0;
    const percent = Math.round((safeSpent / target) * 100);

    return {
      spent: Number(safeSpent.toFixed(2)),
      target: Number(target.toFixed(2)),
      remaining: Number(Math.max(target - safeSpent, 0).toFixed(2)),
      overBy: Number(Math.max(safeSpent - target, 0).toFixed(2)),
      percent,
    };
  }

  return {
    calculateBudgetProgress,
    formatCurrency,
    getInventorySummary,
    getItemValue,
  };
});

