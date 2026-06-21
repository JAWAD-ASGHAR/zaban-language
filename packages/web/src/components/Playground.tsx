import Editor from "react-simple-code-editor";
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { runSource, ZabanError } from "zaban-lang";
import { DEFAULT_CODE } from "../constants";
import { highlightZaban } from "../lib/zabanPrism";
import { Reveal } from "./Reveal";

type OutputKind = "empty" | "success" | "error";

const MIN_PANEL_HEIGHT = 280;
const EDITOR_PADDING = 16;

function PanelBar({
  label,
  hint,
}: {
  label: string;
  hint?: ReactNode;
}) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between border-b border-zaban-border px-4">
      <span className="text-xs font-medium tracking-wide text-zaban-muted uppercase">
        {label}
      </span>
      {hint ?? (
        <span
          aria-hidden
          className="hidden text-xs text-zaban-muted sm:inline sm:invisible"
        >
          ⌘ + Enter
        </span>
      )}
    </div>
  );
}

export function Playground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("Run your program to see output here.");
  const [outputKind, setOutputKind] = useState<OutputKind>("empty");
  const [status, setStatus] = useState<{ text: string; kind: "success" | "error" } | null>(
    null
  );
  const [panelHeight, setPanelHeight] = useState(MIN_PANEL_HEIGHT);
  const editorWrapRef = useRef<HTMLDivElement>(null);

  const syncPanelHeight = useCallback(() => {
    const textarea = editorWrapRef.current?.querySelector("textarea");
    if (!textarea) return;

    textarea.style.height = "0px";
    const next = Math.max(MIN_PANEL_HEIGHT, textarea.scrollHeight);
    textarea.style.height = `${next}px`;
    setPanelHeight(next);
  }, []);

  useLayoutEffect(() => {
    syncPanelHeight();
  }, [code, syncPanelHeight]);

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
    editorWrapRef.current?.querySelector("textarea")?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      run();
    }

    if (event.key === "Tab" && event.currentTarget instanceof HTMLTextAreaElement) {
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
            <p className="text-xs tracking-wide text-zaban-muted uppercase">
              Try it
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zaban-ink">
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
          <div className="playground-panels grid md:grid-cols-2">
            <div className="border-b border-zaban-border md:border-b-0 md:border-r">
              <PanelBar
                label="Code"
                hint={
                  <span className="hidden text-xs text-zaban-muted sm:inline">
                    ⌘ + Enter
                  </span>
                }
              />
              <div ref={editorWrapRef} className="playground-editor-wrap bg-white">
                <Editor
                  value={code}
                  onValueChange={setCode}
                  onKeyDown={handleKeyDown}
                  highlight={highlightZaban}
                  padding={EDITOR_PADDING}
                  textareaId="code"
                  textareaClassName="playground-textarea"
                  preClassName="playground-pre"
                  className="playground-editor"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 14,
                    lineHeight: 1.625,
                    minHeight: MIN_PANEL_HEIGHT,
                  }}
                />
              </div>
            </div>

            <div>
              <PanelBar label="Output" />
              <pre
                id="output"
                aria-live="polite"
                style={{ height: panelHeight }}
                className={`playground-output m-0 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words bg-zaban-surface p-4 font-mono text-sm leading-relaxed transition-colors duration-300 ${outputClass}`}
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
