interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  children,
  subtitle,
  className = "",
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${className}`}>
      <Tag
        className="font-heading italic text-text"
        style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
      >
        {children}
      </Tag>
      {subtitle && (
        <p className="mt-3 max-w-xl text-text-muted">{subtitle}</p>
      )}
    </div>
  );
}
