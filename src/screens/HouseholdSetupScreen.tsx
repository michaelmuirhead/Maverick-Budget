import { useState, type FormEvent } from "react";
import type { User } from "firebase/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signOutCurrentUser } from "@/lib/auth";
import {
  AlreadyMemberError,
  JoinCodeNotFoundError,
  createHousehold,
  joinHouseholdByCode,
} from "@/lib/household";

type Mode = "choose" | "create" | "join";

interface Props {
  user: User;
}

export function HouseholdSetupScreen({ user }: Props) {
  const [mode, setMode] = useState<Mode>("choose");

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-10 safe-x">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <img
          src="/icon-192.png"
          alt="Maverick Budget"
          className="size-16 rounded-2xl shadow-lg shadow-brand-500/30"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "choose" && "Set up your household"}
            {mode === "create" && "Create a household"}
            {mode === "join" && "Join a household"}
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {mode === "choose" && "Households let you share a budget with your spouse."}
            {mode === "create" && "You'll get a join code to share."}
            {mode === "join" && "Ask the household owner for the 6-character code."}
          </p>
        </div>

        {mode === "choose" && <ChooseMode onPick={setMode} />}
        {mode === "create" && (
          <CreateForm user={user} onCancel={() => setMode("choose")} />
        )}
        {mode === "join" && (
          <JoinForm user={user} onCancel={() => setMode("choose")} />
        )}

        <div className="mt-2 flex flex-col items-center gap-1 text-xs text-white/40">
          <div>
            Signed in as <span className="text-white/60">{user.email ?? user.uid}</span>
          </div>
          <button
            type="button"
            onClick={() => void signOutCurrentUser()}
            className="text-white/50 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function ChooseMode({ onPick }: { onPick: (m: Mode) => void }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <Button onClick={() => onPick("create")} fullWidth>
        Create new household
      </Button>
      <Button variant="secondary" onClick={() => onPick("join")} fullWidth>
        Join with a code
      </Button>
    </div>
  );
}

function CreateForm({ user, onCancel }: { user: User; onCancel: () => void }) {
  const [name, setName] = useState(defaultHouseholdName(user));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Give your household a name.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await createHousehold({
        name,
        ownerUid: user.uid,
        ownerDisplayName: user.displayName,
        ownerEmail: user.email,
        ownerPhotoURL: user.photoURL,
      });
      // App.tsx watches users/{uid}.activeHouseholdId and routes forward.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
      <Input
        label="Household name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="The Doe Family"
        autoFocus
      />
      {error ? (
        <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">
          {error}
        </div>
      ) : null}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          Back
        </Button>
        <Button type="submit" loading={submitting} fullWidth>
          Create
        </Button>
      </div>
    </form>
  );
}

function JoinForm({ user, onCancel }: { user: User; onCancel: () => void }) {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await joinHouseholdByCode({
        code,
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    } catch (err) {
      if (err instanceof JoinCodeNotFoundError) setError(err.message);
      else if (err instanceof AlreadyMemberError) setError(err.message);
      else setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
      <Input
        label="Join code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="ABC234"
        maxLength={6}
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        autoFocus
        className="text-center text-xl font-mono tracking-[0.4em]"
        hint="Six characters, letters and numbers."
      />
      {error ? (
        <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">
          {error}
        </div>
      ) : null}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          Back
        </Button>
        <Button type="submit" loading={submitting} fullWidth>
          Join
        </Button>
      </div>
    </form>
  );
}

function defaultHouseholdName(user: User): string {
  const name = user.displayName?.split(" ").slice(-1)[0];
  return name ? `The ${name} Household` : "My Household";
}
