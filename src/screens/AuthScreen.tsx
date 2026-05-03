import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/lib/auth";
import { FirebaseError } from "firebase/app";

type Mode = "signIn" | "signUp";

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googling, setGoogling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signIn") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName);
      }
      // onAuthStateChanged listener in App.tsx will route forward.
    } catch (err) {
      setError(humanizeAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setGoogling(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(humanizeAuthError(err));
    } finally {
      setGoogling(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-10 safe-x">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <img
          src="/icon-192.png"
          alt="Maverick Budget"
          className="size-20 rounded-3xl shadow-lg shadow-brand-500/30"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Maverick Budget</h1>
          <p className="mt-1 text-sm text-white/60">
            {mode === "signIn"
              ? "Sign in to your household."
              : "Create an account to get started."}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex w-full flex-col gap-3"
          noValidate
        >
          {mode === "signUp" ? (
            <Input
              label="Your name"
              name="displayName"
              type="text"
              autoComplete="name"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Jane Doe"
            />
          ) : null}

          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete={mode === "signIn" ? "current-password" : "new-password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            hint={mode === "signUp" ? "At least 6 characters." : undefined}
          />

          {error ? (
            <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">
              {error}
            </div>
          ) : null}

          <Button type="submit" loading={submitting} fullWidth>
            {mode === "signIn" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="flex w-full items-center gap-3 text-xs text-white/40">
          <div className="h-px flex-1 bg-white/10" />
          <span>or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <Button
          variant="secondary"
          fullWidth
          loading={googling}
          onClick={onGoogle}
          leadingIcon={<GoogleIcon />}
        >
          Continue with Google
        </Button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signIn" ? "signUp" : "signIn");
            setError(null);
          }}
          className="text-sm text-white/60 hover:text-white"
        >
          {mode === "signIn"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.5 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.6 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.5 29.1 4.5 24 4.5c-7.4 0-13.7 4.2-17.7 10.2z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.5c5 0 9.6-1.9 13-5l-6-5c-2 1.4-4.4 2.2-7 2.2-5.3 0-9.7-3-11.3-7.4l-6.5 5C9.5 39.1 16.2 43.5 24 43.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6 5C40.7 35.5 43.5 30.2 43.5 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function humanizeAuthError(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Email or password is incorrect.";
      case "auth/email-already-in-use":
        return "That email is already registered. Try signing in instead.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/invalid-email":
        return "That email address doesn't look right.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      default:
        return err.message;
    }
  }
  return err instanceof Error ? err.message : "Something went wrong.";
}
