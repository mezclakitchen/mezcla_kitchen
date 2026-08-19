import { usePublicContactInfo } from "./usePublicApi";
import { site } from "@/lib/site";

export function useWhatsApp() {
  const { data } = usePublicContactInfo();
  // Prefer live WhatsApp number from database, fallback to phone, then fallback to site.ts hardcoded
  const rawNumber = data?.data?.whatsapp || data?.data?.phone || site.phone;
  // Ensure we strip out any non-numeric characters (like + or spaces)
  const waNumber = rawNumber.replace(/\D/g, "");

  const generateWhatsAppLink = (message: string) => {
    const text = encodeURIComponent(message.trim().slice(0, 1500));
    return `https://wa.me/${waNumber}?text=${text}`;
  };

  return { generateWhatsAppLink };
}
