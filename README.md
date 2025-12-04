## Grid Dashboard (React + TypeScript)

This project is a small grid-based dashboard built with React, TypeScript, and Vite.  
It allows you to **add, move, and delete blocks** (Line Chart, Bar Chart, Text Block) on a fixed 3-column grid using **pure CSS** for styling and **React Context + useState** for state management.

### Features

- **3-column grid canvas** with unlimited vertical height (rows expand as needed).
- **Block types**: Line Chart, Bar Chart, Text Block (all show mock data).
- **Add blocks** via three buttons:
  - Add Line Chart
  - Add Bar Chart
  - Add Text Block
- **Placement logic**: new blocks go to the first available empty cell (left-to-right, top-to-bottom).
- **Delete blocks** via a hover-only delete button in the block’s top-right corner.
- **Drag & Drop**:
  - Drag any block into an **empty cell only**.
  - Visual highlighting shows the current drop target.
  - Dropping on an occupied cell is ignored, preserving the rules.
- **Implementation details**:
  - React + TypeScript
  - State managed only with `useState` and React Context (`GridProvider`)
  - Pure CSS (`App.css`, `index.css`), no CSS-in-JS or CSS frameworks

### Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

   Then open the URL shown in the terminal (usually `http://localhost:5173`) in your browser.

### How to Use the Dashboard

1. Use the **three buttons** at the top to add different block types.
2. Blocks appear in the **first empty cell** in row-major order (left-to-right, top-to-bottom).
3. **Drag a block** and drop it onto another **empty cell**:
   - The target cell is highlighted to give visual feedback.
   - Drops onto cells that already contain a block are ignored.
4. Hover over a block to reveal the **delete button (×)** in the top-right corner:
   - Click it to remove that block from the grid, freeing the cell.

### Build for Deployment

To create a production build (for static hosting or deployment):

```bash
npm run build
```

The output will be in the `dist` directory. You can preview the production build locally with:

```bash
npm run preview
```

You can deploy the contents of `dist` to any static hosting service (e.g., Netlify, Vercel, GitHub Pages, or a simple static file server).

