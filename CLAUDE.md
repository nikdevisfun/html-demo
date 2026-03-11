# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` - Start the Express server (runs on port 3200)
- `node -e "const { scanDemos, getAllDemos } = require('./database'); scanDemos();"` - Re-scan demos folder for new/updated demos

## Architecture

This is a Demo index and preview system with the following architecture:

### Backend (server.js, database.js)
- **Express server** serves static files and API endpoints
- **SQLite database** (`demos.db`) stores demo metadata: id, name, folder, description, tech_stack, timestamps
- **Demo scanning**: Automatically scans `projects/` folder on startup, extracting metadata from HTML files:
  - Title from `<title>` tag
  - Description from `meta[name="description"]` or first `<h1>`/`<p>` tag
  - Tech stack from `meta[name="tech-stack"]` meta tag (manual) OR auto-detection (via script/link tags)

### Tech Stack Detection
Auto-detection scans HTML for common libraries/frameworks: React, Vue, Angular, jQuery, GSAP, Three.js, Tailwind, Bootstrap, etc. Defaults to "HTML, CSS" if nothing detected.

To manually specify tech stack, add to demo's HTML: `<meta name="tech-stack" content="React, Tailwind">`

### Frontend (public/)
- **ES Modules**: Uses `<script type="module">` for modular JavaScript
- **Module structure**:
  - `api.js` - Fetches data from backend
  - `renderer.js` - Renders demo cards
  - `ui.js` - UI interactions
  - `main.js` - Entry point, handles search functionality

### Demo Preview
- `/demo/:id` route serves demo's `index.html` with injected `<base>` tag for correct asset resolution
- Demo assets served from `/demo/:id/*` route

## Adding New Demos
1. Create a new folder in `projects/` directory
2. Add an `index.html` file with:
   - `<title>` tag for demo name
   - `meta[name="description"]` for description (optional)
   - `meta[name="tech-stack"]` for tech stack (optional, auto-detected otherwise)
3. Click refresh button or restart server to rescan
