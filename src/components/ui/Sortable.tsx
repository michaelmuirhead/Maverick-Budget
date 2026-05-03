import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, type ReactNode } from "react";

interface Props<T extends { id: string }> {
  items: T[];
  /** Called with the new order. Persist asynchronously. */
  onReorder: (orderedIds: string[]) => Promise<void> | void;
  /**
   * Render each row. Pass `dragHandleProps` to whatever element should be the
   * drag handle (an icon, a row, etc.).
   */
  children: (
    item: T,
    helpers: {
      ref: (node: HTMLElement | null) => void;
      style: React.CSSProperties;
      dragHandleProps: React.HTMLAttributes<HTMLElement>;
      isDragging: boolean;
    },
  ) => ReactNode;
}

/**
 * Generic sortable list. Activation distance keeps tap-to-edit working —
 * a drag only starts after a few px of movement.
 */
export function Sortable<T extends { id: string }>({ items, onReorder, children }: Props<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
  );

  // Local optimistic order so the UI moves immediately on drop while the
  // Firestore write is in flight. We re-sync from `items` after the write.
  const [optimistic, setOptimistic] = useState<string[] | null>(null);
  const orderedIds = optimistic ?? items.map((i) => i.id);
  const ordered = orderedIds
    .map((id) => items.find((i) => i.id === id))
    .filter((x): x is T => Boolean(x));

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedIds.indexOf(String(active.id));
    const newIndex = orderedIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(orderedIds, oldIndex, newIndex);
    setOptimistic(next);
    void Promise.resolve(onReorder(next)).finally(() => setOptimistic(null));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
        {ordered.map((item) => (
          <SortableRow key={item.id} id={item.id}>
            {(helpers) => children(item, helpers)}
          </SortableRow>
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: (helpers: {
    ref: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
    dragHandleProps: React.HTMLAttributes<HTMLElement>;
    isDragging: boolean;
  }) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.85 : undefined,
  };
  return (
    <>
      {children({
        ref: setNodeRef,
        style,
        dragHandleProps: { ...attributes, ...listeners },
        isDragging,
      })}
    </>
  );
}

/** Simple visual drag handle (six dots). Spread `dragHandleProps` onto it. */
export function DragHandle(
  props: React.HTMLAttributes<HTMLButtonElement> & { label?: string },
) {
  const { label = "Reorder", className = "", ...rest } = props;
  return (
    <button
      type="button"
      aria-label={label}
      className={[
        "shrink-0 cursor-grab touch-none rounded p-1 text-white/30 hover:text-white/60 active:cursor-grabbing",
        className,
      ].join(" ")}
      {...rest}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="9" cy="6" r="1.5" />
        <circle cx="15" cy="6" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="18" r="1.5" />
        <circle cx="15" cy="18" r="1.5" />
      </svg>
    </button>
  );
}
