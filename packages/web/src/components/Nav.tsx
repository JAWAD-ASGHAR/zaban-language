import { GITHUB_URL, NPM_URL } from "../constants";

const LINKS = [
  { href: "#playground", label: "Playground" },
  { href: "#docs", label: "Docs" },
] as const;

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zaban-border/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a
          href="#"
          className="text-sm font-semibold tracking-tight text-zaban-ink transition-opacity hover:opacity-70"
        >
          Zaban
        </a>

        <div className="flex items-center gap-6">
          {LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="hidden text-sm text-zaban-muted transition-colors hover:text-zaban-ink sm:inline"
            >
              {label}
            </a>
          ))}
          <a
            href={NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zaban-muted transition-colors hover:text-zaban-ink"
          >
            npm
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zaban-muted transition-colors hover:text-zaban-ink"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
