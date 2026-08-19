export type Testimonial = {
  name: string;
  city: string;
  text: string;
  occasion: string;
};

// Soften copy. No fake counts. Replace with real reviews when available.
export const testimonials: Testimonial[] = [
  {
    name: "A. M.",
    city: "Bangalore",
    occasion: "Anniversary at home",
    text: "The grazing table felt like the centrepiece of our evening — beautifully thought through, and everyone asked who had made it.",
  },
  {
    name: "R. K.",
    city: "Bangalore",
    occasion: "Corporate festive gifting",
    text: "We sent hampers across the team — beautifully packed, on time, and handled personally over WhatsApp. Lovely to work with.",
  },
  {
    name: "S. & V.",
    city: "Bangalore",
    occasion: "House party",
    text: "Ordered snack boxes for a small get-together. Honest, fresh and clearly made with care.",
  },
  {
    name: "T. I.",
    city: "Bangalore",
    occasion: "Birthday at home",
    text: "The cake was understated and just right — tasted as honest as it looked.",
  },
];
