# Architect Builder

A drag-and-drop AWS architecture practice tool. Take a brief, build the design on a canvas, and flip the settings that matter (On-Demand vs Spot, Multi-AZ, storage class, load balancer type, and so on).

No build step, no dependencies, no network calls. It is plain HTML, CSS and JavaScript.

## Run it

Open `index.html` in any modern browser. That is all.

## How to use it

1. Paste your brief into the **Brief** box at the top. It stays visible while you build.
2. Drag containers from **Network structure**: Region, then VPC, then Availability Zones, then subnets. Each one nests inside the right parent.
3. Drag services into subnets (or anywhere that fits). Search the palette to find one fast.
4. Click a placed service to open its settings in the right panel. Toggles and dropdowns show as small tags on the service.
5. Press **Connect** (or `C`), click one service and then another to draw an arrow. Click an arrow to label it (HTTPS, SQL, async) or make it dashed.
6. **Export PNG** downloads a clean image. **Save** downloads a `.json` file you can reopen later with **Open**.

Keys: `Delete` removes the selection, `Esc` deselects or leaves Connect mode, `V` selects, `C` connects.

## What is in the palette

About 120 services from the Solutions Architect exam scope list, grouped by category, plus Users and On-premises blocks. Services without a rich settings list still work as plain blocks.

## Project layout

```
index.html          page shell
styles.css          all styling (light and dark)
data/core.js        categories, containers, option helpers
data/services-*.js  the service catalogue and each service's settings
js/state.js         model: nodes, arrows, nesting rules
js/render.js        palette, nodes and arrow drawing
js/interact.js      drag, resize, connect, zoom, keyboard
js/panel.js         properties panel
js/export.js        PNG export and JSON save
js/main.js          startup and toolbar wiring
```

## Add or change a service

Open one of the `data/services-*.js` files and add a line:

```js
d('mylogic', 'AWS Example', 'EXM', 'compute', [
  O.toggle('multiAz', 'Multi-AZ', false),
  O.select('mode', 'Mode', ['Standard', 'Fast'], 'Standard')
], 'Optional one-line tip shown in the panel.');
```

Arguments: id, display name, 2 to 4 letter badge, category id (see `data/core.js`), settings list, tip.

## Put it on GitHub

```bash
cd aws-architect-builder
git init
git add .
git commit -m "Add Architect Builder"
git branch -M main
git remote add origin https://github.com/<your-username>/aws-architect-builder.git
git push -u origin main
```

To use it from any device, turn on **GitHub Pages**: repository **Settings > Pages > Deploy from a branch > main / (root)**. It will be served at `https://<your-username>.github.io/aws-architect-builder/`.

## Notes

The badges are plain coloured tiles with short codes, not AWS's official icons, so the repo has no trademark or licensing issues. If you want the real icons, download AWS's Architecture Icons set yourself and swap them in.
# aws-architect-builder
