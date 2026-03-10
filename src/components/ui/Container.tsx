interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export function Container({
  children,
  className = "",
  narrow = false,
}: ContainerProps) {
  return (
    <div
      className={`mx-auto px-6 ${
        narrow ? "max-w-3xl" : "max-w-6xl"
      } ${className}`}
      style={{ paddingTop: "5vh", paddingBottom: "5vh" }}
    >
      {children}
    </div>
  );
}
