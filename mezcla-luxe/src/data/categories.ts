import breads from "@/assets/cat-breads-new.jpg";
import dips from "@/assets/cat-dips-new.jpg";
import snackbox from "@/assets/cat-snackbox-new.jpg";
import grazing from "@/assets/cat-grazing-tables.jpg";
import catering from "@/assets/cat-catering.jpg";
import foodHampers from "@/assets/cat-food-hampers.jpg";
import bakes from "@/assets/cat-bakes-new.jpg";
import cake from "@/assets/p-cake.jpg";

export type CategoryCard = {
  slug: string;
  to: string;
  title: string;
  eyebrow: string;
  sub: string;
  image: string;
  imageClassName?: string;
  cta: string;
};

export const categories: CategoryCard[] = [
  {
    slug: "breads",
    to: "/breads",
    title: "Sourdough & Artisan Breads",
    eyebrow: "NATURALLY FERMENTED",
    sub: "Slow-fermented sourdough, everyday loaves and speciality breads, baked fresh in-house.",
    image: breads,
    cta: "Explore Breads",
  },
  {
    slug: "dips",
    to: "/dips",
    title: "Dips & Mezze",
    eyebrow: "FRESHLY JARRED",
    sub: "Creamy hummus, vibrant pestos, muhammara and seasonal spreads, made to go from snacks to dinner tables.",
    image: dips,
    cta: "Explore Dips",
  },
  {
    slug: "other-bakes",
    to: "/other-bakes",
    title: "Other Bakes & Desserts",
    eyebrow: "FRESH FROM THE OVEN",
    sub: "Korean cream cheese buns, Berliners, quiches, brownies and seasonal desserts, all eggless.",
    image: bakes,
    cta: "Explore Bakes",
  },
  {
    slug: "cakes",
    to: "/cakes",
    title: "Cakes worth cutting into.",
    eyebrow: "Made for the Moment",
    sub: "100% eggless celebration cakes, made with couverture chocolate and finished simply, no fondant, no over-the-top decor. Just good cake, done well",
    image: cake,
    cta: "Enquire About Cakes",
  },

  {
    slug: "snack-boxes",
    to: "/snack-boxes",
    title: "Snack Boxes",
    eyebrow: "FOR OFFICES & PARTIES",
    sub: "Individually packed snack and meal boxes, made fresh in-house, perfect for office meetings, birthdays and get-togethers.",
    image: snackbox,
    cta: "Explore Snack Boxes",
  },
  {
    slug: "grazing-tables",
    to: "/grazing-tables",
    title: "Grazing Tables",
    eyebrow: "MADE FOR GATHERINGS",
    sub: "Styled grazing tables with artisan breads, cheeses, dips and bites, set up at your venue for 15 to 100 guests.",
    image: grazing,
    imageClassName: "object-bottom scale-[1.25] origin-bottom group-hover:scale-[1.35]",
    cta: "Plan a Table",
  },
  {
    slug: "catering",
    to: "/catering",
    title: "Corporate & Event Catering",
    eyebrow: "FOR EVERY OCCASION",
    sub: "Fresh, vegetarian food for offices, house parties and events, delivered with care.",
    image: catering,
    cta: "Plan Catering",
  },
  {
    slug: "food-hampers",
    to: "/food-hampers",
    title: "Food Gift Hampers",
    eyebrow: "THOUGHTFULLY CURATED",
    sub: "Curated hampers of eggless treats, perfect for festive gifting, client appreciation and special occasions.",
    image: foodHampers,
    cta: "Explore Hampers",
  },
];

/**
 * The 5 core menu categories shown on the /products page filter tabs.
 * These map directly to Supabase category slugs.
 */
export const menuCategories: CategoryCard[] = [
  {
    slug: "sourdough-breads",
    to: "/sourdough-breads",
    title: "Sourdough Bread",
    eyebrow: "AVAILABLE EVERY WEDNESDAY",
    sub: "Long-fermented sourdough loaves in Maida or Whole Wheat — Classic, Olive Rosemary Garlic, Cheddar Jalapeño and Turmeric Walnut. Order by Monday.",
    image: breads,
    cta: "Order Sourdough",
  },
  {
    slug: "specialty-breads",
    to: "/specialty-breads",
    title: "Speciality Bread",
    eyebrow: "BAKED FRESH TO ORDER",
    sub: "Japanese milk bread, focaccia, ladi pav, kulcha, baguette, ciabatta, pesto babka and more — freshly baked in our kitchen.",
    image: breads,
    cta: "Explore Speciality Breads",
  },
  {
    slug: "other-bakes",
    to: "/other-bakes",
    title: "Other Bakes & Desserts",
    eyebrow: "FRESH FROM THE OVEN",
    sub: "Korean cream cheese buns, Berliners, quiches, cinnamon & blueberry rolls, brownies, jar cakes, cupcakes and more.",
    image: bakes,
    cta: "Explore Bakes",
  },
  {
    slug: "dips",
    to: "/dips",
    title: "Handcrafted Dips & Mezze",
    eyebrow: "FRESHLY JARRED · EVOO ONLY",
    sub: "Classic hummus, muhammara, Italian basil pesto, tzatziki, labneh and onion balsamic jam — prepared in small batches using only Extra Virgin Olive Oil.",
    image: dips,
    cta: "Explore Dips",
  },
  {
    slug: "cakes",
    to: "/cakes",
    title: "Cakes worth cutting into.",
    eyebrow: "Made for the Moment",
    sub: "100% eggless celebration cakes, made with couverture chocolate and finished simply, no fondant, no over-the-top decor. Just good cake, done well",
    image: cake,
    cta: "Enquire About Cakes",
  },
];
