/**
 * Firebrand Ordering Planner: Google Sheet storage
 *
 * Lets every copy of the planner (outside claude.ai) save to one Google Sheet,
 * so the whole team shares the same uploads, vendor details, invoices and rules.
 *
 * Setup (one time):
 * 1. Create a Google Sheet in Firebrand's Drive, e.g. "Ordering Planner Data".
 * 2. Extensions > Apps Script. Delete what's there and paste this whole file.
 * 3. Change ACCESS_KEY below to a long secret phrase. Don't commit your real key to GitHub.
 * 4. Deploy > New deployment > type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 *    Approve the permissions, then copy the Web app URL (ends in /exec).
 * 5. In the planner, open Budget & rules > Where data is saved, paste the URL and the key,
 *    and choose Connect Google Sheet. Do the same on each computer that uses the planner.
 *
 * "Anyone" access is needed so the planner page can reach the script. Nobody can read or
 * change the data without the access key.
 */

const ACCESS_KEY = "CHANGE-ME-to-a-long-secret-phrase";
const SHEET_NAME = "data";
const CELL = 45000; // Sheets allows 50,000 characters per cell; long records span several cells

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: "bad_request" }); }
  if (!body || body.key !== ACCESS_KEY || ACCESS_KEY.indexOf("CHANGE-ME") === 0) return out_({ ok: false, error: "not_granted" });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    switch (body.op) {
      case "all": return out_({ ok: true, docs: readAll_() });
      case "set": write_(body.path, body.data); return out_({ ok: true });
      case "delete": write_(body.path, null); return out_({ ok: true });
      case "import": importAll_(body.docs || {}); return out_({ ok: true });
      default: return out_({ ok: false, error: "bad_op" });
    }
  } catch (err) {
    return out_({ ok: false, error: "server_error", detail: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return out_({ ok: true, message: "Firebrand Ordering Planner storage is running." });
}

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

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
