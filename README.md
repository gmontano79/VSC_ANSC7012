# VSC Digital

**Version 8.35 · Progressive Web App · Evaluation build**

**Developed by Gustavo Montano**  
**A GMTK Integrated Solutions Product**

VSC Digital is a mobile-first Progressive Web App (PWA) designed to support Vessel Examiners during recreational boating Vessel Safety Checks. It provides a digital inspection workflow, an illustrated reference guide, and tools for maintaining inspection records and producing the relevant reports.

> **Project status:** VSC Digital is under evaluation. It is **not** presented as an officially adopted, endorsed, or authorized U.S. Coast Guard or U.S. Coast Guard Auxiliary application.

## Features

- **Digital Vessel Safety Check:** inspection workflow based on **ANSC 7012**, including examiner and vessel-owner signatures.
- **Official-form PDF output:** produce a completed ANSC 7012 PDF for review and sharing.
- **Saved Inspections:** view and manage locally saved inspection records, reopen records, and access PDF/email actions.
- **Email workflow:** share an inspection report using supported browser/device capabilities and manually confirm when an email has been sent; opening a mail application is not proof of delivery.
- **VSC Reference Guide:** illustrated, item-based inspection guidance using approved project reference images, including *When Required*, *What to Check*, and *Common Fail Points*.
- **Daily Activity Reports:** ANSC 7038 reporting functionality.
- **Settings and Diagnostics:** local backup/restore tools, application information, and diagnostic logs.
- **Offline-capable PWA:** installable web experience designed for use on compatible tablets and smartphones, subject to device and browser limitations.

## Open the application

**GitHub Pages:** https://gmontano79.github.io/VSC_ANSC7012/

For installation, open the published site in a supported browser and use the browser's **Add to Home Screen** or **Install** option where available. Load the app while connected before depending on offline access. Validate functionality on your intended device before operational use.

## Privacy and data handling

VSC Digital uses browser-based local storage for inspection data. In the current GitHub Pages deployment, the static hosting service is not a centralized inspection-record database.

- Inspection records are **specific to the device, browser, and website origin**. They are not automatically synchronized between devices.
- Clearing website data, reinstalling an installed web app, or losing a device **may cause local data loss**. Export and securely retain backups before device maintenance or significant changes.
- Do **not** commit real inspection records, owner information, signatures, or backup files to this public repository.
- PDF sharing and email completion depend on the device, browser, and mail application. Verify delivery separately.
- Evaluate privacy, access controls, retention, and operational requirements before any organization-wide deployment.

## Development and repository

The application is deployed as a static PWA using GitHub Pages. The repository contains the web application, styles, scripts, icons, and reference assets needed for the published build.

- **Release:** v8.35
- **Deployment:** GitHub Pages
- **Source control:** Git and GitHub
- **Authentication:** SSH access may be configured independently by each contributor.
- **Commit signing:** SSH signing has been configured for the maintainer's future commits; a GitHub **Verified** commit has not yet been confirmed. A README change can be used for that check.

Changes should be validated on desktop, iPad, and Android without removing existing local records. Updates to the service worker or startup assets may require normal browser/PWA cache refresh behavior.

## Intellectual property and credits

**Created and developed by Gustavo Montano.**  
**GMTK Integrated Solutions** is the product's associated business identity.

**Copyright © 2026 Gustavo Montano. All rights reserved.**

No open-source license is granted by this README. Public visibility of the repository does not itself grant permission to redistribute, sublicense, or commercially exploit original source code and assets beyond rights allowed by applicable law or GitHub's terms. Third-party materials and governmental forms, marks, and insignia remain subject to their respective rights and usage requirements.

The authorship and ownership statement reflects the project's current intended presentation and does not override any applicable agreement, work-for-hire arrangement, or third-party rights.

## Official status

This project is an independent digital tool developed for evaluation and potential use in Vessel Safety Check workflows. Any organizational adoption, trademark or insignia use, data governance, distribution, or integration requires the appropriate review and authorization. References to ANSC 7012, ANSC 7038, the U.S. Coast Guard, or the U.S. Coast Guard Auxiliary describe the workflow and do not imply official endorsement.

---

**Developed by Gustavo Montano · GMTK Integrated Solutions · VSC Digital v8.35**
