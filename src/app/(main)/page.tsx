import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ContactCTA } from "@/components/sections/ContactCTA";

export const metadata: Metadata = {
  title: "Campbell River Website Design & Web Development | Danny Tran",
  description:
    "Campbell River website design by Danny Tran. I build fast, modern websites for local businesses across Vancouver Island using Next.js and Tailwind CSS. Also a Realtor at Royal LePage Advance Realty.",
  alternates: { canonical: "https://dannytran.dev" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://dannytran.dev/#person",
      name: "Danny Tran",
      url: "https://dannytran.dev",
      jobTitle: ["Web Developer", "Realtor"],
      worksFor: [
        { "@type": "Organization", name: "Royal LePage Advance Realty" },
        { "@type": "Organization", name: "SAP Canada" },
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Campbell River",
        addressRegion: "BC",
        addressCountry: "CA",
      },
      email: "dannyhaitran@outlook.com",
      sameAs: [
        "https://github.com/dannyhaitran",
        "https://linkedin.com/in/dannyhaitran",
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://dannytran.dev/#business",
      name: "Danny Tran Web Design",
      description:
        "Campbell River website design and web development for local businesses on Vancouver Island.",
      url: "https://dannytran.dev",
      telephone: "",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Campbell River",
        addressRegion: "BC",
        addressCountry: "CA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 50.0163,
        longitude: -125.2446,
      },
      areaServed: [
        "Campbell River",
        "Comox Valley",
        "Vancouver Island",
        "British Columbia",
      ],
      serviceType: [
        "Website Design",
        "Web Development",
        "Local Business Websites",
        "Real Estate Websites",
      ],
      priceRange: "$$",
    },
    {
      "@type": "WebSite",
      "@id": "https://dannytran.dev/#website",
      url: "https://dannytran.dev",
      name: "Danny Tran",
      description: "Campbell River website design and web development",
      publisher: { "@id": "https://dannytran.dev/#person" },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <AboutPreview />
      <FeaturedProjects />
      <ContactCTA />
    </>
  );
}
