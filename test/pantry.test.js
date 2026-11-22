const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildInventoryCsv,
  escapeCsvCell,
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

test("escapeCsvCell quotes commas and doubles embedded quotes", () => {
  assert.equal(escapeCsvCell('Sauce, "hot"'), '"Sauce, ""hot"""');
});

test("escapeCsvCell neutralizes spreadsheet formula prefixes", () => {
  assert.equal(escapeCsvCell("=1+1"), '"\'=1+1"');
  assert.equal(escapeCsvCell("  @SUM(A1:A2)"), '"\'  @SUM(A1:A2)"');
  assert.equal(escapeCsvCell("ordinary item"), '"ordinary item"');
});

test("buildInventoryCsv exports headers, values, and estimated totals", () => {
  const csv = buildInventoryCsv([
    {
      name: "Rice",
      category: "Grains",
      quantity: 2,
      unit: "bags",
      unitPrice: 8.9,
      expires: "2027-06-18",
    },
  ]);

  assert.equal(
    csv,
    '"Item","Category","Quantity","Unit","Unit price","Estimated value","Expires"\r\n' +
      '"Rice","Grains","2","bags","8.90","17.80","2027-06-18"',
  );
});

