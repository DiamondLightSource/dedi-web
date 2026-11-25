# Dedi-web

[![dedi-web code CI](https://github.com/DiamondLightSource/dedi-web/actions/workflows/code.yml/badge.svg)](https://github.com/DiamondLightSource/dedi-web/actions/workflows/code.yml)
[![gh-pages](https://github.com/DiamondLightSource/dedi-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/DiamondLightSource/dedi-web/actions/workflows/deploy.yml)

https://DiamondLightSource.github.io/dedi-web/

## Overview

DEtector DIstance (DEDI) is a browser-based Q-range calculator for small-angle X-ray scattering (SAXS) experiments. It helps scientists determine the accessible scattering vector range (q, s, or d-spacing) for a given detector, beamline configuration, camera length, and wavelength — with no installation or server required.

DEDI is inspired by the DEDI perspective in [DAWN Science](https://dawnsci.org/) and is built using React, TypeScript, Vite, MUI, Zustand, and h5web/lib.

## Features

- **Q-range calculation** — compute accessible ranges in q (Å⁻¹ or nm⁻¹), s (= q/2π), or real-space d-spacing
- **Preset beamlines** — pre-configured setups for Diamond Light Source beamlines (e.g. I22 SAXS/WAXS, isotropic and anisotropic modes)
- **Preset detectors** — built-in support for Pilatus and Eiger detector families with pixel size and module mask definitions
- **Calibrant overlay** — visualise calibrant ring positions (Collagen Wet/Dry, Ag Behenate, HDPE, and more) on the detector plot
- **Interactive plot** — live 2D detector view showing beamstop, camera tube, and accessible q-range regions
- **Configurable geometry** — adjust camera length, wavelength, beamstop diameter/clearance, and beam centre interactively
- **Results table and diagram** — clear summary of min/max q values and whether the requested range is achievable
- **Client-only** — runs entirely in the browser; no backend or data upload required

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v24 or later (CI tests on 24 and 26)
- `npm` (the repo's lockfile is `package-lock.json`)

Or use the [dev container](#developing-in-a-dev-container), which needs only Docker or Podman.

### Installation

```bash
git clone https://github.com/DiamondLightSource/dedi-web.git
cd dedi-web
npm install
```

### Running locally

```bash
npm run dev
```

Opens the app at `http://localhost:3000`.

### Running tests

```bash
npm test
```

### Building for production

```bash
npm run build
```

Output is written to `dist/`. The app can also be previewed with `npm run preview`.

The build assumes the app is served from `/dedi-web/`, as on GitHub Pages. To serve it from another path, set `BASE_PATH`:

```bash
BASE_PATH=/ npm run build
```

### Running with Docker

The `Dockerfile` builds the static site and serves it with nginx as a non-root user on port 8080:

```bash
docker build -t dedi-web .
docker run --rm -p 8080:8080 dedi-web
```

Then open `http://localhost:8080`. The image serves from `/`; pass `--build-arg BASE_PATH=/some/path/` to serve from a sub-path behind a proxy. Podman works with the same commands.

### Developing in a dev container

`.devcontainer/devcontainer.json` sets up Node 24, installs dependencies with `npm ci`, and adds the ESLint, Prettier and Vitest extensions. In VS Code, run **Dev Containers: Reopen in Container**, then `npm run dev` inside it; port 3000 is forwarded automatically.

The config targets rootless Podman 4.3 or newer. Point VS Code at it with the user setting `"dev.containers.dockerPath": "podman"`. The container runs as the non-root `node` user, and `--userns=keep-id:uid=1000,gid=1000` maps your host user onto it, so it can write the workspace and files it creates stay owned by you. To use Docker instead, delete the `--userns=...` entry from `runArgs` and the `"updateRemoteUserUID": false` line; Dev Containers will then match the `node` UID to yours.

## Usage

1. **Select a beamline** — choose a preset configuration (e.g. *I22 SAXS Isotropic*) to auto-populate detector, beamstop, camera tube, and wavelength/camera length limits.
2. **Configure the detector** — select a detector model or customise pixel size and resolution. Optionally specify missing modules.
3. **Set the beamstop** — adjust the beamstop diameter, clearance, and centre position.
4. **Set the camera tube** — configure the camera tube diameter and centre.
5. **View the plot** — the central plot updates live, showing the detector face with the beamstop, camera tube, and accessible q-range highlighted.
6. **Read the results** — the results panel shows the min/max accessible q (or s, or d-spacing) for the current configuration, and indicates whether a requested range is reachable.
7. **Overlay a calibrant** — open the calibrant dialog to overlay standard calibrant ring positions on the plot.

## Architecture

DEDI is a fully client-side single-page application with no backend. The architecture is organised around three concerns:

- **State management** — [Zustand](https://github.com/pmndrs/zustand) stores hold the configuration for each instrument component (detector, beamstop, camera tube, beamline). State is persisted to `localStorage` so settings survive page reloads.
- **Calculations** — pure TypeScript modules (`src/calculations/`) handle all geometry and scattering maths, including q-space mappings, ray casting, unit-range arithmetic, and unit vector operations. These are unit-tested with Vitest and are independent of the UI.
- **Rendering** — [React](https://react.dev/) components compose the UI. The detector plot is rendered as an SVG, with separate components for the beamstop mask, camera tube mask, calibrant rings, and segmented q-range arcs. Form inputs are driven by [JSON Forms](https://jsonforms.io/) with MUI renderers, allowing beamline and detector dialogs to be defined declaratively via JSON schema.

```
User input → Zustand stores → calculation layer → SVG plot + results panel
```

## Project Structure

```
src/
├── calculations/       # Pure maths: q-space, rays, unit/numeric ranges, unit vectors
├── data-entry/         # UI components and Zustand stores for detector, beamstop, camera tube, beamline
├── dialogs/            # Modal dialogs for beamline and detector configuration (JSON Forms + MUI)
│   ├── beamline/       # JSON schema and UI schema for beamline config
│   ├── calibrant/      # Calibrant selection dialog
│   ├── detector/       # JSON schema and UI schema for detector config
│   └── renderers/      # Custom JSON Forms renderers (integer/number inputs with units)
├── plot/               # SVG detector plot, plotter logic, calibrant/ellipse/mask/segment components
├── presets/            # JSON preset data for detectors, beamlines, and calibrants
├── results/            # Results bar, range table, range diagram, scattering quantity conversions
└── utils/              # Shared types, units, styles, colour picker, error components, persisted storage
```

## Configuration

Preset data is defined in JSON files under `src/presets/` and loaded at build time. No server or database is needed.

### Adding a detector

Add an entry to `src/presets/detectors.json`:

```jsonc
"My Detector": {
  "resolution": { "width": 1024, "height": 1024 },  // pixels
  "pixelSize": { "width": 0.1, "height": 0.1 },      // millimetres
  "mask": {
    "horizontalModules": 1,
    "verticalModules": 1,
    "horizontalGap": 0,   // pixels
    "verticalGap": 0,     // pixels
    "missingModules": []  // indices of inactive modules
  }
}
```

### Adding a beamline preset

Add an entry to `src/presets/presetConfigs.json`:

```jsonc
"My Beamline SAXS": {
  "detector": "My Detector",
  "beamstop": {
    "centre": { "x": 512, "y": 100 },  // pixels
    "clearance": 10,                   // millimetres
    "diameter": 4                      // millimetres
  },
  "cameraTube": {
    "centre": { "x": 512, "y": 512 },  // pixels
    "diameter": 200                    // millimetres
  },
  "wavelengthLimits": { "min": 0.062, "max": 0.335 },            // nanometres
  "cameraLengthLimits": { "min": 1.0, "max": 10.0, "step": 0.25 }  // metres
}
```

### Adding a calibrant

Add an entry to `src/presets/calibrant.json`:

```jsonc
"My Calibrant": {
  "d": [5.0, 2.5, 1.667]  // d-spacing values in nanometres, largest to smallest
}
```

### Persisted state

User settings (detector choice, beamstop position, camera length, etc.) are automatically saved to `localStorage` and restored on next visit. Clearing browser storage resets all values to defaults.
