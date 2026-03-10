import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillsGrid } from "@/components/sections/SkillsGrid";

export const metadata: Metadata = {
  title: "About",
  description: "About Danny Tran — Realtor in Campbell River, BC and web developer for local businesses on Vancouver Island.",
};

export default function AboutPage() {
  return (
    <Container>
      <div className="grid gap-16 lg:grid-cols-[1fr_2fr]">
        {/* Avatar / sidebar */}
        <div>
          <div className="mb-6 aspect-square w-full max-w-[280px] border-2 border-shadow bg-lavender/20 shadow-brutal flex items-center justify-center">
            <span className="text-6xl">◉</span>
          </div>
        </div>

        {/* Bio */}
        <div>
          <SectionHeading>About Me</SectionHeading>

          <div className="space-y-6 text-text-muted" style={{ lineHeight: 1.8 }}>
            <p>
              I&apos;m Danny, a Realtor and web developer living in Campbell River,
              BC with my wife and two kids. I help people buy and sell homes on
              Vancouver Island, and I build websites for local businesses that
              want a strong online presence.
            </p>
            <p>
              My web work ranges from real estate market dashboards to salon
              booking sites to CRM tools. I love taking a small business from
              &quot;we don&apos;t have a website&quot; to something they&apos;re proud to
              share. I build with Next.js, Tailwind CSS, and deploy on Vercel.
            </p>
            <p>
              Outside of work, I&apos;m all about the outdoors — fishing, hiking,
              camping, and making the most of everything Campbell River and
              Vancouver Island have to offer with my family.
            </p>
          </div>

          {/* Timeline */}
          <div className="mt-16">
            <h2 className="mb-8 font-heading text-2xl italic text-text">What I Do</h2>
            <div className="space-y-8 border-l-2 border-lavender/50 pl-6">
              {[
                { year: "Ongoing", role: "Realtor at Royal LePage Advance Realty", company: "Campbell River, BC" },
                { year: "Ongoing", role: "Web Developer", company: "Vancouver Island local businesses" },
                { year: "Ongoing", role: "Software Engineer", company: "SAP Canada" },
                { year: "Always", role: "Husband & Dad", company: "Family of four" },
              ].map((item) => (
                <div key={item.role}>
                  <span className="text-xs font-medium text-accent">{item.year}</span>
                  <h3 className="font-medium text-text">{item.role}</h3>
                  <p className="text-sm text-text-muted">{item.company}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-24">
        <SectionHeading subtitle="Technologies and tools I work with">
          Skills
        </SectionHeading>
        <SkillsGrid />
      </div>
    </Container>
  );
}
