// Mezcla — The Artisanal Kitchen
// Central site config. Edit business details here.

export const site = {
  name: "Mezcla",
  tagline: "The Artisanal Kitchen",
  // E.164 (without '+') for wa.me. Replace with the real number.
  phone: "9892290606",
  email: "mezclakitchen@gmail.com",
  instagram: "https://instagram.com/mezclakitchen.in",
  facebook: "https://facebook.com/mezclakitchen.in",
  linkedin: "https://linkedin.com/company/mezclakitchen",
  city: "Bangalore",
  serviceAreas: "Bangalore and select surrounding areas",
  address: "1st floor, 153A, 10th Main Rd, Vikram Nagar, Kumaraswamy Layout, Bengaluru, Karnataka 560078",
  hours: "Mon – Sun · 10:30 AM – 6:00 PM",
  fssai: "FSSAI: 21225193002235",
  leadTime: "Most orders need 2–3 days notice",
  announcement:
    "Handcrafted in small batches · Order 2–3 days in advance · Delivering across South & Central Bangalore",
};

const BRAND_LINE = "— Team Mezcla";

export function generateWhatsAppLink(message: string) {
  // Trim and encode safely. Keep newlines for readable messages.
  const text = encodeURIComponent(message.trim().slice(0, 1500));
  return `https://wa.me/${site.phone}?text=${text}`;
}

export const waMessages = {
  general:
    `Hi Mezcla, I'd like to enquire about your offerings.\n\nThank you!`,

  menu:
    `Hi Mezcla, could you please share your current menu and price list?\n\n` +
    `I'd like to know what's available this week.\n\nThank you!`,

  product: (name: string) =>
    `Hi Mezcla, I'd like to order:\n\n• ${name}\n\n` +
    `Could you please share price, lead time and delivery details?`,

  productWithVariant: (name: string, variantName: string, variantPrice?: number | null) =>
    `Hi Mezcla, I'd like to order:\n\n` +
    `• ${name}\n` +
    `  Option selected: ${variantName}${variantPrice ? ` (₹${Number(variantPrice).toLocaleString("en-IN")})` : ""}\n\n` +
    `Could you please confirm availability, lead time and delivery details?`,

  snackBox: (occasion = "[occasion]", guests = "[guests]", date = "[date]") =>
    `Hi Mezcla, I'd like to enquire about Snack Boxes:\n\n` +
    `Occasion: ${occasion}\nGuests: ${guests}\nDate needed: ${date}\n\n` +
    `Please share box options and pricing.`,

  grazing: (
    event = "[event type]",
    date = "[date]",
    guests = "[guest count]",
    location = "[area in Bangalore]"
  ) =>
    `Hi Mezcla, I'd like to plan a Grazing Table:\n\n` +
    `Event: ${event}\nDate: ${date}\nGuests: ${guests}\nLocation: ${location}\n\n` +
    `Please share styles, pricing and what's included.`,

  hamper: (occasion = "[occasion]", budget = "[budget per hamper]", quantity = "[qty]") =>
    `Hi Mezcla, I'd like to customise a Hamper:\n\n` +
    `Occasion: ${occasion}\nBudget per hamper: ${budget}\nQuantity: ${quantity}\n\n` +
    `Please help me curate it.`,

  corporate: (occasion = "[festive / onboarding / appreciation]", quantity = "[50+]") =>
    `Hi Mezcla, Corporate gifting enquiry:\n\n` +
    `Occasion: ${occasion}\nQuantity: ${quantity}\nDelivery city: Bangalore\n\n` +
    `Please share corporate hamper options (MOQ 50).`,

  party: (event = "[birthday / house party]", date = "[date]", guests = "[guests]") =>
    `Hi Mezcla, Party / event food enquiry:\n\n` +
    `Event: ${event}\nDate: ${date}\nGuests: ${guests}\n\n` +
    `Looking at snack boxes / grazing table / desserts.`,

  // Legacy aliases kept so existing imports don't break.
  catalogue:
    `Hi Mezcla, could you please share your current menu and price list?\n\nThank you!`,
};
