"use client";

import { useState } from "react";

const SAMPLE_NOTES = `An API (Application Programming Interface) allows different software applications to communicate with each other.

APIs define a set of rules and protocols that applications can use to request and exchange data. REST APIs commonly use HTTP methods such as GET, POST, PUT, and DELETE.

For example, a frontend application can send a GET request to a backend API to retrieve user information. The backend processes the request and returns a response, usually in JSON format.

APIs are widely used in web applications, mobile applications, payment systems, and third-party integrations.`;

export default function Home() {
  const [notes, setNotes] = useState("");

  const wordCount = notes.trim()
    ? notes.trim().split(/\s+/).length
    : 0;

  const characterCount = notes.length;

  const handleClear = () => {
    setNotes("");
  };

  const handleSampleNotes = () => {
    setNotes(SAMPLE_NOTES);
  };

  const handleSummarize = () => {
    console.log("Summarize:", notes);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-12">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
            AI-Powered Notes
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            AI Notes Summarizer
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Turn long and messy notes into clean summaries, important
            keywords, and beginner-friendly explanations.
          </p>
        </header>

        {/* Input Card */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:p-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Your Notes</h2>
              <p className="mt-1 text-sm text-slate-400">
                Paste your notes below and let AI organize them.
              </p>
            </div>

            <span className="hidden rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-400 sm:block">
              {wordCount} words
            </span>
          </div>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Paste your notes here..."
            className="min-h-[300px] w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-7 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-slate-500"
          />

          {/* Stats */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>{characterCount} characters</span>
            <span>{wordCount} words</span>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <div className="flex gap-3">
              <button
                onClick={handleSampleNotes}
                type="button"
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Sample Notes
              </button>

              <button
                onClick={handleClear}
                type="button"
                disabled={!notes}
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear
              </button>
            </div>

            <button
              onClick={handleSummarize}
              type="button"
              disabled={!notes.trim()}
              className="rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Summarize Notes
            </button>
          </div>
        </section>

        {/* Empty Result State */}
        <section className="mt-8 rounded-2xl border border-dashed border-slate-800 p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-xl">
            ✨
          </div>

          <h2 className="font-semibold text-slate-200">
            Your summary will appear here
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Add your notes above and click &quot;Summarize Notes&quot; to
            generate an AI-powered summary.
          </p>
        </section>
      </div>
    </main>
  );
}