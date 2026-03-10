import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Hire a Campbell River Web Developer",
  description:
    "Get in touch with Danny Tran for website design in Campbell River and Vancouver Island. Available for new projects, real estate inquiries, and consultations.",
  alternates: { canonical: "https://dannytran.dev/contact" },
};

export default function ContactPage() {
  return (
    <Container>
      <SectionHeading as="h1" subtitle="I'd love to hear from you">
        Get in Touch
      </SectionHeading>
      <ContactForm />
    </Container>
  );
}
