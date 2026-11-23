const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");

test("print report control is wired to a dedicated print stylesheet", () => {
  const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
  const script = fs.readFileSync(path.join(projectRoot, "app.js"), "utf8");
  const styles = fs.readFileSync(path.join(projectRoot, "styles.css"), "utf8");

  assert.match(html, /id="print-dashboard"/);
  assert.match(script, /window\.print\(\)/);
  assert.match(styles, /@media print/);
  assert.match(styles, /break-inside: avoid/);
});
