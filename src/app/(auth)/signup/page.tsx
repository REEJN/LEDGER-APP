import Link from "next/link";
import { signUp } from "@/app/actions/auth";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm p-6 rounded-xl border shadow-xs" style={{ background: "var(--paper-raised)", borderColor: "var(--line)" }}>
        <div className="mb-6 text-center">
          <div className="inline-block w-10 h-10 rounded-full mb-3" style={{ background: "var(--gold)" }} />
          <h1 className="font-display text-3xl" style={{ color: "var(--ink)" }}>Create your workspace</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>Notes, tasks, and files in one place</p>
        </div>

        <form action={signUp} className="space-y-4">
          <div>
            <label className="block type-eyebrow mb-1.5" style={{ color: "var(--ink-soft)" }}>Full name</label>
            <input
              name="fullName"
              type="text"
              className="w-full px-3 py-2 rounded-md border bg-transparent outline-none transition focus-ring"
              style={{ borderColor: "var(--line)" }}
            />
          </div>
          <div>
            <label className="block type-eyebrow mb-1.5" style={{ color: "var(--ink-soft)" }}>Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 rounded-md border bg-transparent outline-none transition focus-ring"
              style={{ borderColor: "var(--line)" }}
            />
          </div>
          <div>
            <label className="block type-eyebrow mb-1.5" style={{ color: "var(--ink-soft)" }}>Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-3 py-2 rounded-md border bg-transparent outline-none transition focus-ring"
              style={{ borderColor: "var(--line)" }}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-md font-medium transition hover:opacity-90 focus-ring cursor-pointer"
            style={{ background: "var(--plum)", color: "var(--on-plum)" }}
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-sm text-center" style={{ color: "var(--ink-soft)" }}>
          Already have an account?{" "}
          <Link href="/login" className="underline hover:opacity-80" style={{ color: "var(--plum)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
