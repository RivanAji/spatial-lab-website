import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Keep site navigation in this route group so team detail pages can use a bare layout.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
