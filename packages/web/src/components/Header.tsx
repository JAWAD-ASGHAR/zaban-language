import { GITHUB_URL, NPM_INSTALL, NPM_URL } from "../constants";

export function Header() {
  return (
    <header className="mx-auto max-w-5xl px-6 pb-20 pt-24 text-center sm:pt-32">
      <p className="hero-fade mb-4 text-sm text-zaban-muted">
        Roman Urdu · dynamically typed
      </p>

      <h1 className="hero-fade-delay-1 text-5xl font-semibold tracking-tight text-zaban-ink sm:text-6xl">
        Program in Urdu
      </h1>

      <p className="hero-fade-delay-2 mx-auto mt-5 max-w-lg text-lg leading-relaxed text-zaban-muted">
        Zaban lets you write code with familiar keywords like{" "}
        <code>likho</code>, <code>agar</code>, and <code>jab tak</code>.
      </p>

      <div className="hero-fade-delay-3 mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href={NPM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-zaban-border bg-zaban-surface px-4 py-2.5 font-mono text-sm text-zaban-ink transition hover:border-zaban-muted"
        >
          {NPM_INSTALL}
        </a>
        <a href="#playground" className="btn-primary">
          Open playground
        </a>
        <a
          href={NPM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          View on npm
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          GitHub
        </a>
      </div>

      <div className="hero-fade-delay-3 mx-auto mt-16 max-w-md">
        <pre className="overflow-x-auto rounded-2xl border border-zaban-border bg-zaban-surface p-6 text-left font-mono text-[13px] leading-relaxed text-zaban-ink">
          <code>
            <span className="text-zaban-keyword">shuru</span>
            {"\n  "}
            <span className="text-zaban-keyword">likho</span>
            {' "Salam Dunya"'}
            {"\n"}
            <span className="text-zaban-keyword">khatam</span>
          </code>
        </pre>
      </div>
    </header>
  );
}
