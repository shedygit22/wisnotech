/**
 * Lead capture sink — pushes qualified leads to a Google Sheet via an
 * Apps Script webhook when configured. Fails silently offline.
 *
 * To enable:
 * 1. Create a Google Sheet, then Extensions -> Apps Script.
 * 2. Paste the READY script in `scripts/gsheets-leads.gs` (it auto-creates
 *    a "Leads" tab with headers and returns the row URL).
 * 3. Deploy as a Web app -> Execute as "Me", access "Anyone". Copy the URL.
 * 4. Set VITE_LEAD_WEBHOOK_URL to that URL (frontend env only, safe to expose)
 *    in `.env` for local dev AND in Vercel for production.
 */
const WEBHOOK_URL =
  (import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined) ?? "";

export interface Lead {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
  timeline?: string;
  budget?: string;
  source: string;
}

export async function sendLead(lead: Lead): Promise<boolean> {
  if (!WEBHOOK_URL) return false;
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...lead, capturedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch (err) {
    console.warn("Lead sink unavailable:", err);
    return false;
  }
}

/** Apps Script handler — paste the body of `doPost` into Google Apps Script. */
export const APPS_SCRIPT_DO_POST = `
function doPost(e) {
  var out = {ok:false};
  try {
    var d = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date(),
      d.name || '',
      d.email || '',
      d.phone || '',
      d.interest || '',
      d.timeline || '',
      d.budget || '',
      d.message || '',
      d.source || ''
    ]);
    out.ok = true;
  } catch (err) {
    out.error = String(err);
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}
`;