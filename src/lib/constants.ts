import type { Project, BlogPost, Skill } from "@/types";

export const siteConfig = {
  name: "Danny Tran",
  title: "Danny Tran , Realtor & Web Developer",
  description:
    "Realtor in Campbell River, BC. I also build websites for local businesses on Vancouver Island.",
  url: "https://dannytran.dev",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const projectCategories = [
  "All",
  "Real Estate",
  "Local Business",
  "Web App",
] as const;

export const projects: Project[] = [
  {
    slug: "vanislandstats",
    title: "Van Island Stats",
    description:
      "A real estate market dashboard for Campbell River, BC. Displays benchmark prices, average/median values, and units sold across property types , sourced from VIREB data.",
    category: "Real Estate",
    tags: ["Next.js", "Data Visualization", "VIREB", "Real Estate"],
    image: "/images/projects/vanislandstats.png",
    featured: true,
    liveUrl: "https://www.vanislandstats.dev/",
    date: "2026-01",
  },
  {
    slug: "ninja-crm",
    title: "100 Ninja CRM",
    description:
      "A contact management app built around the Ninja Selling methodology. Helps realtors manage relationships with up to 100 contacts, schedule Pop-Bys, and maintain a 20-hour work week.",
    category: "Web App",
    tags: ["Next.js", "CRM", "Ninja Selling", "TypeScript"],
    image: "/images/projects/ninja-crm.png",
    featured: true,
    liveUrl: "https://100-ninja-crm.vercel.app/",
    date: "2025-12",
  },
  {
    slug: "pearly-nails",
    title: "Pearly Nails & Spa",
    description:
      "Website for a nail and spa salon in Comox, BC. Features a full service menu, online booking integration, and walk-in information for manicures, pedicures, waxing, and kids' services.",
    category: "Local Business",
    tags: ["Next.js", "Tailwind CSS", "Small Business"],
    image: "/images/projects/pearly-nails.png",
    featured: true,
    liveUrl: "http://pearlynailscomox.ca/",
    date: "2025-10",
  },
  {
    slug: "flow-studio",
    title: "Flow Studio CR",
    description:
      "Website for a reformer Pilates studio in Campbell River, BC. Showcases class offerings from foundational to athletic levels, private sessions, and the studio's story.",
    category: "Local Business",
    tags: ["Next.js", "Pilates", "Small Business"],
    image: "/images/projects/flow-studio.png",
    featured: true,
    liveUrl: "https://www.flowstudiocr.ca/",
    date: "2025-08",
  },
  {
    slug: "rush-salon",
    title: "RUSH Salon YVR",
    description:
      "Website for a full-service hair salon in Kitsilano, Vancouver. Covers haircuts, colour, treatments, extensions, and wedding hair & makeup services.",
    category: "Local Business",
    tags: ["Web Design", "Small Business", "Vancouver"],
    image: "/images/projects/rush-salon.png",
    liveUrl: "https://rushsalonyvr.com/",
    date: "2025-06",
  },
  {
    slug: "craig-spikman",
    title: "Craig Spikman Real Estate",
    description:
      "Personal website for an Associate Broker with Royal LePage Advance Realty. Highlights residential, commercial, waterfront, and investment properties on Vancouver Island.",
    category: "Real Estate",
    tags: ["Next.js", "Real Estate", "Vancouver Island"],
    image: "/images/projects/craig-spikman.png",
    liveUrl: "https://craig-spikman-website.vercel.app/",
    date: "2025-04",
  },
  {
    slug: "daves-fish-store",
    title: "Dave's Fish Store",
    description:
      "E-commerce site for a local aquarium fish breeder specializing in livebearers and catfish. Features product listings with local pickup availability.",
    category: "Local Business",
    tags: ["Next.js", "E-commerce", "Small Business"],
    image: "/images/projects/daves-fish-store.png",
    liveUrl: "https://daves-fish-store.vercel.app/",
    date: "2025-02",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "why-local-businesses-need-websites",
    title: "Why Every Local Business Needs a Website in 2026",
    excerpt:
      "A look at why having even a simple website matters for small businesses , and how it drives foot traffic and trust.",
    date: "2026-03-01",
    tags: ["Small Business", "Web Design", "Local SEO"],
    readingTime: "5 min",
  },
  {
    slug: "campbell-river-market-update",
    title: "Campbell River Real Estate Market Update",
    excerpt:
      "Breaking down the latest VIREB stats for Campbell River , what buyers and sellers need to know right now.",
    date: "2026-02-15",
    tags: ["Real Estate", "Campbell River", "Market Data"],
    readingTime: "6 min",
  },
  {
    slug: "building-with-nextjs",
    title: "Building Client Websites with Next.js",
    excerpt:
      "How I use Next.js and Tailwind CSS to build fast, modern websites for local businesses on Vancouver Island.",
    date: "2026-01-20",
    tags: ["Next.js", "Web Development", "Tutorial"],
    readingTime: "8 min",
  },
];

export const skills: Skill[] = [
  { name: "TypeScript", category: "Languages" },
  { name: "JavaScript", category: "Languages" },
  { name: "HTML / CSS", category: "Languages" },
  { name: "React", category: "Frontend" },
  { name: "AngularJS", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Vercel", category: "Deployment" },
  { name: "DigitalOcean", category: "Deployment" },
  { name: "Git", category: "Tools" },
  { name: "Figma", category: "Design" },
];

export const socialLinks = [
  { name: "GitHub", href: "https://github.com/dannyhaitran", icon: "github" },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/dannyhaitran",
    icon: "linkedin",
  },
  { name: "Email", href: "mailto:dannyhaitran@outlook.com", icon: "email" },
];
