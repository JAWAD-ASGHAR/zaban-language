import { CREATORS, NPM_INSTALL, NPM_URL } from "../constants";
import { LinkedInIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="border-t border-zaban-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-12 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <p className="text-sm text-zaban-muted">
            Zaban — Roman Urdu programming language
          </p>
          <a
            href={NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-zaban-ink transition-opacity hover:opacity-60"
          >
            {NPM_INSTALL}
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm text-zaban-muted">
          <span>Built by</span>
          {CREATORS.map((creator, i) => (
            <span key={creator.linkedin} className="inline-flex items-center">
              {i > 0 && <span className="mx-1.5 text-zaban-border">·</span>}
              <a
                href={creator.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zaban-ink transition-opacity hover:opacity-60"
              >
                {creator.name}
                <LinkedInIcon />
              </a>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
