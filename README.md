# VSC Digital PWA — v8.21 (field-test build)

This package contains the existing v8.21 application with a PWA wrapper. The original inspection interface and PDF generators are unchanged.

## GitHub Pages

1. Create a **public** repository named `VSC_ANSC7012`.
2. Upload **the contents of this folder** to the repository root (not the folder itself).
3. Under **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)` and save.
4. When published, open `https://YOUR-USERNAME.github.io/VSC_ANSC7012/` in Safari on iPad, then **Share → Add to Home Screen**. On Android use Chrome → **Install app** or **Add to Home screen**.
5. Load it online at least once; then test Airplane Mode (offline) before field use.

## Important

- Pages is static and does not store owner or inspection data. Local storage is per browser/origin/device.
- The VSC HTML currently stores inspection data in browser local storage, which is not guaranteed to survive site-data clearing or device loss. Export backups frequently. Different local HTML and GitHub Pages origins will not automatically share records.
- Do **not** upload any completed inspections, photos of boat owners, signatures or exported backups to a public repository.
- Sharing a PDF uses device/browser capabilities and may still need manually filling recipient/subject; verify on the actual iPad/Android.
- This build is for testing; deployment, offline reliability, PDF and mail flows must be verified on devices.
- For updating to a new build, change the CACHE constant in `service-worker.js` to force cache rotation and test updates carefully.
