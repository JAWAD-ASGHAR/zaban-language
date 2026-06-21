import { CREATORS } from "../constants";
import { LinkedInIcon } from "./Icons";
import { UrduLogo } from "./UrduLogo";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zaban-border/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a
          href="#"
          className="transition-opacity hover:opacity-80"
          aria-label="Zaban home"
        >
          <UrduLogo />
        </a>

        <div className="flex items-center gap-2">
          {CREATORS.map((creator) => (
            <a
              key={creator.linkedin}
              href={creator.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${creator.name} on LinkedIn`}
              className="inline-flex items-center justify-center rounded-full p-2 text-zaban-muted transition-colors hover:bg-zaban-surface hover:text-zaban-brand"
            >
              <LinkedInIcon className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
