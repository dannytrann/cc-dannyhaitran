export const metadata = {
  title: "Admin — CR Web Studio",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {children}
    </div>
  );
}
