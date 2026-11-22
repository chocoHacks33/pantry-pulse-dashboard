const test = require("node:test");
const assert = require("node:assert/strict");

const {
  filterInventoryByCategory,
  formatCurrency,
  getInventorySummary,
  getItemValue,
} = require("../lib/pantry.js");

test("getItemValue multiplies quantity by unit price", () => {
  assert.equal(getItemValue({ quantity: 3, unitPrice: 2.45 }), 7.35);
});

test("getItemValue rounds floating point values to cents", () => {
  assert.equal(getItemValue({ quantity: 3, unitPrice: 1.005 }), 3.01);
});

test("getInventorySummary aggregates units, value, and distinct categories", () => {
  const summary = getInventorySummary([
    { category: "Grains", quantity: 2, unitPrice: 4.5 },
    { category: "Grains", quantity: 1, unitPrice: 3.25 },
    { category: "Spreads", quantity: 2, unitPrice: 5.1 },
  ]);

  assert.deepEqual(summary, {
    totalItems: 3,
    totalUnits: 5,
    totalValue: 22.45,
    categoryCount: 2,
  });
});

test("getInventorySummary handles an empty pantry", () => {
  assert.deepEqual(getInventorySummary([]), {
    totalItems: 0,
    totalUnits: 0,
    totalValue: 0,
    categoryCount: 0,
  });
});

test("formatCurrency uses Singapore dollar formatting by default", () => {
  assert.equal(formatCurrency(12.5), "$12.50");
});

test("filterInventoryByCategory returns only items in the selected category", () => {
  const items = [
    { name: "Rice", category: "Grains" },
    { name: "Oats", category: "Breakfast" },
    { name: "Pasta", category: "Grains" },
  ];

  assert.deepEqual(filterInventoryByCategory(items, "Grains"), [items[0], items[2]]);
});

test("filterInventoryByCategory preserves all items for the all option", () => {
  const items = [{ category: "Grains" }, { category: "Spreads" }];
  assert.deepEqual(filterInventoryByCategory(items, "all"), items);
  assert.notEqual(filterInventoryByCategory(items, "all"), items);
});

