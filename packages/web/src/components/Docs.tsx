import type { ReactNode } from "react";
import {
  DOC_EXAMPLES,
  DOC_NOTES,
  LITERALS,
  NPM_INSTALL,
  NPM_URL,
  OPERATORS,
  PROGRAM_STRUCTURE,
  STATEMENTS,
} from "../constants";
import { Reveal } from "./Reveal";

type DocRow = Record<string, string>;

function DocTable({
  rows,
  columns,
}: {
  columns: string[];
  rows: ReadonlyArray<DocRow>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zaban-border bg-zaban-surface text-left text-xs tracking-wide text-zaban-muted uppercase">
            {columns.map((col) => (
              <th key={col} className="px-5 py-3 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-zaban-border transition-colors last:border-0 hover:bg-zaban-surface/60"
            >
              {columns.map((col) => {
                const key = col.toLowerCase() as keyof DocRow;
                const value = row[key] ?? "";
                const isKeyword = col === "Urdu" || col === "Symbols";
                return (
                  <td
                    key={col}
                    className={`px-5 py-3.5 ${isKeyword ? "font-mono font-medium text-zaban-ink" : col === "English" || col === "Category" ? "text-zaban-ink" : "text-zaban-muted"}`}
                  >
                    {isKeyword ? <code className="bg-transparent p-0">{value}</code> : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocBlock({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <article>
      <header className="mb-5">
        <p className="text-xs font-medium tracking-wide text-zaban-brand uppercase">
          {label}
        </p>
        <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-zaban-ink">
          {title}
        </h3>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zaban-muted">
            {description}
          </p>
        )}
      </header>
      <div className="overflow-hidden rounded-2xl border border-zaban-border">
        {children}
      </div>
    </article>
  );
}

function ExamplePanelBar({ label }: { label: string }) {
  return (
    <div className="flex h-10 shrink-0 items-center border-b border-zaban-border px-4">
      <span className="text-xs font-medium tracking-wide text-zaban-muted uppercase">
        {label}
      </span>
    </div>
  );
}

function CodeExample({
  title,
  description,
  code,
  output,
}: {
  title: string;
  description: string;
  code: string;
  output: string;
}) {
  return (
    <div className="border-b border-zaban-border last:border-0">
      <div className="border-b border-zaban-border bg-zaban-surface px-5 py-4">
        <p className="font-medium text-zaban-ink">{title}</p>
        <p className="mt-1 text-sm text-zaban-muted">{description}</p>
      </div>
      <div className="grid md:grid-cols-2">
        <div className="border-b border-zaban-border md:border-b-0 md:border-r">
          <ExamplePanelBar label="Code" />
          <pre className="overflow-x-auto bg-white p-4 font-mono text-sm leading-relaxed text-zaban-ink">
            <code>{code}</code>
          </pre>
        </div>
        <div>
          <ExamplePanelBar label="Output" />
          <pre className="overflow-x-auto bg-zaban-surface p-4 font-mono text-sm leading-relaxed text-zaban-success">
            <code>{output}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export function Docs() {
  return (
    <Reveal delay={80}>
      <section id="docs" className="scroll-mt-20 border-t border-zaban-border pb-32 pt-24">
        <header className="mb-16 max-w-2xl">
          <p className="text-xs tracking-wide text-zaban-muted uppercase">
            Reference
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zaban-ink sm:text-4xl">
            Language reference
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zaban-muted">
            Zaban is a dynamically typed language with Roman Urdu keywords.
            Install the package, write a <code>.zbn</code> file, and run it from
            the terminal or import it as a library.
          </p>
        </header>

        <div className="space-y-16">
          <DocBlock
            label="Getting started"
            title="Install"
            description="Add the package to your project, then run programs from the CLI."
          >
            <div className="divide-y divide-zaban-border bg-white">
              <div className="px-5 py-4">
                <p className="text-xs font-medium tracking-wide text-zaban-muted uppercase">
                  npm
                </p>
                <a
                  href={NPM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm font-medium text-zaban-keyword hover:underline"
                >
                  zaban-lang
                </a>
                <code className="mt-3 block rounded-xl border border-zaban-border bg-zaban-surface px-4 py-3 font-mono text-sm text-zaban-ink">
                  {NPM_INSTALL}
                </code>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs font-medium tracking-wide text-zaban-muted uppercase">
                  CLI
                </p>
                <code className="mt-3 block rounded-xl border border-zaban-border bg-zaban-surface px-4 py-3 font-mono text-sm text-zaban-ink">
                  npx zaban run program.zbn
                </code>
              </div>
            </div>
          </DocBlock>

          <DocBlock
            label="Basics"
            title="Notes"
            description="A few conventions worth knowing before you write your first program."
          >
            <ul className="divide-y divide-zaban-border bg-white">
              {DOC_NOTES.map((note) => (
                <li
                  key={note}
                  className="px-5 py-3.5 text-sm leading-relaxed text-zaban-muted"
                >
                  {note}
                </li>
              ))}
            </ul>
          </DocBlock>

          <DocBlock
            label="Syntax"
            title="Program structure"
            description="Every program is wrapped in a start and end block."
          >
            <DocTable
              columns={["Urdu", "English", "Usage"]}
              rows={PROGRAM_STRUCTURE.map((r) => ({ ...r }))}
            />
          </DocBlock>

          <DocBlock
            label="Syntax"
            title="Statements"
            description="Keywords for printing, declaring variables, branching, and looping."
          >
            <DocTable
              columns={["Urdu", "English", "Usage"]}
              rows={STATEMENTS.map((r) => ({ ...r }))}
            />
          </DocBlock>

          <DocBlock
            label="Syntax"
            title="Literals"
            description="Built-in values for booleans, null, numbers, and strings."
          >
            <DocTable
              columns={["Urdu", "English", "Usage"]}
              rows={LITERALS.map((r) => ({ ...r }))}
            />
          </DocBlock>

          <DocBlock
            label="Syntax"
            title="Operators"
            description="Arithmetic, comparison, equality, and assignment operators."
          >
            <DocTable
              columns={["Category", "Symbols", "Note"]}
              rows={OPERATORS.map((r) => ({
                category: r.category,
                symbols: r.symbols,
                note: r.note,
              }))}
            />
          </DocBlock>

          <article>
            <header className="mb-5">
              <p className="text-xs font-medium tracking-wide text-zaban-brand uppercase">
                Cookbook
              </p>
              <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-zaban-ink">
                Examples
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zaban-muted">
                Short programs with expected output — same layout as the playground.
              </p>
            </header>
            <div className="overflow-hidden rounded-2xl border border-zaban-border">
              {DOC_EXAMPLES.map((example) => (
                <CodeExample key={example.title} {...example} />
              ))}
            </div>
          </article>
        </div>
      </section>
    </Reveal>
  );
}
