import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "@/lib/session";
import {
  CategoryInUseError,
  deleteCategory,
  updateCategory,
} from "@/lib/categories";
import { ToggleRow } from "./EditGroupForm";
import type { CategoryDoc } from "@/types/schema";

interface Props {
  category: CategoryDoc;
  onDone: () => void;
}

export function EditCategoryForm({ category, onDone }: Props) {
  const { household } = useSession();
  const [name, setName] = useState(category.name);
  const [hidden, setHidden] = useState(category.hidden);
  const [note, setNote] = useState(category.note ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category needs a name.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await updateCategory(household.id, category.id, {
        name,
        hidden,
        note: note.trim() || null,
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save category.");
      setSaving(false);
    }
  }

  async function onDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteCategory(household.id, category.id);
      onDone();
    } catch (err) {
      if (err instanceof CategoryInUseError) setError(err.message);
      else setError(err instanceof Error ? err.message : "Couldn't delete category.");
      setDeleting(false);
      setConfirmingDelete(false);
    }
  }

  const busy = saving || deleting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <Input
        label="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional"
      />
      <ToggleRow
        label="Hide from budget"
        description="History is preserved; the row just stops showing."
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
              Delete this category? Only works if no transactions reference it.
              Otherwise, hide it instead.
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
                Delete category
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
            Delete category
          </Button>
        )}
      </div>
    </form>
  );
}
