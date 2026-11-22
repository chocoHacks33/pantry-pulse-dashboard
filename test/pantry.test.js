const test = require("node:test");
const assert = require("node:assert/strict");

const {
  formatCurrency,
  getDaysUntilExpiry,
  getExpiringItems,
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

test("getDaysUntilExpiry compares calendar dates without time-of-day drift", () => {
  const lateEvening = new Date(2026, 10, 22, 23, 55);
  assert.equal(getDaysUntilExpiry("2026-11-23", lateEvening), 1);
  assert.equal(getDaysUntilExpiry("2026-11-22", lateEvening), 0);
});

test("getExpiringItems keeps the requested window and orders the most urgent first", () => {
  const items = [
    { name: "Rice", expires: "2026-12-04" },
    { name: "Milk", expires: "2026-11-24" },
    { name: "Oats", expires: "2026-11-27" },
    { name: "Old bread", expires: "2026-11-20" },
  ];
  const result = getExpiringItems(items, new Date(2026, 10, 22), 7);

  assert.deepEqual(
    result.map(({ name, daysUntil }) => ({ name, daysUntil })),
    [
      { name: "Milk", daysUntil: 2 },
      { name: "Oats", daysUntil: 5 },
    ],
  );
});

test("getExpiringItems does not mutate source records", () => {
  const item = { name: "Pasta", expires: "2026-11-25" };
  getExpiringItems([item], new Date(2026, 10, 22));
  assert.equal("daysUntil" in item, false);
});

