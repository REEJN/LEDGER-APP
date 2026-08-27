import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-14 h-14 rounded-full mb-6" style={{ background: "var(--plum)" }} />
      <h1 className="font-display text-4xl sm:text-5xl mb-4" style={{ color: "var(--ink)" }}>Ledger</h1>
      <p className="max-w-md mb-8 text-base sm:text-lg" style={{ color: "var(--ink-soft)" }}>
        Notes, to-do lists, and your personal files — one quiet workspace.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
        <Link
          href="/signup"
          className="px-5 py-2.5 rounded-md font-medium transition hover:opacity-90 focus-ring text-center"
          style={{ background: "var(--plum)", color: "var(--on-plum)" }}
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="px-5 py-2.5 rounded-md font-medium border transition hover:bg-[var(--hover)] focus-ring text-center"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
