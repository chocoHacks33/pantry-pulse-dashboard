const test = require("node:test");
const assert = require("node:assert/strict");

const {
  formatCurrency,
  getInventorySummary,
  getItemValue,
  getRestockItems,
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

test("getRestockItems includes stock at or below its threshold", () => {
  const result = getRestockItems([
    { name: "Rice", quantity: 1, restockAt: 1 },
    { name: "Oats", quantity: 3, restockAt: 1 },
    { name: "Passata", quantity: 1, restockAt: 2 },
  ]);

  assert.deepEqual(
    result.map(({ name, unitsNeeded }) => ({ name, unitsNeeded })),
    [
      { name: "Passata", unitsNeeded: 2 },
      { name: "Rice", unitsNeeded: 1 },
    ],
  );
});

test("getRestockItems sorts equal shortfalls by item name", () => {
  const result = getRestockItems([
    { name: "Tomatoes", quantity: 1, restockAt: 1 },
    { name: "Beans", quantity: 2, restockAt: 2 },
  ]);
  assert.deepEqual(result.map((item) => item.name), ["Beans", "Tomatoes"]);
});

test("getRestockItems keeps the source inventory unchanged", () => {
  const item = { name: "Rice", quantity: 1, restockAt: 1 };
  getRestockItems([item]);
  assert.equal("unitsNeeded" in item, false);
});

