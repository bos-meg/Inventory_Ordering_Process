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

No sales, vendor or invoice data is stored in this repository. That data lives in the planner's own database on claude.ai.

## Key rules built into the math

- Budget: 35–45% of last month's sales, split evenly across weeks 1–4.
- Each vendor ordered once a month in its assigned week; the biggest vendors twice a month.
- Order up to = units/day × (days covered + lead time + safety stock). Order = order up to − on hand.
- Safety stock: Tier A 7 days, B 5 days, C 3 days. Overstock line: 60 days of supply.
- Deliveries land Monday to Wednesday only.

## How to run it

The live version runs on claude.ai, where it can save uploads, vendor details and invoices for the whole team. Opening `index.html` directly in a browser works as a preview only: uploads stay on that screen and nothing is saved.

## Files

- `index.html`: the full planner (HTML, CSS and JavaScript in one file)
- `CHANGELOG.md`: what changed and why, newest first

## Note

`lastMonthSales` defaults to `0` in this copy so no Firebrand sales figures are public. The real number is set in the live planner.
