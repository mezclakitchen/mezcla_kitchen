/**
 * React Query hooks for public (unauthenticated) data fetching
 * Used by mezcla-luxe frontend pages to fetch live data from the backend API.
 */
import { useQuery } from "@tanstack/react-query";
import {
  publicProductsApi,
  publicCategoriesApi,
  publicGalleryApi,
  publicTestimonialsApi,
  publicFaqsApi,
  publicAnnouncementsApi,
  publicContactApi,
  publicHomepageApi,
} from "@/lib/api";

// ─── Products ─────────────────────────────────────────────────
export function usePublicProducts(params?: {
  category?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  tag?: string;
}) {
  return useQuery({
    queryKey: ["public-products", params],
    queryFn: () => publicProductsApi.list(params),
    staleTime: 0, // 10 seconds for dev/real-time testing
    // Fallback to empty array on error so pages don't crash
    placeholderData: { data: [] },
  });
}

export function usePublicProductsByCategory(categorySlug: string) {
  return useQuery({
    queryKey: ["public-products", { category: categorySlug }],
    queryFn: () => publicProductsApi.list({ category: categorySlug, limit: 50 }),
    staleTime: 0,
    placeholderData: { data: [] },
  });
}

export function usePublicFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: ["public-products", "featured", limit],
    queryFn: () => publicProductsApi.list({ featured: true, limit }),
    staleTime: 0,
    placeholderData: { data: [] },
  });
}

// ─── Categories ───────────────────────────────────────────────
export function usePublicCategories() {
  return useQuery({
    queryKey: ["public-categories"],
    queryFn: () => publicCategoriesApi.list(),
    staleTime: 0,
    placeholderData: { data: [] },
  });
}

// ─── Gallery ─────────────────────────────────────────────────
export function usePublicGallery(category?: string) {
  return useQuery({
    queryKey: ["public-gallery", category],
    queryFn: () => publicGalleryApi.list(category),
    staleTime: 0,
    placeholderData: { data: [] },
  });
}

// ─── Testimonials ─────────────────────────────────────────────
export function usePublicTestimonials() {
  return useQuery({
    queryKey: ["public-testimonials"],
    queryFn: () => publicTestimonialsApi.list(),
    staleTime: 0,
    placeholderData: { data: [] },
  });
}

export function usePublicGoogleReviews() {
  return useQuery({
    queryKey: ["public-google-reviews"],
    queryFn: () => publicTestimonialsApi.getGoogleReviews(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache on frontend
    placeholderData: { data: { reviews: [], rating: 0, userRatingCount: 0 } },
  });
}

// ─── FAQs ────────────────────────────────────────────────────
export function usePublicFaqs(category?: string) {
  return useQuery({
    queryKey: ["public-faqs", category],
    queryFn: () => publicFaqsApi.list(category),
    staleTime: 0,
    placeholderData: { data: [] },
  });
}

// ─── Announcements ────────────────────────────────────────────
export function usePublicAnnouncements() {
  return useQuery({
    queryKey: ["public-announcements"],
    queryFn: () => publicAnnouncementsApi.list(),
    staleTime: 0,
    placeholderData: { data: [] },
  });
}

// ─── Contact Info ─────────────────────────────────────────────
export function usePublicContactInfo() {
  return useQuery({
    queryKey: ["public-contact"],
    queryFn: () => publicContactApi.get(),
    staleTime: 0,
    placeholderData: { data: [] },
  });
}

// ─── Homepage Content ─────────────────────────────────────────
export function usePublicHomepageContent() {
  return useQuery({
    queryKey: ["public-homepage"],
    queryFn: () => publicHomepageApi.get(),
    staleTime: 0,
    placeholderData: { data: {} },
  });
}
