const test = require("node:test");
const assert = require("node:assert/strict");

const {
  calculateBudgetProgress,
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

test("calculateBudgetProgress reports remaining budget", () => {
  assert.deepEqual(calculateBudgetProgress(238.4, 300), {
    spent: 238.4,
    target: 300,
    remaining: 61.6,
    overBy: 0,
    percent: 79,
  });
});

test("calculateBudgetProgress reports overspend without a negative remainder", () => {
  assert.deepEqual(calculateBudgetProgress(325.25, 300), {
    spent: 325.25,
    target: 300,
    remaining: 0,
    overBy: 25.25,
    percent: 108,
  });
});

test("calculateBudgetProgress rejects invalid targets", () => {
  assert.throws(() => calculateBudgetProgress(100, 0), /positive number/);
  assert.throws(() => calculateBudgetProgress(100, Number.NaN), /positive number/);
});

