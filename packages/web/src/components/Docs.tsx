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
          <tr className="border-b border-zaban-border text-left text-xs text-zaban-muted">
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-zaban-border transition-colors last:border-0 hover:bg-zaban-surface"
            >
              {columns.map((col) => {
                const key = col.toLowerCase() as keyof DocRow;
                const value = row[key] ?? "";
                return (
                  <td key={col} className="px-4 py-3.5 text-zaban-muted">
                    {col === "Urdu" || col === "Symbols" ? (
                      <code>{value}</code>
                    ) : (
                      value
                    )}
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
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-zaban-ink">{title}</h3>
      <div className="mt-4 overflow-hidden rounded-xl border border-zaban-border">
        {children}
      </div>
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
      <div className="border-b border-zaban-border bg-zaban-surface px-4 py-3">
        <p className="font-medium text-zaban-ink">{title}</p>
        <p className="mt-0.5 text-sm text-zaban-muted">{description}</p>
      </div>
      <pre className="overflow-x-auto bg-white p-4 font-mono text-sm leading-relaxed text-zaban-ink">
        <code>{code}</code>
      </pre>
      <div className="border-t border-zaban-border bg-zaban-surface px-4 py-3">
        <p className="text-xs font-medium text-zaban-muted">Output</p>
        <pre className="mt-2 overflow-x-auto font-mono text-sm leading-relaxed text-zaban-success">
          <code>{output}</code>
        </pre>
      </div>
    </div>
  );
}

export function Docs() {
  return (
    <Reveal delay={80}>
      <section id="docs" className="scroll-mt-20 border-t border-zaban-border pb-32 pt-24">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-zaban-ink">
            Language reference
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zaban-muted">
            Zaban is a dynamically typed language with Roman Urdu keywords.
            Install the package, write a <code>.zbn</code> file, and run it from
            the terminal or import it as a library.
          </p>
        </div>

        <div className="space-y-10">
          <DocBlock title="Install">
            <div className="space-y-4 bg-white p-4 text-sm text-zaban-muted">
              <div>
                <p className="mb-2 font-medium text-zaban-ink">
                  npm —{" "}
                  <a
                    href={NPM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zaban-keyword hover:underline"
                  >
                    zaban-lang
                  </a>
                </p>
                <code className="block rounded-lg border border-zaban-border bg-zaban-surface px-4 py-3 font-mono text-zaban-ink">
                  {NPM_INSTALL}
                </code>
              </div>
              <div>
                <p className="mb-2 font-medium text-zaban-ink">CLI</p>
                <code className="block rounded-lg border border-zaban-border bg-zaban-surface px-4 py-3 font-mono text-zaban-ink">
                  npx zaban run program.zbn
                </code>
              </div>
              <div>
                <p className="mb-2 font-medium text-zaban-ink">Library</p>
                <pre className="overflow-x-auto rounded-lg border border-zaban-border bg-zaban-surface p-4 font-mono text-xs leading-relaxed text-zaban-ink">
                  <code>{`import { runSource } from "zaban-lang";

const lines = runSource(\`
  shuru
    likho "Salam"
  khatam
\`);
console.log(lines.join("\\n"));`}</code>
                </pre>
              </div>
            </div>
          </DocBlock>

          <DocBlock title="Notes">
            <ul className="list-disc space-y-2 bg-white px-6 py-4 text-sm text-zaban-muted">
              {DOC_NOTES.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </DocBlock>

          <DocBlock title="Program structure">
            <DocTable
              columns={["Urdu", "English", "Usage"]}
              rows={PROGRAM_STRUCTURE.map((r) => ({ ...r }))}
            />
          </DocBlock>

          <DocBlock title="Statements">
            <DocTable
              columns={["Urdu", "English", "Usage"]}
              rows={STATEMENTS.map((r) => ({ ...r }))}
            />
          </DocBlock>

          <DocBlock title="Literals">
            <DocTable
              columns={["Urdu", "English", "Usage"]}
              rows={LITERALS.map((r) => ({ ...r }))}
            />
          </DocBlock>

          <DocBlock title="Operators">
            <DocTable
              columns={["Category", "Symbols", "Note"]}
              rows={OPERATORS.map((r) => ({
                category: r.category,
                symbols: r.symbols,
                note: r.note,
              }))}
            />
          </DocBlock>

          <div>
            <h3 className="text-base font-medium text-zaban-ink">Examples</h3>
            <div className="mt-4 overflow-hidden rounded-xl border border-zaban-border">
              {DOC_EXAMPLES.map((example) => (
                <CodeExample key={example.title} {...example} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
