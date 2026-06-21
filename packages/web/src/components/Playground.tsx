import { useCallback, useRef, useState } from "react";
import { runSource, ZabanError } from "zaban-lang";
import { DEFAULT_CODE } from "../constants";
import { Reveal } from "./Reveal";

type OutputKind = "empty" | "success" | "error";

export function Playground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("Run your program to see output here.");
  const [outputKind, setOutputKind] = useState<OutputKind>("empty");
  const [status, setStatus] = useState<{ text: string; kind: "success" | "error" } | null>(
    null
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const run = useCallback(() => {
    if (!code.trim()) {
      setOutput("Write some Zaban code first.");
      setOutputKind("empty");
      setStatus(null);
      return;
    }

    try {
      const lines = runSource(code);
      setOutput(lines.length > 0 ? lines.join("\n") : "(no output)");
      setOutputKind("success");
      setStatus({ text: "Zabardast!", kind: "success" });
    } catch (error) {
      if (error instanceof ZabanError) {
        setOutput(error.message);
        setStatus({ text: "Program mein masla hai.", kind: "error" });
      } else {
        setOutput(String(error));
        setStatus({ text: "Unexpected error.", kind: "error" });
      }
      setOutputKind("error");
    }
  }, [code]);

  const clear = useCallback(() => {
    setCode("");
    setOutput("Run your program to see output here.");
    setOutputKind("empty");
    setStatus(null);
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      run();
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const el = event.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = `${code.slice(0, start)}  ${code.slice(end)}`;
      setCode(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  };

  const outputClass =
    outputKind === "success"
      ? "text-zaban-success"
      : outputKind === "error"
        ? "text-zaban-error"
        : "text-zaban-muted";

  return (
    <Reveal>
      <section id="playground" className="scroll-mt-20 pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zaban-ink">
              Playground
            </h2>
            <p className="mt-1 text-sm text-zaban-muted">
              Write and run Zaban in your browser
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={run} className="btn-primary">
              Run
            </button>
            <button type="button" onClick={clear} className="btn-secondary">
              Clear
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zaban-border">
          <div className="grid md:grid-cols-2">
            <div className="border-b border-zaban-border md:border-b-0 md:border-r">
              <div className="flex items-center justify-between border-b border-zaban-border px-4 py-2.5">
                <label
                  htmlFor="code"
                  className="text-xs font-medium text-zaban-muted"
                >
                  Code
                </label>
                <span className="hidden text-xs text-zaban-muted sm:inline">
                  ⌘ + Enter
                </span>
              </div>
              <textarea
                ref={textareaRef}
                id="code"
                spellCheck={false}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[280px] w-full resize-y bg-white p-4 font-mono text-sm leading-relaxed text-zaban-ink outline-none transition-colors focus:bg-zaban-surface"
              />
            </div>

            <div>
              <div className="border-b border-zaban-border px-4 py-2.5">
                <label
                  htmlFor="output"
                  className="text-xs font-medium text-zaban-muted"
                >
                  Output
                </label>
              </div>
              <pre
                id="output"
                aria-live="polite"
                className={`min-h-[280px] overflow-auto whitespace-pre-wrap break-words bg-zaban-surface p-4 font-mono text-sm leading-relaxed transition-colors duration-300 ${outputClass}`}
              >
                {output}
              </pre>
            </div>
          </div>
        </div>

        {status && (
          <p
            className={`mt-4 text-sm font-medium transition-opacity duration-300 ${status.kind === "success" ? "text-zaban-success" : "text-zaban-error"}`}
            role="status"
          >
            {status.text}
          </p>
        )}
      </section>
    </Reveal>
  );
}
