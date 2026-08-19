import brownies from "@/assets/p-brownies.jpg";
import granola from "@/assets/p-granola.jpg";
import truffles from "@/assets/p-truffles.jpg";
import cake from "@/assets/p-cake.jpg";
import koreanBun from "@/assets/p-korean-bun.jpg";
import hummus from "@/assets/p-hummus.jpg";
import wheatLoaf from "@/assets/p-wheat-loaf.jpg";
import snackBox from "@/assets/cat-snackbox.jpg";

export type Category =
  | "Breads"
  | "Dips & Mezze"
  | "Snack Boxes"
  | "Bakes"
  | "Jars"
  | "Cakes & Desserts";

export type DietTag = "Veg" | "Eggless" | "Vegan" | "Contains Egg";

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: string;
  image: string;
  blurb: string;
  tag?: "Bestseller" | "New" | "Festive" | "Customisable" | "Pre-order";
  prep: string;
  diet: DietTag[];
  customisable: boolean;
};

// All copy & pricing editable from this file. No fake counts in UI.
export const products: Product[] = [
  {
    id: "classic-sourdough",
    name: "Classic Sourdough Loaf",
    category: "Breads",
    price: "₹380",
    image: brownies, // placeholder for visual variety
    blurb: "Long-fermented, open crumb, deeply tangy crust. Baked in small batches.",
    tag: "Bestseller",
    prep: "Bake days · Order 2 days prior",
    diet: ["Veg", "Eggless"],
    customisable: false,
  },
  {
    id: "whole-wheat-loaf",
    name: "Whole Wheat Sourdough",
    category: "Breads",
    price: "₹420",
    image: wheatLoaf,
    blurb: "Hearty 100% whole wheat, naturally leavened. Nutty, wholesome, honest.",
    prep: "Bake days · Order 2 days prior",
    diet: ["Veg", "Eggless"],
    customisable: false,
  },
  {
    id: "korean-cream-cheese-bun",
    name: "Korean Cream Cheese Garlic Buns",
    category: "Breads",
    price: "₹120 / bun",
    image: koreanBun,
    blurb: "Pillowy buns soaked in garlic butter, filled with sweet-savoury cream cheese.",
    tag: "New",
    prep: "Made fresh · Order 2 days prior",
    diet: ["Veg"],
    customisable: false,
  },
  {
    id: "classic-hummus",
    name: "Classic Hummus Jar",
    category: "Dips & Mezze",
    price: "₹320 / 250g",
    image: hummus,
    blurb: "Slow-blended chickpeas, tahini, lemon and good olive oil. The everyday classic.",
    tag: "Bestseller",
    prep: "Made fresh · 2 days notice",
    diet: ["Veg", "Eggless", "Vegan"],
    customisable: false,
  },
  {
    id: "muhammara",
    name: "Muhammara",
    category: "Dips & Mezze",
    price: "₹360 / 250g",
    image: hummus,
    blurb: "Roasted red pepper, walnut and pomegranate molasses. Smoky, sweet, warming.",
    prep: "Made fresh · 2 days notice",
    diet: ["Veg", "Eggless", "Vegan"],
    customisable: false,
  },
  {
    id: "snack-box-classic",
    name: "Classic Snack Box",
    category: "Snack Boxes",
    price: "From ₹450 / box",
    image: snackBox,
    blurb: "A balanced little box of savouries, a small bake and seasonal fruit. Lovely for meetings, parties and gifting.",
    tag: "Customisable",
    prep: "Min 10 boxes · 3 days notice",
    diet: ["Veg"],
    customisable: true,
  },
  {
    id: "salted-fudge-brownies",
    name: "Salted Fudge Brownies",
    category: "Bakes",
    price: "₹650 / box of 6",
    image: brownies,
    blurb: "Dense, dark and finished with sea salt flakes.",
    tag: "Bestseller",
    prep: "Made fresh · 2 days notice",
    diet: ["Contains Egg"],
    customisable: false,
  },
  {
    id: "honey-cocoa-granola",
    name: "Honey & Cocoa Granola",
    category: "Jars",
    price: "₹540 / 400g",
    image: granola,
    blurb: "Slow-baked oats with raw honey, almonds and dark cacao nibs.",
    prep: "Ships in 2 days",
    diet: ["Veg", "Eggless"],
    customisable: false,
  },
  {
    id: "single-origin-truffles",
    name: "Single-Origin Chocolate Truffles",
    category: "Cakes & Desserts",
    price: "From ₹980",
    image: truffles,
    blurb: "Hand-rolled 70% chocolate, dusted with cocoa.",
    tag: "Festive",
    prep: "Made fresh · 2 days notice",
    diet: ["Veg", "Eggless"],
    customisable: true,
  },
  {
    id: "pistachio-rose-cake",
    name: "Pistachio Rose Celebration Cake",
    category: "Cakes & Desserts",
    price: "From ₹2,400",
    image: cake,
    blurb: "Buttery pistachio sponge, rosewater cream, edible blooms.",
    tag: "Customisable",
    prep: "Pre-order · 3 days prior",
    diet: ["Contains Egg"],
    customisable: true,
  },
];
