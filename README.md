# Pantry Pulse Dashboard

A small, dependency-free dashboard for seeing what is in a household pantry, how much it is worth, and which categories are represented. It ships with realistic sample data so the interface works immediately.

## Run it

Open `index.html` in a browser. No build step or server is required.

Run the checks with:

```bash
npm test
npm run check
```

## What is included

- A responsive pantry inventory table
- A formula-safe CSV download of the current inventory
- Summary cards for item count, total units, inventory value, and category coverage
- Semantic table markup and a live last-updated status
- Pure, reusable inventory calculations covered by Node's built-in test runner

The starter is intentionally compact so filtering, expiry planning, budget tracking, exports, and restock alerts can be added as independent follow-up improvements.

