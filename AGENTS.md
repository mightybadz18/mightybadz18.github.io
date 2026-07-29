# Portfolio Update Instructions

This repository is the public portfolio for Aries A. Evangelista at `mightybadz18.github.io`.

Follow these instructions before changing the portfolio so every update stays organized, aligned, sharp, and polished.

## Main Goal

Make the portfolio feel amazing, professional, and easy to review. Prioritize clear project proof, strong visual hierarchy, clean alignment, and screenshots that are readable at full resolution.

## Project Structure

- `index.html` is the main portfolio landing page.
- `proof.html` is the main proof gallery hub and should include organized proof sections for major projects.
- Project-specific proof pages, such as `hauling-qr-proof.html` and `voltph-proof.html`, are detailed case-study pages.
- `assets/site.css` contains the main shared styling.
- `assets/ui-fixes.css` contains targeted polish and layout fixes.
- `assets/gallery.js` powers screenshot galleries and the zoom viewer.
- `screenshots/` contains project evidence images. Keep each project in its own folder.

## Design Rules

- Keep sections well organized by project, then by workflow or admin area.
- Keep page alignment consistent: use existing `container`, `section`, `section-heading`, `gallery-group`, `gallery-grid`, `card`, `tags`, and `button` patterns.
- Avoid dumping screenshots into one long ungrouped area.
- Use clear headings that explain what the visitor is reviewing.
- Keep captions short, specific, and professional.
- Preserve full-resolution screenshots. Do not crop, stretch, blur, or compress proof images unless the user specifically asks.
- For mobile screenshots, use portrait containment so the full screen is visible.
- For desktop/admin screenshots, use landscape containment with `object-position: top center`.
- Do not let screenshots look broken, blurry, cut off, or misaligned.
- Avoid adding decorative clutter. The portfolio should look clean, confident, and review-ready.

## Proof Gallery Rules

- The main `proof.html` should show the important proof for each major project directly on the page.
- A separate case-study page can still exist for deeper review, but the project should not feel hidden from the main proof page.
- Use collapsible `details.gallery-group` sections for large screenshot sets.
- Open the most important groups by default and collapse secondary/admin-heavy groups when the page would otherwise feel too long.
- Each gallery image must have a meaningful caption.
- After adding images, verify every referenced image path exists and returns `200` in a local static server.

## Screenshot Rules

- Store Hauling QR screenshots under `screenshots/hauling-qr/`.
- Store Hauling QR admin web screenshots under `screenshots/hauling-qr/admin-web/`.
- Store Kapit-Bahay screenshots under `screenshots/kapit-bahay/`.
- Store Kapit-Bahay admin web screenshots under `screenshots/kapit-bahay/admin-web/`.
- Store VoltPH screenshots under `screenshots/voltph/`.
- Use stable numeric filenames, for example `01-dashboard.png`, `02-users.png`, or `01-active-trip-scanner.jpg`.
- Match filename order to the order shown in the gallery.
- Use original, sharp source images whenever available.

## Update Workflow

1. Run `git status --short` before editing.
2. Inspect the relevant HTML, CSS, gallery script, and screenshot folders before changing anything.
3. Keep edits narrow and consistent with the existing static-site style.
4. Use `apply_patch` for manual text edits.
5. Validate local references with a script or equivalent check.
6. Start a local static server and verify the edited page in a browser when layout or screenshots change.
7. Confirm public GitHub Pages URLs after pushing, allowing for cache delay.

## Publishing Rules

- Commit focused changes with a clear message.
- Push to `origin main` when the user asks for the live portfolio to be updated.
- After pushing, verify raw GitHub content first, then verify `https://mightybadz18.github.io/`.
- If GitHub Pages is delayed, say it is cache/deployment lag and keep checking until the public page catches up when practical.

## Quality Checklist

Before final response, confirm:

- The worktree is clean or explain any remaining changes.
- The updated page has the requested project proof in the expected location.
- The gallery groups are well named and logically ordered.
- No screenshot reference is missing.
- Local preview was checked for screenshot-heavy or layout-heavy changes.
- Public GitHub Pages was checked after push when publishing occurred.

