import Link from "next/link";

interface LinkHoverFillProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function LinkHoverFill({
  href,
  children,
  className = "",
  external = false,
}: LinkHoverFillProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`link-hover-fill ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={`link-hover-fill ${className}`}>
      {children}
    </Link>
  );
}
