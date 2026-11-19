# Inventory Ordering Process

Source code for the **Firebrand Ordering Planner**: the tool that tells the team what to order, from which vendor, when, and how much.

## What it does

- **This week**: the vendor POs due this week, split across Monday, Tuesday and Wednesday, with spend tracked against the weekly budget.
- **Vendors**: each vendor's order schedule (monthly or twice a month), lead time, MOQ, delivery details and how to place the order.
- **Brands**: Tier A/B/C ranking, units sold per day, days of stock left, and suggested order units.
- **Overstock**: brands and SKUs above the 60-day line that get no new orders until they sell down.
- **Invoices**: invoice PDFs read automatically, marked paid/unpaid, and totaled by month, vendor and brand.
- **Upload**: the weekly Dutchie report that drives everything.
- **Budget & rules** and **How it works**: the ordering rules and a plain-language guide.

## Where the data comes from

| Data | Source |
|---|---|
| Sales, stock on hand, costs | Dutchie **Inventory Order Report**, last 30 days, uploaded weekly |
| Vendor schedules, MOQs, rep contacts | Entered in the planner's Vendors tab |
| Invoices | Vendor invoice PDFs dropped on the Invoices tab |
| Monthly budget | Last month's sales, entered on Budget & rules (35–45%) |

No sales, vendor or invoice data is stored in this repository.

## Where data is saved

The planner picks where to save on its own:

| Where it's opened | Where it saves | Who sees it |
|---|---|---|
| claude.ai (the live link) | The shared claude.ai database | Everyone with the link |
| A copy from GitHub, nothing set up | That browser on that computer | Only that browser |
| A copy from GitHub, connected to a Google Sheet | The Google Sheet in Firebrand's Drive | Everyone connected to the same sheet |

Browser saving needs no setup. Data survives refreshes and restarts, but it stays on that computer and is lost if the browser's site data is cleared, so use **Download backup** now and then.

### Connect a Google Sheet so the team shares one copy

1. Create a Google Sheet in Firebrand's Drive, e.g. "Ordering Planner Data".
2. In the sheet, go to Extensions > Apps Script. Delete what's there and paste in all of `google-sheet-backend.gs`.
3. Change `ACCESS_KEY` to a long secret phrase. Keep the real key out of GitHub.
4. Deploy > New deployment > Web app. Execute as **Me**, Who has access **Anyone**. Approve, then copy the Web app URL (ends in `/exec`).
5. Open the planner > **Budget & rules** > **Where data is saved**. Paste the URL and key, then choose **Connect Google Sheet**. If the sheet is empty, the planner offers to copy over what's already saved in that browser.
6. Repeat step 5 on each computer that uses the planner.

Changes from teammates show up within 30 seconds. Without the key, nobody can read or change the data, even with the URL.

### Backups

**Download backup** saves everything (report, vendors, brand choices, invoices, rules, upload history) as one `.json` file. **Restore from backup** loads it into the browser or the connected sheet, which also moves data between them.

### What only works on claude.ai

- Claude reading invoice PDFs automatically. Elsewhere, you type the invoice details in.
- Storing the invoice PDF files. Elsewhere, only the details are saved.
- Showing who uploaded each report.

## Key rules built into the math

- Budget: 35–45% of last month's sales, split evenly across weeks 1–4.
- Each vendor ordered once a month in its assigned week; the biggest vendors twice a month.
- Order up to = units/day × (days covered + lead time + safety stock). Order = order up to − on hand.
- Safety stock: Tier A 7 days, B 5 days, C 3 days. Overstock line: 60 days of supply.
- Deliveries land Monday to Wednesday only.

## How to run it

Open `index.html` in Chrome, either by double-clicking the downloaded file or from any web host. It needs an internet connection to load the spreadsheet reader and fonts.

## Files

- `index.html`: the full planner (HTML, CSS and JavaScript in one file)
- `google-sheet-backend.gs`: the Apps Script that lets the planner save to a Google Sheet
- `CHANGELOG.md`: what changed and why, newest first

## Note

`lastMonthSales` defaults to `0` in this copy so no Firebrand sales figures are public. The real number is set in the live planner.
