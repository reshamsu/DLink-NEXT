import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Script from "next/script";

const siteUrl = "https://dlink-colombo.com";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function parseImageUrls(raw: string[] | string | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const { data } = await supabase
    .from("property")
    .select(
      "property_title, property_subtitle, city, location, property_type, listing_type, price, image_urls, description, bedrooms, bathrooms, sqft"
    )
    .eq("id", id)
    .single();

  if (!data) {
    return {
      title: "Property Listing",
      description: "View property details on D-Link Real Estate — Colombo's premier property platform.",
    };
  }

  const images = parseImageUrls(data.image_urls);
  const ogImage = images[0] || "/og-image.jpg";

  const title = `${data.property_title} — ${data.city}`;
  const description =
    data.description ||
    `${data.property_type} ${data.listing_type.toLowerCase()} in ${data.city}, ${data.location}. ${data.bedrooms} beds · ${data.bathrooms} baths · ${data.sqft} sqft. Priced at LKR ${data.price?.toLocaleString()} (Negotiable). ${data.property_subtitle ?? ""}`.trim();

  const url = `${siteUrl}/listing/${id}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | D-Link Real Estate`,
      description,
      url,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | D-Link Real Estate`,
      description,
      images: [ogImage],
    },
    alternates: { canonical: url },
  };
}

async function getListingSchema(id: string) {
  const { data } = await supabase
    .from("property")
    .select(
      "property_title, city, location, property_type, listing_type, price, image_urls, description, bedrooms, bathrooms, sqft"
    )
    .eq("id", id)
    .single();

  if (!data) return null;

  const images = parseImageUrls(data.image_urls);

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: data.property_title,
    description: data.description,
    url: `${siteUrl}/listing/${id}`,
    image: images,
    address: {
      "@type": "PostalAddress",
      addressLocality: data.city,
      streetAddress: data.location,
      addressCountry: "LK",
    },
    numberOfRooms: data.bedrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: data.sqft,
      unitCode: "FTK",
    },
    offers: {
      "@type": "Offer",
      price: data.price,
      priceCurrency: "LKR",
      availability: "https://schema.org/InStock",
    },
  };
}

export default async function ListingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const schema = await getListingSchema(id);

  return (
    <>
      {schema && (
        <Script
          id="listing-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {children}
    </>
  );
}
