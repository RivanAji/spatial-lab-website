import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Added 2026-09-20, splitting Header/Footer out of the root layout and
// into this route-group-only one: the new team detail page
// (app/research/[team]/page.tsx) needs the bare page (just the two
// logos it builds itself), not this site's full nav pill — whose links
// are same-page hash anchors ("#research" etc.) that only resolve
// correctly on "/" anyway. A route group is the only way in the App
// Router to have some routes skip a wrapper the root layout renders;
// `(site)` adds nothing to the URL, so "/" is unaffected.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
