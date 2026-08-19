/**
 * Public API client for Mezcla Frontend (mezcla-luxe)
 * No authentication required — reads from public backend routes.
 */

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? body.error ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

// ─── Products ─────────────────────────────────────────────────
export const publicProductsApi = {
  list: (params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
    tag?: string;
  }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.search) q.set("search", params.search);
    if (params?.featured) q.set("featured", "true");
    if (params?.tag) q.set("tag", params.tag);
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.page) q.set("page", String(params.page));
    const qs = q.toString();
    return get<any>(`/api/products${qs ? `?${qs}` : ""}`);
  },
  get: (slug: string) => get<any>(`/api/products/${slug}`),
  enquire: (id: string) => fetch(`${BASE_URL}/api/products/${id}/enquire`, { method: "POST" }),
};

// ─── Categories ───────────────────────────────────────────────
export const publicCategoriesApi = {
  list: () => get<any>("/api/categories"),
};

// ─── Gallery ─────────────────────────────────────────────────
export const publicGalleryApi = {
  list: (category?: string) => {
    const q = category ? `?category=${category}` : "";
    return get<any>(`/api/gallery${q}`);
  },
};

export const publicTestimonialsApi = {
  list: () => get<any>("/api/testimonials"),
  getGoogleReviews: () => get<any>("/api/testimonials/google"),
};

// ─── FAQs ────────────────────────────────────────────────────
export const publicFaqsApi = {
  list: (category?: string) => {
    const q = category ? `?category=${category}` : "";
    return get<any>(`/api/faqs${q}`);
  },
};

// ─── Announcements ────────────────────────────────────────────
export const publicAnnouncementsApi = {
  list: () => get<any>("/api/announcements"),
};

// ─── Contact Info ─────────────────────────────────────────────
export const publicContactApi = {
  get: () => get<any>("/api/contact"),
};

// ─── Homepage Content ─────────────────────────────────────────
export const publicHomepageApi = {
  get: () => get<any>("/api/homepage"),
};
