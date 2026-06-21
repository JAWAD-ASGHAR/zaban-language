import { useState } from "react";
import { GITHUB_URL, NPM_INSTALL, NPM_URL } from "../constants";
import { CheckIcon, CopyIcon, GitHubIcon, NpmIcon, PlaygroundIcon } from "./Icons";

export function Header() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(NPM_INSTALL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <header className="mx-auto max-w-5xl px-6 pb-20 pt-24 text-center sm:pt-32">
      <p className="hero-fade mb-4 text-xs tracking-wide text-zaban-muted uppercase">
        Roman Urdu · dynamically typed
      </p>

      <h1 className="hero-fade-delay-1 text-5xl font-semibold tracking-tight text-zaban-ink sm:text-6xl">
        Program in{" "}
        <span className="urdu-inline" lang="ur" dir="rtl">
          اردو
        </span>
      </h1>

      <p className="hero-fade-delay-2 mx-auto mt-5 max-w-lg text-base leading-relaxed text-zaban-muted">
        Zaban lets you write code with familiar keywords like{" "}
        <code>likho</code>, <code>agar</code>, and <code>jab tak</code>.
      </p>

      <div className="hero-fade-delay-3 mt-7 flex flex-wrap items-center justify-center gap-3">
        <a href="#playground" className="btn-primary">
          <PlaygroundIcon />
          Open Playground
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          <GitHubIcon />
          View on GitHub
        </a>
        <a
          href={NPM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          <NpmIcon />
          View on npm
        </a>
      </div>

      <div className="hero-fade-delay-3 mx-auto mt-12 mb-4 inline-flex max-w-full items-center gap-2.5 rounded-2xl border border-zaban-border bg-zaban-surface px-5 py-3.5 font-mono text-base text-zaban-ink sm:text-lg">
        <span className="truncate">{NPM_INSTALL}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy install command"}
          className="inline-flex shrink-0 items-center justify-center rounded-lg p-1.5 text-zaban-muted transition hover:bg-zaban-elevated hover:text-zaban-ink"
        >
          {copied ? (
            <CheckIcon className="size-5 text-zaban-success" />
          ) : (
            <CopyIcon className="size-5" />
          )}
        </button>
      </div>
    </header>
  );
}
