/**
 * React Query hooks for all admin data fetching and mutations
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  dashboardApi,
  productsApi,
  categoriesApi,
  ordersApi,
  customersApi,
  galleryApi,
  testimonialsApi,
  settingsApi,
  whatsappApi,
  leadsApi,
  crmApi,
  menusApi,
} from "@/lib/api";

// ─── Dashboard ────────────────────────────────────────────────
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardApi.stats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ["dashboard", "analytics"],
    queryFn: () => dashboardApi.analytics(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRevenueChart(days = 30) {
  return useQuery({
    queryKey: ["dashboard", "revenue", days],
    queryFn: () => dashboardApi.revenue(days),
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Products ─────────────────────────────────────────────────
export function useProducts(params?: { category?: string; search?: string; page?: number }) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.list(params),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => productsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Product created successfully");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to create product"),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: any) => productsApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Product updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update product"),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Product deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to delete product"),
  });
}

export function useUploadProductImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      productsApi.uploadImage(id, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Image uploaded");
    },
    onError: (e: any) => toast.error(e.message ?? "Image upload failed"),
  });
}

// ─── Categories ───────────────────────────────────────────────
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => categoriesApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to create category"),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: any) => categoriesApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update category"),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to delete category"),
  });
}

// ─── Menus ────────────────────────────────────────────────────
export function useMenus() {
  return useQuery({
    queryKey: ["menus"],
    queryFn: () => menusApi.list(),
  });
}

export function useMenu(id: string) {
  return useQuery({
    queryKey: ["menus", id],
    queryFn: () => menusApi.get(id),
    enabled: !!id,
  });
}

export function useCreateMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => menusApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Menu created");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to create menu"),
  });
}

export function useUpdateMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: any) => menusApi.update(id, body),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["menus"] });
      qc.invalidateQueries({ queryKey: ["menus", variables.id] });
      toast.success("Menu updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update menu"),
  });
}

export function useDeleteMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menusApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Menu deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to delete menu"),
  });
}

export function useUpdateMenuItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, items }: { id: string; items: any[] }) => menusApi.updateItems(id, { items }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["menus", variables.id] });
      qc.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Menu saved!");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to save menu items"),
  });
}

// ─── Orders ──────────────────────────────────────────────────
export function useOrders(params?: { status?: string; search?: string; page?: number }) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersApi.list(params),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => ordersApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Order created successfully");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to create order"),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: any) => ordersApi.updateStatus(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Order status updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update status"),
  });
}

export function useGenerateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => ordersApi.generateInvoice(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Invoice PDF generated successfully");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to generate invoice"),
  });
}

export function useSendInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => ordersApi.sendInvoice(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Invoice sent via WhatsApp");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to send invoice"),
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Order deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to delete order"),
  });
}

// ─── Customers ────────────────────────────────────────────────
export function useCustomers(params?: { search?: string; tag?: string }) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => customersApi.list(params),
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => customersApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Customer added");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to add customer"),
  });
}

export function useBulkCreateCustomers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (customers: any[]) => customersApi.bulkCreate(customers),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(`Successfully imported ${data.count || "all"} customers`);
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to import customers"),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: any) => customersApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Customer updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update customer"),
  });
}

// ─── CRM ──────────────────────────────────────────────────────
export function useUpcomingEvents() {
  return useQuery({
    queryKey: ["crm-events"],
    queryFn: () => crmApi.upcomingEvents(),
  });
}

// ─── Gallery ─────────────────────────────────────────────────
export function useGallery(category?: string) {
  return useQuery({
    queryKey: ["gallery", category],
    queryFn: () => galleryApi.list(category),
  });
}

export function useUploadGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, caption, category }: { file: File; caption?: string; category?: string }) =>
      galleryApi.upload(file, caption, category),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Image uploaded to gallery");
    },
    onError: (e: any) => toast.error(e.message ?? "Upload failed"),
  });
}

export function useDeleteGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => galleryApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Image deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to delete image"),
  });
}

// ─── Testimonials ─────────────────────────────────────────────
export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: () => testimonialsApi.list(),
  });
}

export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => testimonialsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Review added");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to add review"),
  });
}

export function useUpdateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: any) => testimonialsApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Review updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update review"),
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => testimonialsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Review removed");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to remove review"),
  });
}

// ─── Settings ────────────────────────────────────────────────
export function useContactSettings() {
  return useQuery({
    queryKey: ["settings", "contact"],
    queryFn: () => settingsApi.getContact(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveContactSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entries: Array<{ key: string; value: string }>) =>
      settingsApi.saveContactBulk(entries),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved successfully");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to save settings"),
  });
}

export function useHomepageSettings() {
  return useQuery({
    queryKey: ["settings", "homepage"],
    queryFn: () => settingsApi.getHomepage(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveHomepageSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entries: Array<{ key: string; value: string; type?: string }>) =>
      settingsApi.saveHomepageBulk(entries),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Homepage settings saved");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to save homepage settings"),
  });
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ["settings", "announcements"],
    queryFn: () => settingsApi.getAnnouncements(),
  });
}

export function useCreateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => settingsApi.createAnnouncement(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "announcements"] });
      toast.success("Announcement created");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to create announcement"),
  });
}

export function useUpdateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: any) => settingsApi.updateAnnouncement(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "announcements"] });
      toast.success("Announcement updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update announcement"),
  });
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsApi.deleteAnnouncement(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "announcements"] });
      toast.success("Announcement deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to delete announcement"),
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: ["settings", "faqs"],
    queryFn: () => settingsApi.getFaqs(),
  });
}

export function useCreateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => settingsApi.createFaq(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "faqs"] });
      toast.success("FAQ added");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to add FAQ"),
  });
}

export function useUpdateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: any) => settingsApi.updateFaq(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "faqs"] });
      toast.success("FAQ updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update FAQ"),
  });
}

export function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsApi.deleteFaq(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "faqs"] });
      toast.success("FAQ deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to delete FAQ"),
  });
}

// ─── WhatsApp ────────────────────────────────────────────────
export function useWhatsAppStatus() {
  return useQuery({
    queryKey: ["whatsapp", "status"],
    queryFn: () => whatsappApi.getStatus(),
  });
}

export function useWhatsAppLogs(params?: { type?: string; status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["whatsapp", "logs", params],
    queryFn: () => whatsappApi.getLogs(params),
  });
}

export function useSendPromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => whatsappApi.sendPromotion(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp", "logs"] });
      toast.success("Promotion sent successfully");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to send promotion"),
  });
}

// ─── Leads ────────────────────────────────────────────────────
export function useLeads(params?: any) {
  return useQuery({
    queryKey: ["leads", params],
    queryFn: () => leadsApi.list(params),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to delete lead"),
  });
}
