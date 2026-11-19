/**
 * Firebrand Ordering Planner: Apps Script web app
 *
 * Serves the planner (Index.html) and saves its data in the Google Sheet this script
 * is attached to. Everyone who opens the web app link with a Firebrand Google account
 * shares the same data.
 *
 * Setup (one time):
 * 1. Create a Google Sheet in Firebrand's Drive, e.g. "Ordering Planner Data".
 * 2. In the sheet: Extensions > Apps Script.
 * 3. Replace everything in Code.gs with this file.
 * 4. File + > HTML, name it Index (Apps Script adds .html). Paste all of index.html into it.
 * 5. Deploy > New deployment > type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone within Firebrand
 *    Approve the permissions, then share the Web app URL (ends in /exec) with the team.
 * 6. After a code change: paste the new files in, then Deploy > Manage deployments >
 *    edit (pencil) > Version: New version > Deploy. The link stays the same.
 */

const SHEET_NAME = "data";
const CELL = 45000; // Sheets allows 50,000 characters per cell; long records span several cells

/* ---------- the web app ---------- */
function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Firebrand Ordering Planner")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

/* ---------- called from the planner page ---------- */
function plannerAll() { return withLock_(function () { return JSON.stringify(readAll_()); }); }
function plannerSet(path, json) { return withLock_(function () { write_(path, JSON.parse(json)); return "{}"; }); }
function plannerDelete(path) { return withLock_(function () { write_(path, null); return "{}"; }); }
function plannerImport(json) { return withLock_(function () { importAll_(JSON.parse(json)); return "{}"; }); }

function withLock_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

/* ---------- sheet storage ---------- */
function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

// Each row: A = record path, B = last updated, C onward = JSON split into pieces.
// Every piece starts with "~" so Sheets never treats it as a number or formula.
function toRow_(path, data) {
  const json = JSON.stringify(data);
  const parts = [];
  for (let i = 0; i < json.length; i += CELL) parts.push("~" + json.slice(i, i + CELL));
  return [path, new Date().toISOString()].concat(parts);
}

function readAll_() {
  const s = sheet_();
  const n = s.getLastRow(), c = s.getLastColumn();
  const out = {};
  if (!n || !c) return out;
  s.getRange(1, 1, n, c).getValues().forEach(function (r) {
    if (!r[0]) return;
    const json = r.slice(2).map(function (x) { return x ? String(x).slice(1) : ""; }).join("");
    if (json) out[r[0]] = JSON.parse(json);
  });
  return out;
}

function ensureCols_(s, n) {
  if (s.getMaxColumns() < n) s.insertColumnsAfter(s.getMaxColumns(), n - s.getMaxColumns());
}

function write_(path, data) {
  if (!path) throw new Error("missing path");
  const s = sheet_();
  const n = s.getLastRow();
  let row = 0, blank = 0;
  if (n) {
    const paths = s.getRange(1, 1, n, 1).getValues();
    for (let i = 0; i < n; i++) {
      if (paths[i][0] === path) { row = i + 1; break; }
      if (!paths[i][0] && !blank) blank = i + 1;
    }
  }
  if (row) s.getRange(row, 1, 1, s.getMaxColumns()).clearContent();
  if (data == null) return;
  if (!row) row = blank || n + 1;
  const vals = toRow_(path, data);
  ensureCols_(s, vals.length);
  s.getRange(row, 1, 1, vals.length).setValues([vals]);
}

function importAll_(docs) {
  const s = sheet_();
  s.clearContents();
  const rows = Object.keys(docs).map(function (p) { return toRow_(p, docs[p]); });
  if (!rows.length) return;
  const width = Math.max.apply(null, rows.map(function (r) { return r.length; }));
  rows.forEach(function (r) { while (r.length < width) r.push(""); });
  ensureCols_(s, width);
  s.getRange(1, 1, rows.length, width).setValues(rows);
}
