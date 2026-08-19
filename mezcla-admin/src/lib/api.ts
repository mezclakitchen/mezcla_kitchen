/**
 * Authenticated API client for Mezcla Admin
 * All requests include Supabase JWT for backend auth
 */
import { getAuthToken } from "./supabase";

const BASE_URL = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.message ?? body.error ?? `Request failed: ${res.status}`,
    );
  }

  return res.json();
}

async function uploadRequest<T>(
  path: string,
  file: File,
): Promise<T> {
  const token = await getAuthToken();
  const buffer = await file.arrayBuffer();

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": file.type,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: buffer,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.message ?? body.error ?? `Upload failed: ${res.status}`,
    );
  }
  return res.json();
}

// ─── Dashboard ────────────────────────────────────────────────
export const dashboardApi = {
  stats: () => request<any>("/api/admin/dashboard/stats"),
  analytics: () => request<any>("/api/admin/dashboard/analytics"),
  revenue: (days = 30) =>
    request<any>(`/api/admin/dashboard/revenue?days=${days}`),
};

// ─── Products ─────────────────────────────────────────────────
export const productsApi = {
  list: (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.search) q.set("search", params.search);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    return request<any>(`/api/admin/products?${q}`);
  },
  create: (body: any) =>
    request<any>("/api/admin/products", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) =>
    request<any>(`/api/admin/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  uploadImage: (id: string, file: File) =>
    uploadRequest<any>(`/api/admin/products/${id}/image`, file),
  delete: (id: string) =>
    request<any>(`/api/admin/products/${id}`, { method: "DELETE" }),
};

// ─── Categories ───────────────────────────────────────────────
export const categoriesApi = {
  list: () => request<any>("/api/admin/categories"),
  create: (body: any) =>
    request<any>("/api/admin/categories", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) =>
    request<any>(`/api/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  uploadImage: (id: string, file: File) =>
    uploadRequest<any>(`/api/admin/categories/${id}/image`, file),
  delete: (id: string) =>
    request<any>(`/api/admin/categories/${id}`, { method: "DELETE" }),
};

// ─── Orders ──────────────────────────────────────────────────
export const ordersApi = {
  list: (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    if (params?.search) q.set("search", params.search);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    return request<any>(`/api/admin/orders?${q}`);
  },
  get: (id: string) => request<any>(`/api/admin/orders/${id}`),
  create: (body: any) =>
    request<any>("/api/admin/orders", { method: "POST", body: JSON.stringify(body) }),
  updateStatus: (id: string, body: any) =>
    request<any>(`/api/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify(body) }),
  generateInvoice: (id: string) =>
    request<any>(`/api/admin/orders/${id}/invoice`, { method: "POST" }),
  sendInvoice: (id: string) =>
    request<any>(`/api/admin/orders/${id}/send-invoice`, { method: "POST" }),
  delete: (id: string) =>
    request<any>(`/api/admin/orders/${id}`, { method: "DELETE" }),
};

// ─── CRM ──────────────────────────────────────────────────────
export const crmApi = {
  upcomingEvents: () => request<any>("/api/admin/crm/upcoming-events"),
};

// ─── Customers ────────────────────────────────────────────────
export const customersApi = {
  list: (params?: { search?: string; tag?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.tag) q.set("tag", params.tag);
    return request<any>(`/api/admin/customers?${q}`);
  },
  get: (id: string) => request<any>(`/api/admin/customers/${id}`),
  create: (body: any) =>
    request<any>("/api/admin/customers", { method: "POST", body: JSON.stringify(body) }),
  bulkCreate: (customers: any[]) =>
    request<any>("/api/admin/customers/bulk", { method: "POST", body: JSON.stringify({ customers }) }),
  update: (id: string, body: any) =>
    request<any>(`/api/admin/customers/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: string) =>
    request<any>(`/api/admin/customers/${id}`, { method: "DELETE" }),
};

