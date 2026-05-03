import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "@/lib/session";
import {
  GroupNotEmptyError,
  deleteCategoryGroup,
  updateCategoryGroup,
} from "@/lib/categories";
import type { CategoryGroupDoc } from "@/types/schema";

interface Props {
  group: CategoryGroupDoc;
  onDone: () => void;
}

export function EditGroupForm({ group, onDone }: Props) {
  const { household } = useSession();
  const [name, setName] = useState(group.name);
  const [hidden, setHidden] = useState(group.hidden);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Group needs a name.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await updateCategoryGroup(household.id, group.id, { name, hidden });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save group.");
      setSaving(false);
    }
  }

  async function onDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteCategoryGroup(household.id, group.id);
      onDone();
    } catch (err) {
      if (err instanceof GroupNotEmptyError) setError(err.message);
      else setError(err instanceof Error ? err.message : "Couldn't delete group.");
      setDeleting(false);
      setConfirmingDelete(false);
    }
  }

  const busy = saving || deleting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="Group name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <ToggleRow
        label="Hide from budget"
        description="Hidden groups still keep their categories' history."
        checked={hidden}
        onChange={setHidden}
      />
      {error ? (
        <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">
          {error}
        </div>
      ) : null}
      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onDone} disabled={busy}>
          Cancel
        </Button>
        <Button type="submit" loading={saving} fullWidth>
          Save
        </Button>
      </div>
      <div className="border-t border-white/5 pt-4">
        {confirmingDelete ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-white/60">
              Delete this group? Only works if it has no categories.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
              >
                Keep it
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={onDelete}
                loading={deleting}
                fullWidth
              >
                Delete group
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setConfirmingDelete(true)}
            disabled={busy}
            className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
          >
            Delete group
          </Button>
        )}
      </div>
    </form>
  );
}

export function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3 text-left ring-1 ring-white/10 hover:bg-white/10"
    >
      <div className="flex flex-col">
        <span className="text-sm">{label}</span>
        {description ? (
          <span className="text-xs text-white/40">{description}</span>
        ) : null}
      </div>
      <span
        className={[
          "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-brand-500" : "bg-white/15",
        ].join(" ")}
        aria-checked={checked}
        role="switch"
      >
        <span
          className={[
            "inline-block size-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-[2px]",
          ].join(" ")}
        />
      </span>
    </button>
  );
}
