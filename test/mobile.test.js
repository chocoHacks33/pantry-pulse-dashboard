const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");

test("mobile inventory rows expose labels used by the card layout", () => {
  const script = fs.readFileSync(path.join(projectRoot, "app.js"), "utf8");
  const styles = fs.readFileSync(path.join(projectRoot, "styles.css"), "utf8");

  for (const label of ["Item", "Category", "On hand", "Unit price", "Value"]) {
    assert.ok(script.includes(`"${label}"`), `missing ${label} cell label`);
  }

  assert.match(styles, /content: attr\(data-label\)/);
  assert.match(styles, /tbody tr \{[\s\S]*border-radius/);
});