// ─── Gallery ─────────────────────────────────────────────────
export const galleryApi = {
  list: (category?: string) => {
    const q = category ? `?category=${category}` : "";
    return request<any>(`/api/admin/gallery${q}`);
  },
  upload: (file: File, caption?: string, category?: string) => {
    // First upload the image, then update metadata
    return uploadRequest<any>(`/api/admin/gallery/upload?caption=${encodeURIComponent(caption ?? "")}&category=${encodeURIComponent(category ?? "general")}`, file);
  },
  update: (id: string, body: any) =>
    request<any>(`/api/admin/gallery/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: string) =>
    request<any>(`/api/admin/gallery/${id}`, { method: "DELETE" }),
};

// ─── Testimonials ─────────────────────────────────────────────
export const testimonialsApi = {
  list: () => request<any>("/api/admin/testimonials"),
  create: (body: any) =>
    request<any>("/api/admin/testimonials", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) =>
    request<any>(`/api/admin/testimonials/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: string) =>
    request<any>(`/api/admin/testimonials/${id}`, { method: "DELETE" }),
};

// ─── Menus ───────────────────────────────────────────────────
export const menusApi = {
  list: () => request<any>("/api/admin/menus"),
  get: (id: string) => request<any>(`/api/admin/menus/${id}`),
  create: (body: any) =>
    request<any>("/api/admin/menus", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) =>
    request<any>(`/api/admin/menus/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: string) =>
    request<any>(`/api/admin/menus/${id}`, { method: "DELETE" }),
  updateItems: (id: string, body: any) =>
    request<any>(`/api/admin/menus/${id}/items`, { method: "PUT", body: JSON.stringify(body) }),
};

// ─── Settings ────────────────────────────────────────────────
export const settingsApi = {
  getContact: () => request<any>("/api/admin/settings/contact"),
  saveContactBulk: (entries: Array<{ key: string; value: string }>) =>
    request<any>("/api/admin/settings/contact/bulk", { method: "POST", body: JSON.stringify(entries) }),
  updateContact: (key: string, value: string) =>
    request<any>(`/api/admin/settings/contact/${key}`, { method: "PUT", body: JSON.stringify({ value }) }),

  getHomepage: () => request<any>("/api/admin/settings/homepage"),
  saveHomepageBulk: (entries: Array<{ key: string; value: string; type?: string }>) =>
    request<any>("/api/admin/settings/homepage/bulk", { method: "POST", body: JSON.stringify(entries) }),

  getAnnouncements: () => request<any>("/api/admin/settings/announcements"),
  createAnnouncement: (body: any) =>
    request<any>("/api/admin/settings/announcements", { method: "POST", body: JSON.stringify(body) }),
  updateAnnouncement: (id: string, body: any) =>
    request<any>(`/api/admin/settings/announcements/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteAnnouncement: (id: string) =>
    request<any>(`/api/admin/settings/announcements/${id}`, { method: "DELETE" }),

  getFaqs: () => request<any>("/api/admin/settings/faqs"),
  createFaq: (body: any) =>
    request<any>("/api/admin/settings/faqs", { method: "POST", body: JSON.stringify(body) }),
  updateFaq: (id: string, body: any) =>
    request<any>(`/api/admin/settings/faqs/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteFaq: (id: string) =>
    request<any>(`/api/admin/settings/faqs/${id}`, { method: "DELETE" }),
};

export const leadsApi = {
  list: (params?: any) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
    ) as Record<string, string>;
    return request<any>(`/api/admin/leads?${new URLSearchParams(cleanParams)}`);
  },
  delete: (id: string) => request<any>(`/api/admin/leads/${id}`, { method: "DELETE" }),
};

// ─── WhatsApp ────────────────────────────────────────────────
export const whatsappApi = {
  getStatus: () => request<any>("/api/admin/whatsapp/status"),
  getLogs: (params?: { type?: string; status?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.type) q.set("type", params.type);
    if (params?.status) q.set("status", params.status);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    return request<any>(`/api/admin/whatsapp/logs?${q}`);
  },
  sendPromotion: (body: any) =>
    request<any>("/api/admin/whatsapp/send-promotion", { method: "POST", body: JSON.stringify(body) }),
};
