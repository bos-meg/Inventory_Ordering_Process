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

| Where it's opened | Where it saves | Who sees it |
|---|---|---|
| **Apps Script web app (the team version)** | The Google Sheet the script is attached to, in Firebrand's Drive | Everyone at Firebrand with the link |
| claude.ai | The shared claude.ai database | Everyone with the claude.ai link |
| `index.html` opened straight from a computer | That browser only | Only that browser |

## Set it up in Apps Script

1. Create a Google Sheet in Firebrand's Drive, e.g. "Ordering Planner Data". This is where the data lives.
2. In the sheet, go to **Extensions > Apps Script**.
3. Replace everything in `Code.gs` with this repo's `Code.gs`.
4. Click **+ > HTML** and name it `Index`. Replace everything in it with this repo's `index.html`.
5. **Deploy > New deployment**, type **Web app**. Execute as **Me**, Who has access **Anyone within Firebrand**. Approve the permissions.
6. Copy the Web app URL (ends in `/exec`) and share it with the team. Only people signed in with a Firebrand Google account can open it.
7. Open **Budget & rules** and enter last month's sales, then upload the first Dutchie report.

**Updating after a code change:** paste the new `Code.gs` / `index.html` into Apps Script, then **Deploy > Manage deployments > edit > Version: New version > Deploy**. The link stays the same. Add an entry to `CHANGELOG.md` for every change.

**Moving data over:** on the claude.ai or browser version, go to Budget & rules > **Download backup**. Then on the Apps Script version, choose **Restore from backup**.

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

## Files

- `index.html`: the full planner (HTML, CSS and JavaScript in one file)
- `Code.gs`: the Apps Script that serves the planner and saves its data to the Google Sheet
- `CHANGELOG.md`: what changed and why, newest first

## Note

`lastMonthSales` defaults to `0` in this copy so no Firebrand sales figures are public. The real number is set in the live planner.
