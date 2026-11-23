const test = require("node:test");
const assert = require("node:assert/strict");

const {
  formatCurrency,
  getInventorySummary,
  getItemValue,
  sortInventory,
} = require("../lib/pantry.js");

test("sortInventory supports value and category order without mutating input", () => {
  const items = [
    { name: "Peanut butter", category: "Spreads", quantity: 1, unitPrice: 6.75 },
    { name: "Chickpeas", category: "Canned goods", quantity: 4, unitPrice: 1.85 },
    { name: "Coconut milk", category: "Canned goods", quantity: 2, unitPrice: 2.2 },
  ];

  assert.deepEqual(
    sortInventory(items, "value-high").map((item) => item.name),
    ["Chickpeas", "Peanut butter", "Coconut milk"],
  );
  assert.deepEqual(
    sortInventory(items, "category").map((item) => item.name),
    ["Chickpeas", "Coconut milk", "Peanut butter"],
  );
  assert.equal(items[0].name, "Peanut butter");
});

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

