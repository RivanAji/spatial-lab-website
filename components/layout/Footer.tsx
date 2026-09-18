import Link from "next/link";
import { Container } from "@/components/ui/Container";

// PRD 7.10. Social links are omitted entirely — the accounts are an open
// item (PRD 3.5 / 11 open decision #4) and a dead link is worse than no
// link. Secondary nav (Publications, Products) lives here per PRD 4.1.
const SECONDARY_NAV = [
  { label: "Research", href: "/research" },
  { label: "People", href: "/people" },
  { label: "Publications", href: "/publications" },
  { label: "Products", href: "/products" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-600 py-16">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-xl font-semibold uppercase leading-tight text-ink-000">
              Spatial Analysis &amp;
              <br />
              Transportation Laboratory
            </p>
            <p className="mt-4 font-body text-sm text-ink-300">
              Institut Teknologi Sepuluh Nopember
              <br />
              Surabaya, Indonesia
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {SECONDARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-body text-sm text-ink-300 transition-colors hover:text-ink-000"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-16 font-mono text-xs text-ink-300">
          © {new Date().getFullYear()} Spatial Analysis &amp; Transportation
          Laboratory
        </p>
      </Container>
    </footer>
  );
}
