import { useState, useEffect, useRef } from "react";
import { adminAPI } from "../../lib/adminApi";

type View = "login" | "dashboard" | "editor" | "media" | "settings";

interface PageData {
  slug: string;
  title: string;
  [key: string]: unknown;
}

interface MediaItem {
  name: string;
  url: string;
  size: number;
  modified: string;
}

const PAGE_LABELS: Record<string, string> = {
  homepage: "Homepage",
  masterclass: "Masterclass",
  academy: "Academy",
  training: "Training",
  fae: "FAE Bootcamp",
  portfolio: "Portfolio",
  blog: "Blog",
  legal: "Legal",
};

export default function AdminApp() {
  const [view, setView] = useState<View>("login");
  const [pages, setPages] = useState<PageData[]>([]);
  const [editingPage, setEditingPage] = useState<PageData | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminAPI.isLoggedIn()) {
      setView("dashboard");
      loadPages();
    }
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getPages();
      setPages(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getMedia();
      setMedia(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleLogin = async (username: string, password: string) => {
    await adminAPI.login(username, password);
    setView("dashboard");
    loadPages();
  };

  const handleLogout = () => {
    adminAPI.logout();
    setView("login");
  };

  const openEditor = async (slug: string) => {
    setLoading(true);
    try {
      const data = await adminAPI.getPage(slug);
      setEditingPage({ slug, ...data });
      setView("editor");
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editingPage) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const { slug, ...data } = editingPage;
      await adminAPI.savePage(slug, data);
      setSaveMsg("Saved successfully!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e) {
      setSaveMsg("Error saving");
    }
    setSaving(false);
  };

  if (view === "login") return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-gray-100 text-sm">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} flex flex-col border-r border-gray-200 bg-white transition-all`}>
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
          {sidebarOpen && <span className="font-bold text-gray-900">Wisnotech CMS</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded p-1 hover:bg-gray-100">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          <SidebarItem label="Dashboard" active={view === "dashboard"} onClick={() => { setView("dashboard"); loadPages(); }} open={sidebarOpen} icon="📊" />
          <SidebarItem label="Media" active={view === "media"} onClick={() => { setView("media"); loadMedia(); }} open={sidebarOpen} icon="🖼" />
          <SidebarItem label="Settings" active={view === "settings"} onClick={() => setView("settings")} open={sidebarOpen} icon="⚙" />
          {sidebarOpen && <div className="my-2 border-t border-gray-100" />}
          {sidebarOpen && <div className="px-4 py-1 text-xs font-semibold uppercase text-gray-400">Pages</div>}
          {pages.map((p) => (
            <SidebarItem key={p.slug} label={PAGE_LABELS[p.slug] || p.slug} active={editingPage?.slug === p.slug && view === "editor"} onClick={() => openEditor(p.slug)} open={sidebarOpen} icon="📄" />
          ))}
        </nav>
        <div className="border-t border-gray-200 p-3">
          <button onClick={handleLogout} className={`w-full rounded bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 ${!sidebarOpen ? "px-0" : ""}`}>
            {sidebarOpen ? "Logout" : "🚪"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {view === "dashboard" && <DashboardPage pages={pages} onEdit={openEditor} loading={loading} />}
        {view === "editor" && editingPage && (
          <EditorPage page={editingPage} setPage={setEditingPage} onSave={handleSave} saving={saving} saveMsg={saveMsg} onMedia={() => { setView("media"); loadMedia(); }} />
        )}
        {view === "media" && <MediaPage media={media} onRefresh={loadMedia} onDelete={async (fn) => { await adminAPI.deleteMedia(fn); loadMedia(); }} />}
        {view === "settings" && <SettingsPage />}
      </main>
    </div>
  );
}

function SidebarItem({ label, active, onClick, open, icon }: { label: string; active: boolean; onClick: () => void; open: boolean; icon: string }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-2.5 px-4 py-2 text-left transition-colors ${active ? "bg-blue-50 font-medium text-blue-700" : "text-gray-600 hover:bg-gray-50"} ${!open ? "justify-center px-2" : ""}`}>
      <span className="text-base">{icon}</span>
      {open && <span className="text-[13px]">{label}</span>}
    </button>
  );
}

function LoginPage({ onLogin }: { onLogin: (u: string, p: string) => Promise<void> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onLogin(username, password);
    } catch {
      setError("Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-center text-xl font-bold text-gray-900">Wisnotech CMS</h1>
        <p className="mt-1 text-center text-xs text-gray-400">Sign in to manage your site</p>
        {error && <div className="mt-3 rounded bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        <button type="submit" disabled={loading} className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{loading ? "Signing in..." : "Sign In"}</button>
        <p className="mt-3 text-center text-[11px] text-gray-400">Default: admin / admin123</p>
      </form>
    </div>
  );
}

function DashboardPage({ pages, onEdit, loading }: { pages: PageData[]; onEdit: (slug: string) => void; loading: boolean }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Manage your site content</p>
      {loading ? (
        <div className="mt-8 text-sm text-gray-400">Loading...</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((p) => (
            <button key={p.slug} onClick={() => onEdit(p.slug)} className="group rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-blue-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-lg">📄</span>
                <span className="text-xs text-gray-300 group-hover:text-blue-400">Edit →</span>
              </div>
              <h3 className="mt-2 font-semibold text-gray-900">{PAGE_LABELS[p.slug] || p.slug}</h3>
              <p className="mt-1 text-xs text-gray-400">Last updated: {p._updatedAt ? new Date(p._updatedAt as string).toLocaleDateString() : "Never"}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EditorPage({ page, setPage, onSave, saving, saveMsg, onMedia }: { page: PageData; setPage: (p: PageData) => void; onSave: () => void; saving: boolean; saveMsg: string; onMedia: () => void }) {
  const [activeTab, setActiveTab] = useState("content");
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send preview data to iframe whenever page changes
  useEffect(() => {
    if (!showPreview || !iframeRef.current) return;
    const timer = setTimeout(() => {
      try {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "cms-preview", slug: page.slug, data: page },
          "*"
        );
      } catch { /* iframe may not be loaded yet */ }
    }, 300);
    return () => clearTimeout(timer);
  }, [page, showPreview]);

  const updateField = (path: string, value: unknown) => {
    const keys = path.split(".");
    const updated = { ...page };
    let obj: Record<string, unknown> = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      obj[keys[i]] = { ...(obj[keys[i]] as Record<string, unknown>) };
      obj = obj[keys[i]] as Record<string, unknown>;
    }
    obj[keys[keys.length - 1]] = value;
    setPage(updated);
  };

  const updateArrayItem = (path: string, index: number, field: string, value: unknown) => {
    const keys = path.split(".");
    const updated = { ...page };
    let obj: Record<string, unknown> = updated;
    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        const arr = [...(obj[keys[i]] as Record<string, unknown>[])];
        arr[index] = { ...arr[index], [field]: value };
        obj[keys[i]] = arr;
      } else {
        obj[keys[i]] = { ...(obj[keys[i]] as Record<string, unknown>) };
        obj = obj[keys[i]] as Record<string, unknown>;
      }
    }
    setPage(updated);
  };

  const addArrayItem = (path: string, template: Record<string, unknown>) => {
    const keys = path.split(".");
    const updated = { ...page };
    let obj: Record<string, unknown> = updated;
    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        const arr = [...(obj[keys[i]] as Record<string, unknown>[] || [])];
        arr.push(template);
        obj[keys[i]] = arr;
      } else {
        obj[keys[i]] = { ...(obj[keys[i]] as Record<string, unknown>) };
        obj = obj[keys[i]] as Record<string, unknown>;
      }
    }
    setPage(updated);
  };

  const removeArrayItem = (path: string, index: number) => {
    const keys = path.split(".");
    const updated = { ...page };
    let obj: Record<string, unknown> = updated;
    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        const arr = [...(obj[keys[i]] as Record<string, unknown>[])];
        arr.splice(index, 1);
        obj[keys[i]] = arr;
      } else {
        obj[keys[i]] = { ...(obj[keys[i]] as Record<string, unknown>) };
        obj = obj[keys[i]] as Record<string, unknown>;
      }
    }
    setPage(updated);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Editor header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-900">{PAGE_LABELS[page.slug] || page.slug}</h1>
          {saveMsg && <span className={`text-xs font-medium ${saveMsg.includes("Error") ? "text-red-500" : "text-green-600"}`}>{saveMsg}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPreview(!showPreview)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${showPreview ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {showPreview ? "Hide Preview" : "Live Preview"}
          </button>
          <button onClick={onMedia} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">Media Library</button>
          <button onClick={onSave} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel */}
        <div className={`flex flex-col ${showPreview ? "w-1/2" : "w-full"}`}>
          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 bg-white px-6">
            {["content", "hero", "pricing", "faq", "settings"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`border-b-2 px-3 py-2.5 text-xs font-medium capitalize transition-colors ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{tab}</button>
            ))}
          </div>

          {/* Editor body */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {activeTab === "content" && <ContentTab page={page} updateField={updateField} updateArrayItem={updateArrayItem} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />}
            {activeTab === "hero" && <HeroTab page={page} updateField={updateField} />}
            {activeTab === "pricing" && <PricingTab page={page} updateField={updateField} updateArrayItem={updateArrayItem} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />}
            {activeTab === "faq" && <FaqTab page={page} updateArrayItem={updateArrayItem} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />}
            {activeTab === "settings" && <PageSettingsTab page={page} />}
          </div>
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="flex w-1/2 flex-col border-l border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
              <span className="text-xs font-medium text-gray-500">Live Preview</span>
              <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                Auto-updates as you edit
              </span>
            </div>
            <iframe
              ref={iframeRef}
              src={`/${page.slug}`}
              className="h-full w-full border-0"
              title="Page Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// --- Tab components ---

function ContentTab({ page, updateField, updateArrayItem, addArrayItem, removeArrayItem }: { page: PageData; updateField: (path: string, value: unknown) => void; updateArrayItem: (path: string, index: number, field: string, value: unknown) => void; addArrayItem: (path: string, template: Record<string, unknown>) => void; removeArrayItem: (path: string, index: number) => void }) {
  return (
    <div className="space-y-6">
      {page.title && (
        <FieldGroup label="Page Title">
          <input value={page.title as string} onChange={(e) => updateField("title", e.target.value)} className="field" />
        </FieldGroup>
      )}

      {/* Generic: render any array fields */}
      {Object.entries(page).filter(([k]) => !["title", "hero", "pricing", "faqs", "_createdAt", "_updatedAt", "slug"].includes(k) && Array.isArray(page[k])).map(([key, val]) => (
        <FieldGroup key={key} label={key.replace(/([A-Z])/g, " $1").replace(/s$/, "")}>
          {(val as Record<string, unknown>[]).map((item: Record<string, unknown>, idx: number) => (
            <div key={idx} className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">#{idx + 1}</span>
                <button onClick={() => removeArrayItem(key, idx)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
              </div>
              {Object.entries(item).filter(([fk]) => !fk.startsWith("_")).map(([field, fval]) => (
                <div key={field} className="mb-2">
                  <label className="mb-0.5 block text-[11px] font-medium text-gray-500">{field}</label>
                  {typeof fval === "string" ? (
                    fval.length > 100 ? (
                      <textarea value={fval} onChange={(e) => updateArrayItem(key, idx, field, e.target.value)} className="field min-h-[80px]" />
                    ) : (
                      <input value={fval} onChange={(e) => updateArrayItem(key, idx, field, e.target.value)} className="field" />
                    )
                  ) : typeof fval === "number" ? (
                    <input type="number" value={fval} onChange={(e) => updateArrayItem(key, idx, field, Number(e.target.value))} className="field" />
                  ) : Array.isArray(fval) ? (
                    <textarea value={(fval as string[]).join("\n")} onChange={(e) => updateArrayItem(key, idx, field, e.target.value.split("\n").filter(Boolean))} className="field min-h-[60px]" placeholder="One per line" />
                  ) : null}
                </div>
              ))}
            </div>
          ))}
          <AddItemButton onClick={() => {
            const template: Record<string, unknown> = {};
            const arr = val as Record<string, unknown>[];
            if (arr.length > 0) Object.keys(arr[0]).forEach((k) => { template[k] = k === "n" ? String(arr.length + 1).padStart(2, "0") : ""; });
            addArrayItem(key, template);
          }} />
        </FieldGroup>
      ))}

      {/* Generic: render any object fields (non-array, non-primitive) */}
      {Object.entries(page).filter(([k]) => !["title", "hero", "pricing", "faqs", "_createdAt", "_updatedAt", "slug"].includes(k) && !Array.isArray(page[k]) && typeof page[k] === "object" && page[k] !== null).map(([key, val]) => (
        <FieldGroup key={key} label={key.replace(/([A-Z])/g, " $1")}>
          {Object.entries(val as Record<string, unknown>).filter(([fk]) => !fk.startsWith("_")).map(([field, fval]) => (
            <div key={field} className="mb-2">
              <label className="mb-0.5 block text-[11px] font-medium text-gray-500">{field}</label>
              {typeof fval === "string" ? (
                fval.length > 100 ? (
                  <textarea value={fval} onChange={(e) => updateField(`${key}.${field}`, e.target.value)} className="field min-h-[80px]" />
                ) : (
                  <input value={fval} onChange={(e) => updateField(`${key}.${field}`, e.target.value)} className="field" />
                )
              ) : typeof fval === "number" ? (
                <input type="number" value={fval} onChange={(e) => updateField(`${key}.${field}`, Number(e.target.value))} className="field" />
              ) : null}
            </div>
          ))}
        </FieldGroup>
      ))}
    </div>
  );
}

function HeroTab({ page, updateField }: { page: PageData; updateField: (path: string, value: unknown) => void }) {
  const hero = page.hero as Record<string, unknown> | undefined;
  if (!hero) return <p className="text-sm text-gray-400">No hero section for this page.</p>;

  return (
    <div className="space-y-4">
      {Object.entries(hero).filter(([k]) => !k.startsWith("_")).map(([key, val]) => (
        <FieldGroup key={key} label={key.replace(/([A-Z])/g, " $1")}>
          {typeof val === "string" ? (
            val.length > 120 ? (
              <textarea value={val} onChange={(e) => updateField(`hero.${key}`, e.target.value)} className="field min-h-[100px]" />
            ) : (
              <input value={val} onChange={(e) => updateField(`hero.${key}`, e.target.value)} className="field" />
            )
          ) : typeof val === "number" ? (
            <input type="number" value={val} onChange={(e) => updateField(`hero.${key}`, Number(e.target.value))} className="field" />
          ) : null}
        </FieldGroup>
      ))}
    </div>
  );
}

function PricingTab({ page, updateField, updateArrayItem, addArrayItem, removeArrayItem }: { page: PageData; updateField: (path: string, value: unknown) => void; updateArrayItem: (path: string, index: number, field: string, value: unknown) => void; addArrayItem: (path: string, template: Record<string, unknown>) => void; removeArrayItem: (path: string, index: number) => void }) {
  const pricing = page.pricing as Record<string, unknown> | undefined;
  if (!pricing) return <p className="text-sm text-gray-400">No pricing section for this page.</p>;

  return (
    <div className="space-y-4">
      {Object.entries(pricing).filter(([k]) => !k.startsWith("_")).map(([key, val]) => {
        if (Array.isArray(val)) {
          return (
            <FieldGroup key={key} label="Pricing Tiers">
              {(val as Record<string, unknown>[]).map((tier, idx) => (
                <div key={idx} className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">Tier #{idx + 1}</span>
                    <button onClick={() => removeArrayItem(`pricing.${key}`, idx)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                  </div>
                  {Object.entries(tier).filter(([fk]) => !fk.startsWith("_")).map(([field, fval]) => (
                    <div key={field} className="mb-2">
                      <label className="mb-0.5 block text-[11px] font-medium text-gray-500">{field}</label>
                      {typeof fval === "string" ? (
                        Array.isArray(fval) || (fval as string).includes(",") ? (
                          <textarea value={fval} onChange={(e) => updateArrayItem(`pricing.${key}`, idx, field, e.target.value)} className="field min-h-[60px]" />
                        ) : (
                          <input value={fval} onChange={(e) => updateArrayItem(`pricing.${key}`, idx, field, e.target.value)} className="field" />
                        )
                      ) : typeof fval === "number" ? (
                        <input type="number" value={fval} onChange={(e) => updateArrayItem(`pricing.${key}`, idx, field, Number(e.target.value))} className="field" />
                      ) : Array.isArray(fval) ? (
                        <textarea value={(fval as string[]).join("\n")} onChange={(e) => updateArrayItem(`pricing.${key}`, idx, field, e.target.value.split("\n").filter(Boolean))} className="field min-h-[60px]" placeholder="One per line" />
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
              <AddItemButton onClick={() => addArrayItem(`pricing.${key}`, { name: "", price: 0, currency: "NGN", usdPrice: 0, features: [] })} />
            </FieldGroup>
          );
        }
        return (
          <FieldGroup key={key} label={key.replace(/([A-Z])/g, " $1")}>
            {typeof val === "number" ? (
              <input type="number" value={val} onChange={(e) => updateField(`pricing.${key}`, Number(e.target.value))} className="field" />
            ) : typeof val === "string" ? (
              <input value={val} onChange={(e) => updateField(`pricing.${key}`, e.target.value)} className="field" />
            ) : null}
          </FieldGroup>
        );
      })}
    </div>
  );
}

function FaqTab({ page, updateArrayItem, addArrayItem, removeArrayItem }: { page: PageData; updateArrayItem: (path: string, index: number, field: string, value: unknown) => void; addArrayItem: (path: string, template: Record<string, unknown>) => void; removeArrayItem: (path: string, index: number) => void }) {
  const faqs = page.faqs as { q: string; a: string }[] | undefined;
  if (!faqs || faqs.length === 0) {
    return (
      <div>
        <p className="text-sm text-gray-400 mb-4">No FAQs yet.</p>
        <AddItemButton onClick={() => addArrayItem("faqs", { q: "", a: "" })} label="Add FAQ" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => (
        <div key={idx} className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">FAQ #{idx + 1}</span>
            <button onClick={() => removeArrayItem("faqs", idx)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
          </div>
          <div className="mb-2">
            <label className="mb-0.5 block text-[11px] font-medium text-gray-500">Question</label>
            <input value={faq.q} onChange={(e) => updateArrayItem("faqs", idx, "q", e.target.value)} className="field" />
          </div>
          <div>
            <label className="mb-0.5 block text-[11px] font-medium text-gray-500">Answer</label>
            <textarea value={faq.a} onChange={(e) => updateArrayItem("faqs", idx, "a", e.target.value)} className="field min-h-[80px]" />
          </div>
        </div>
      ))}
      <AddItemButton onClick={() => addArrayItem("faqs", { q: "", a: "" })} label="Add FAQ" />
    </div>
  );
}

function PageSettingsTab({ page }: { page: PageData }) {
  return (
    <div className="space-y-4">
      <FieldGroup label="Page Slug">
        <input value={page.slug} disabled className="field bg-gray-50 text-gray-400" />
      </FieldGroup>
      <FieldGroup label="Created">
        <p className="text-xs text-gray-500">{page._createdAt ? new Date(page._createdAt as string).toLocaleString() : "N/A"}</p>
      </FieldGroup>
      <FieldGroup label="Last Updated">
        <p className="text-xs text-gray-500">{page._updatedAt ? new Date(page._updatedAt as string).toLocaleString() : "N/A"}</p>
      </FieldGroup>
    </div>
  );
}

// --- Media Library ---
function MediaPage({ media, onRefresh, onDelete }: { media: MediaItem[]; onRefresh: () => void; onDelete: (fn: string) => void }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await adminAPI.uploadMedia(file);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="mt-1 text-sm text-gray-500">{media.length} files</p>
        </div>
        <div className="flex gap-2">
          <input ref={fileInput} type="file" accept="image/*,video/*" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileInput.current?.click()} disabled={uploading} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{uploading ? "Uploading..." : "Upload File"}</button>
          <button onClick={onRefresh} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">Refresh</button>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {media.map((m) => (
          <div key={m.name} className="group rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              {m.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
              ) : m.url.match(/\.(mp4|webm|mov)$/i) ? (
                <video src={m.url} className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl">📁</span>
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-medium text-gray-700">{m.name}</p>
              <p className="mt-0.5 text-[11px] text-gray-400">{(m.size / 1024).toFixed(0)} KB</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(m.url); }} className="text-[11px] text-blue-500 hover:underline">Copy URL</button>
                <button onClick={() => { if (confirm(`Delete ${m.name}?`)) onDelete(m.name); }} className="text-[11px] text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Settings ---
function SettingsPage() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = async () => {
    try {
      await adminAPI.changePassword(currentPw, newPw);
      setMsg("Password changed successfully");
      setCurrentPw("");
      setNewPw("");
    } catch (e) {
      setMsg("Error: " + (e as Error).message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <div className="mt-6 max-w-md">
        <h2 className="text-sm font-semibold text-gray-700">Change Password</h2>
        <input type="password" placeholder="Current password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="mt-2 field" />
        <input type="password" placeholder="New password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="mt-2 field" />
        <button onClick={handleChange} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">Update Password</button>
        {msg && <p className="mt-2 text-xs text-gray-600">{msg}</p>}
      </div>
    </div>
  );
}

// --- Shared components ---
function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label.replace(/([A-Z])/g, " $1")}</label>
      {children}
    </div>
  );
}

function AddItemButton({ onClick, label = "Add Item" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-medium text-gray-500 hover:border-blue-400 hover:text-blue-600">
      <span>+</span> {label}
    </button>
  );
}
