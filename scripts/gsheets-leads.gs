/**
 * Wisnotech — Google Sheets lead-capture webhook (Apps Script).
 *
 * To deploy:
 *   1. Create a Google Sheet named "Wisnotech Leads". Keep it open.
 *   2. Extensions -> Apps Script. Delete the sample code.
 *   3. Paste this ENTIRE file's contents in and hit Save (Ctrl+S).
 *   4. Deploy -> New deployment -> type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone  (this is a low-risk write-only endpoint)
 *   5. Copy the Web app URL (ends in /exec). Paste it into:
 *        wisnotech-vite/.env  as  VITE_LEAD_WEBHOOK_URL=...
 *      AND set the same var in Vercel: Project settings -> Environment Variables.
 *
 * Optionally rename the top cell (A1) to "Leads" — or leave it, the script
 * auto-creates a "Leads" tab the first time a lead arrives.
 */

var SHEET_NAME = "Leads";

var HEADERS = [
  "Captured at",
  "Name",
  "Email",
  "Phone",
  "Interest",
  "Timeline",
  "Budget",
  "Message",
  "Source",
];

/** GET / — health check so you can test the URL in a browser. */
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, service: "wisnotech-leads" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** POST / — accepts the JSON payload from src/lib/leadSink.ts and logs it. */
function doPost(e) {
  var out = { ok: false };
  try {
    var d = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    var row = [
      new Date(),
      d.name || "",
      d.email || "",
      d.phone || "",
      d.interest || "",
      d.timeline || "",
      d.budget || "",
      d.message || "",
      d.source || "",
    ];
    sheet.appendRow(row);
    var rowNum = sheet.getLastRow();
    var rowUrl =
      SpreadsheetApp.getActiveSpreadsheet().getUrl() +
      "#gid=" + sheet.getSheetId() + "&range=A" + rowNum;
    out.ok = true;
    out.row = rowNum;
    out.rowUrl = rowUrl;
  } catch (err) {
    out.error = String(err);
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Returns the "Leads" sheet, creating it with headers on first use. */
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#e8eaed");
    // Simpler than SpreadsheetApp.newCellStyle() — column widths:
    sheet.setColumnWidths(1, HEADERS.length, 160);
  }
  return sheet;
}