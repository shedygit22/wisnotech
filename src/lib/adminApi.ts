const API_BASE = window.location.port === "5173"
  ? `http://localhost:3001`
  : "";

class AdminAPI {
  token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("admin_token");
  }

  private async request(path: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (res.status === 401) {
      this.token = null;
      localStorage.removeItem("admin_token");
      window.location.href = "/admin";
      throw new Error("Unauthorized");
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || "Request failed");
    }
    return res.json();
  }

  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const data = await res.json();
    this.token = data.token;
    localStorage.setItem("admin_token", data.token);
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem("admin_token");
  }

  isLoggedIn() {
    return !!this.token;
  }

  async getPages() {
    return this.request("/api/admin/pages");
  }

  async getPage(slug: string) {
    return this.request(`/api/admin/pages/${slug}`);
  }

  async savePage(slug: string, data: Record<string, unknown>) {
    return this.request(`/api/admin/pages/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async createPage(slug: string, data: Record<string, unknown>) {
    return this.request("/api/admin/pages", {
      method: "POST",
      body: JSON.stringify({ slug, ...data }),
    });
  }

  async deletePage(slug: string) {
    return this.request(`/api/admin/pages/${slug}`, { method: "DELETE" });
  }

  async getMedia() {
    return this.request("/api/admin/media");
  }

  async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const headers: Record<string, string> = {};
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;

    const res = await fetch(`${API_BASE}/api/admin/media/upload`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  }

  async deleteMedia(filename: string) {
    return this.request(`/api/admin/media/${filename}`, { method: "DELETE" });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request("/api/admin/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }
}

export const adminAPI = new AdminAPI();
