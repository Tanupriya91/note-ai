
"use client";

import { useState } from "react";

const SAMPLE_NOTES = `An API (Application Programming Interface) allows different software applications to communicate with each other.

APIs define a set of rules and protocols that applications can use to request and exchange data. REST APIs commonly use HTTP methods such as GET, POST, PUT, and DELETE.

For example, a frontend application can send a GET request to a backend API to retrieve user information. The backend processes the request and returns a response, usually in JSON format.

APIs are widely used in web applications, mobile applications, payment systems, and third-party integrations.`;

type SummaryResult = {
  summary: string[];
  keywords: { term: string; meaning: string }[];
  simpleExplanation: string;
};

export default function Home() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const wordCount = notes.trim()
    ? notes.trim().split(/\s+/).length
    : 0;

  const characterCount = notes.length;

  const handleClear = () => {
    setNotes("");
    setResult(null);
    setError("");
    setCopied("");
  };

  const handleSampleNotes = () => {
    setNotes(SAMPLE_NOTES);
    setResult(null);
    setError("");
    setCopied("");
  };

  const handleSummarize = async () => {
    if (!notes.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setError("");
    setCopied("");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to summarize your notes. Please try again."
        );
      }

      if (
        !Array.isArray(data.summary) ||
        !Array.isArray(data.keywords) ||
        typeof data.simpleExplanation !== "string"
      ) {
        throw new Error("The AI returned an unexpected response format.");
      }

      setResult(data as SummaryResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
    } catch {
      setError("Could not copy to clipboard. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#fafaf9] text-stone-800">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-stone-200 bg-white px-5 py-6 md:flex md:flex-col">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-lg text-white">
              N
            </span>
            <span className="text-base font-semibold tracking-tight">
              NoteMind
            </span>
          </a>

          <div className="mt-10">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
              Workspace
            </p>
            <a
              href="/"
              aria-current="page"
              className="flex items-center gap-3 rounded-xl bg-stone-100 px-3 py-2.5 text-sm font-medium text-stone-900"
            >
              <span>⌂</span>
              Home
            </a>
            <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-stone-400">
              <span>◷</span>
              History
              <span className="ml-auto text-[10px]">Soon</span>
            </div>
            <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-stone-400">
              <span>▤</span>
              Study sets
              <span className="ml-auto text-[10px]">Soon</span>
            </div>
          </div>

          <div className="mt-auto rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
              ✦
            </div>
            <p className="text-sm font-semibold">A clearer way to learn</p>
            <p className="mt-1 text-xs leading-5 text-stone-500">
              Turn your notes into summaries and explanations you can
              understand.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex h-[65px] items-center justify-between border-b border-stone-200 bg-white/80 px-5 sm:px-8">
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <span className="md:hidden font-semibold text-stone-900">
                NoteMind
              </span>
              <span className="hidden md:inline">Workspace</span>
              <span className="hidden md:inline">/</span>
              <span className="hidden md:inline text-stone-900">Summarizer</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              AI workspace
            </div>
          </header>

          <div className="mx-auto w-full max-w-5xl px-5 py-9 sm:px-8 sm:py-12">
            <section className="mb-9">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                YOUR PERSONAL LEARNING SPACE
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Think clearly. Learn faster.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base">
                Turn long and messy notes into useful summaries, important
                keywords, and simple explanations.
              </p>
            </section>

            <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-sm font-semibold text-stone-900">
                    Your notes
                  </h2>
                  <p className="mt-1 text-xs text-stone-500">
                    Paste your notes or start with a sample.
                  </p>
                </div>
                <button
                  onClick={handleSampleNotes}
                  type="button"
                  disabled={isLoading}
                  className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-50 disabled:opacity-40"
                >
                  Try sample notes
                </button>
              </div>

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Start writing or paste your notes here..."
                maxLength={20000}
                aria-label="Your notes"
                className="min-h-[260px] w-full resize-y bg-white px-5 py-5 text-sm leading-7 text-stone-800 outline-none placeholder:text-stone-400 focus:bg-stone-50/40 sm:px-6"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 px-5 py-3 sm:px-6">
                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span>{wordCount} words</span>
                  <span className="text-stone-300">·</span>
                  <span>{characterCount.toLocaleString()} / 20,000 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClear}
                    type="button"
                    disabled={(!notes && !result && !error) || isLoading}
                    className="rounded-lg px-3 py-2 text-xs font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSummarize}
                    type="button"
                    disabled={!notes.trim() || isLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-stone-500 border-t-white" />
                        Working...
                      </>
                    ) : (
                      <>✦ Summarize notes</>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {isLoading && (
              <section
                role="status"
                className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 text-center"
              >
                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-stone-200 border-t-stone-800" />
                <p className="text-sm font-medium text-stone-800">
                  Organizing your notes
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  Creating your summary, keywords, and explanation...
                </p>
              </section>
            )}

            {error && !isLoading && (
              <section
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5"
              >
                <h2 className="text-sm font-semibold text-red-800">
                  Unable to summarize notes
                </h2>
                <p className="mt-2 text-sm leading-6 text-red-700">{error}</p>
              </section>
            )}

            {result && !isLoading && (
              <section className="mt-8 space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                      YOUR RESULTS
                    </p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">
                      Notes, made clearer.
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        [
                          "SUMMARY",
                          ...result.summary.map((point) => `• ${point}`),
                          "",
                          "IMPORTANT KEYWORDS",
                          ...result.keywords.map(
                            ({ term, meaning }) => `${term}: ${meaning}`
                          ),
                          "",
                          "SIMPLE EXPLANATION",
                          result.simpleExplanation,
                        ].join("\n")
                      , "all")}
                    className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
                  >
                    {copied === "all" ? "Copied all results!" : "Copy all results"}
                  </button>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                          ≡
                        </span>
                        <div>
                          <h3 className="text-sm font-semibold text-stone-900">
                            Summary
                          </h3>
                          <p className="mt-0.5 text-xs text-stone-500">
                            The key takeaways
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(result.summary.join("\n"), "summary")
                        }
                        className="text-xs font-medium text-stone-500 hover:text-stone-900"
                      >
                        {copied === "summary" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <ul className="space-y-3 text-sm leading-6 text-stone-600">
                      {result.summary.map((point, index) => (
                        <li key={`${index}-${point}`} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                          ◈
                        </span>
                        <div>
                          <h3 className="text-sm font-semibold text-stone-900">
                            Important keywords
                          </h3>
                          <p className="mt-0.5 text-xs text-stone-500">
                            Terms worth remembering
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            result.keywords
                              .map(({ term, meaning }) => `${term}: ${meaning}`)
                              .join("\n"),
                            "keywords"
                          )
                        }
                        className="text-xs font-medium text-stone-500 hover:text-stone-900"
                      >
                        {copied === "keywords" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="space-y-4">
                      {result.keywords.map(({ term, meaning }, index) => (
                        <div key={`${index}-${term}`}>
                          <h4 className="text-sm font-semibold text-stone-800">
                            {term}
                          </h4>
                          <p className="mt-1 text-sm leading-6 text-stone-500">
                            {meaning}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        ☼
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-stone-900">
                          Simple explanation
                        </h3>
                        <p className="mt-0.5 text-xs text-stone-500">
                          Understand the bigger picture
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(result.simpleExplanation, "explanation")
                      }
                      className="text-xs font-medium text-stone-500 hover:text-stone-900"
                    >
                      {copied === "explanation" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-stone-600">
                    {result.simpleExplanation}
                  </p>
                </section>
              </section>
            )}

            {!result && !error && !isLoading && (
              <section className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-10 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white text-lg text-stone-500">
                  ✦
                </div>
                <h2 className="mt-4 text-sm font-semibold text-stone-800">
                  Your results will appear here
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-500">
                  Add your notes above and let AI turn them into clear,
                  organized learning material.
                </p>
              </section>
            )}

            <footer className="mt-10 border-t border-stone-200 py-5 text-center text-xs text-stone-400">
              Made for clearer thinking and better learning.
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
