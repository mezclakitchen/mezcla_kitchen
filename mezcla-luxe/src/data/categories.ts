import breads from "@/assets/cat-breads-new.jpg";
import dips from "@/assets/cat-dips-new.jpg";
import snackbox from "@/assets/cat-snackbox-new.jpg";
import grazing from "@/assets/cat-grazing-tables.jpg";
import catering from "@/assets/cat-catering.jpg";
import foodHampers from "@/assets/cat-food-hampers.jpg";
import bakes from "@/assets/cat-bakes-new.jpg";

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
    title: "Artisan Breads",
    eyebrow: "NATURALLY FERMENTED",
    sub: " Slow-fermented sourdough, wholesome everyday loaves and speciality breads—freshly baked in small batches with quality ingredients.",
    image: breads,
    cta: "Explore Breads",
  },
  {
    slug: "dips",
    to: "/dips",
    title: "Dips & Mezze",
    eyebrow: "FRESHLY JARRED",
    sub: "Creamy hummus, vibrant pestos, muhammara and seasonal spreads—crafted to elevate everything from snacks to dinner tables.",
    image: dips,
    cta: "Explore Dips",
  },
  {
    slug: "other-bakes",
    to: "/other-bakes",
    title: "Other Bakes & Desserts",
    eyebrow: "FRESH FROM THE OVEN",
    sub: "From Korean cream cheese buns and Berliners to quiches, brownies and seasonal desserts—crafted for everyday indulgence.",
    image: bakes,
    cta: "Explore Bakes",
  },
  {
    slug: "snack-boxes",
    to: "/snack-boxes",
    title: "Snack Boxes",
    eyebrow: "CURATED FOR EVERY GATHERING",
    sub: "Handcrafted, individually packed snack and meal boxes made fresh in-house—perfect for office meetings, birthday parties, kitty gatherings and celebrations.",
    image: snackbox,
    cta: "Explore Snack Boxes",
  },
  {
    slug: "grazing-tables",
    to: "/grazing-tables",
    title: "Grazing Tables",
    eyebrow: "MADE FOR GATHERINGS",
    sub: " Beautifully styled grazing tables featuring artisanal breads, cheeses, dips and handcrafted bites for memorable celebrations.",
    image: grazing,
    imageClassName: "object-bottom scale-[1.25] origin-bottom group-hover:scale-[1.35]",
    cta: "Plan a Table",
  },
  {
    slug: "catering",
    to: "/catering",
    title: "Corporate & Event Catering",
    eyebrow: "FOR EVERY OCCASION",
    sub: "Wholesome, handcrafted food for offices, house parties and events—prepared fresh and delivered with care.",
    image: catering,
    cta: "Plan Catering",
  },
  {
    slug: "food-hampers",
    to: "/food-hampers",
    title: "Food Gift Hampers",
    eyebrow: "THOUGHTFULLY CURATED",
    sub: "Artisanal hampers filled with handcrafted treats, perfect for festive gifting, client appreciation and special occasions.",
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
    title: "Cakes",
    eyebrow: "HANDCRAFTED & EGGLESS",
    sub: "From elegant minimal cakes to customised celebration cakes. Premium ingredients, natural flavours — no artificial colours or additives. Flavour comes first, always.",
    image: bakes,
    cta: "Enquire About Cakes",
  },
];
