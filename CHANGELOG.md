# Changelog

Every change to the planner gets an entry here: what changed and why. Newest first.

## 2026-11-19: Runs as an Apps Script web app

**What changed**
- Added `Code.gs`: serves the planner from Apps Script and saves all data in the attached Google Sheet.
- The planner detects when it's running in Apps Script and saves to that sheet automatically. No key or connection step needed.
- Removed `google-sheet-backend.gs` and the "Connect Google Sheet" form. Apps Script hosting replaces them.
- Budget & rules shows where data is saved, with Download backup and Restore from backup.

**Why**
- Keep the planner and its data inside Firebrand's Google account, open only to Firebrand logins, with one shared link for the team.

## 2026-11-19: Saving outside claude.ai

**What changed**
- Copies opened outside claude.ai now save in the browser instead of losing everything on refresh.
- Added an optional Google Sheet connection (`google-sheet-backend.gs`) so every copy can share one set of data in Firebrand's Drive.
- Added "Where data is saved" to Budget & rules, with Connect / Disconnect, Download backup and Restore from backup.
- PO files and invoice exports now download in any browser, not just on claude.ai.
- On claude.ai nothing changes: it still uses the shared claude.ai database.

**Why**
- Anyone who pulls the code from GitHub needs their uploads, vendor details and invoices to be saved wherever they run it.

## 2026-11-19: Moved into GitHub

**What changed**
- Added the Ordering Planner code (`index.html`) as it runs on claude.ai today.
- Set the default `lastMonthSales` to `0` (was the real last-month sales figure).
- Added this README and changelog.

**Why**
- Keep a version history of the planner so every change is tracked, as Trey asked for the dashboard.
- The repo is public, so Firebrand's sales figure was removed from the code.

**Features included at this point**
This week board, Vendors, Brands, Overstock, Invoices (PDF reading, paid/unpaid, by month/vendor/brand), weekly Dutchie upload, Budget & rules, How it works guide.
