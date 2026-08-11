// Tiny dependency-free Markdown renderer + frontmatter parser.
// Used by BOTH the browser bundle (via Vite) and the build-time prerender
// script (plain Node ESM), so the served SEO HTML matches the app exactly.

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: raw };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (/^\[.*\]$/.test(value)) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, "");
    }
    data[key] = value;
  }
  const body = raw.slice(match[0].length);
  return { data, body };
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s) {
  // code spans first (protect content from other transforms)
  const codeSpans = [];
  let out = s.replace(/`([^`]+)`/g, (_, c) => {
    codeSpans.push(c);
    return `\u0000CODE${codeSpans.length - 1}\u0000`;
  });
  out = out
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+["']([^"']*)["'])?\)/g, (_, t, href, title) => {
      const safe = esc(href);
      return title
        ? `<a href="${safe}" title="${esc(title)}">${t}</a>`
        : `<a href="${safe}">${t}</a>`;
    });
  return out.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => `<code>${esc(codeSpans[i])}</code>`);
}

function escapeHtml(s) {
  return esc(s);
}

export function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let i = 0;

  const flushList = (items, ordered) => {
    if (!items.length) return;
    const tag = ordered ? "ol" : "ul";
    html.push(`<${tag}>`);
    for (const it of items) {
      // support single level of nesting (two-space indented bullets)
      const item = inline(it.text);
      html.push(`<li>${item}${it.children.length ? renderMarkdown(it.children.join("\n")) : ""}</li>`);
    }
    html.push(`</${tag}>`);
  };

  while (i < lines.length) {
    const line = lines[i];

    // fenced code block
    if (/^```/.test(line)) {
      const lang = line.replace(/^```/, "").trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      html.push(`<pre><code${lang ? ` class="language-${esc(lang)}"` : ""}>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }

    // headings
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      html.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // horizontal rule
    if (/^\s*(---+|\*\*\*+)\s*$/.test(line)) {
      html.push("<hr />");
      i++;
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      html.push(`<blockquote>${renderMarkdown(buf.join("\n"))}</blockquote>`);
      continue;
    }

    // lists
    if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]/.test(line);
      const items = [];
      let cur = null;
      while (i < lines.length) {
        const l = lines[i];
        const ulMatch = l.match(/^\s*[-*+]\s+(.*)$/);
        const olMatch = l.match(/^\s*\d+[.)]\s+(.*)$/);
        const nestedMatch = l.match(/^\s{2,}[-*+]\s+(.*)$/);
        if (ulMatch && !ordered) {
          cur = { text: ulMatch[1], children: [] };
          items.push(cur);
          i++;
        } else if (olMatch && ordered) {
          cur = { text: olMatch[1], children: [] };
          items.push(cur);
          i++;
        } else if (nestedMatch && cur) {
          cur.children.push(l);
          i++;
        } else {
          break;
        }
      }
      flushList(items, ordered);
      continue;
    }

    // empty line
    if (!line.trim()) {
      i++;
      continue;
    }

    // paragraph
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^#{1,4}\s/.test(lines[i]) && !/^```/.test(lines[i]) && !/^>\s?/.test(lines[i]) && !/^\s*[-*+]\s+/.test(lines[i]) && !/^\s*\d+[.)]\s+/.test(lines[i]) && !/^\s*(---+|\*\*\*+)\s*$/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    html.push(`<p>${inline(buf.join(" "))}</p>`);
  }

  return html.join("\n");
}

export function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function readingTime(md) {
  const words = md.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function stripMarkdown(md) {
  const { body } = parseFrontmatter(md);
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,4}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+[.)]\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/---/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function excerpt(md, words = 32) {
  const plain = stripMarkdown(md).replace(/\s+/g, " ").trim();
  const parts = plain.split(" ");
  return parts.length <= words ? plain : parts.slice(0, words).join(" ") + "…";
}