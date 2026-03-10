import { socialLinks } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-lavender/30 pb-20 md:pb-0">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12">
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover-fill px-2 py-1 text-sm text-text-muted transition-colors hover:text-text"
              aria-label={link.name}
            >
              {link.name}
            </a>
          ))}
        </div>
        <p className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} Danny Tran. Campbell River, BC. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
