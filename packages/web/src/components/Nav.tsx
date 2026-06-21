import { CREATORS } from "../constants";
import { LinkedInIcon } from "./Icons";
import { UrduLogo } from "./UrduLogo";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zaban-border/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <a
          href="#"
          className="shrink-0 transition-opacity hover:opacity-80"
          aria-label="Zaban home"
        >
          <UrduLogo />
        </a>

        <div className="flex flex-wrap items-center justify-end text-sm">
          <span className="mr-3.5 hidden text-zaban-muted sm:inline">Built by</span>
          <div className="flex items-center gap-1">
            {CREATORS.map((creator, i) => (
              <span key={creator.linkedin} className="inline-flex items-center">
                {i > 0 && (
                  <span aria-hidden className="mx-0.5 text-zaban-border">
                    ·
                  </span>
                )}
                <a
                  href={creator.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-zaban-muted transition-colors hover:bg-zaban-surface hover:text-zaban-ink"
                >
                  <LinkedInIcon />
                  <span>{creator.name}</span>
                </a>
              </span>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
