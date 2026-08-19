import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteShell } from "@/components/layout/SiteShell";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cocoa px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-5xl text-cream">Page not found</h1>
        <p className="mt-4 text-ivory-muted">The page you're looking for doesn't exist.</p>
        <div className="mt-8">
          <Link to="/" className="btn-gold">Return Home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-cocoa px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-cream">Something went wrong</h1>
        <p className="mt-3 text-ivory-muted text-sm">{error.message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-gold">Try again</button>
          <a href="/" className="btn-ghost-gold">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mezcla — Artisan Sourdough, Hampers & Grazing Tables in Bangalore" },
      { name: "description", content: "Mezcla is a Bangalore home kitchen crafting sourdough breads, fresh mezze, snack boxes, hampers and grazing tables for birthdays, parties and festive gifting." },
      { name: "author", content: "Mezcla" },
      { name: "keywords", content: "grazing tables Bangalore, artisan hampers Bangalore, sourdough Bangalore, snack boxes, festive hampers, corporate gifting Bangalore" },
      { property: "og:title", content: "Mezcla — The Artisanal Kitchen, Bangalore" },
      { property: "og:description", content: "Sourdough, mezze, snack boxes, hampers and grazing tables — handcrafted in Bangalore." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Mezcla" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#120B09" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/logo-filled.png" },
      { rel: "canonical", href: "https://mezclakitchen.in" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap" },
    ],
    scripts: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-SSP7PXJR8G",
        async: true,
        defer: true,
      },
      {
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-SSP7PXJR8G');
          gtag('config', 'G-VZG56SRRX6');
        `,
      },
      {
        children: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "y4zepw3i0k");
        `,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@id": "https://mezclakitchen.in/#business",
          "@type": ["LocalBusiness", "FoodEstablishment", "Bakery"],
          name: "Mezcla — The Artisanal Kitchen",
          alternateName: ["Mezcla Kitchen", "Mezcla Artisanal Kitchen"],
          description:
            "Bangalore home kitchen crafting sourdough breads, fresh mezze, snack boxes, gourmet hampers and grazing tables. Handmade in small batches with honest ingredients.",
          url: "https://mezclakitchen.in",
          logo: "https://mezclakitchen.in/assets/brand/mezcla-logo.png",
          image: "https://mezclakitchen.in/og-cover.jpg",
          telephone: "+91-98922-90606",
          email: "hello@mezclakitchen.in",
          servesCuisine: [
            "Artisan Bakery",
            "Mediterranean Mezze",
            "Sourdough",
            "Grazing Tables",
            "Gifting & Hampers",
          ],
          priceRange: "₹₹",
          currenciesAccepted: "INR",
          paymentAccepted: "UPI, Bank Transfer, Cash on Delivery",
          areaServed: [
            { "@type": "City", name: "Bangalore", sameAs: "https://en.wikipedia.org/wiki/Bangalore" },
            { "@type": "Neighborhood", name: "Koramangala, Bangalore" },
            { "@type": "Neighborhood", name: "Indiranagar, Bangalore" },
            { "@type": "Neighborhood", name: "Sadashivanagar, Bangalore" },
            { "@type": "Neighborhood", name: "HSR Layout, Bangalore" },
            { "@type": "Neighborhood", name: "Whitefield, Bangalore" },
            { "@type": "Neighborhood", name: "Jayanagar, Bangalore" },
            { "@type": "Neighborhood", name: "JP Nagar, Bangalore" },
            { "@type": "Neighborhood", name: "Banashankari, Bangalore" },
            { "@type": "Neighborhood", name: "Kumaraswamy Layout, Bangalore" },
          ],
          address: {
            "@type": "PostalAddress",
            streetAddress: "153A, 10th Main Rd, Vikram Nagar, Kumaraswamy Layout",
            addressLocality: "Bengaluru",
            addressRegion: "Karnataka",
            postalCode: "560078",
            addressCountry: "IN",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              opens: "10:00",
              closes: "19:00",
            },
          ],
          sameAs: [
            "https://www.instagram.com/mezclakitchen.in/",
            "https://share.google/AgGzGJiXjaGZBic2L"
          ],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Mezcla Menu",
            itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Product", name: "Sourdough Bread" } },
              { "@type": "Offer", itemOffered: { "@type": "Product", name: "Speciality Bread" } },
              { "@type": "Offer", itemOffered: { "@type": "Product", name: "Other Bakes & Desserts" } },
              { "@type": "Offer", itemOffered: { "@type": "Product", name: "Handcrafted Dips & Mezze" } },
              { "@type": "Offer", itemOffered: { "@type": "Product", name: "Celebration Cakes" } },
              { "@type": "Offer", itemOffered: { "@type": "Product", name: "Grazing Tables" } },
              { "@type": "Offer", itemOffered: { "@type": "Product", name: "Gourmet Hampers" } },
              { "@type": "Offer", itemOffered: { "@type": "Product", name: "Corporate Catering" } },
            ],
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SiteShell />
    </QueryClientProvider>
  );
}
