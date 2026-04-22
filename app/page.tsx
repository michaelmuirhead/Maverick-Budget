"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { listSlots, MAX_SLOTS, type SlotMeta } from "@/store/persistence";
import { STARTING_ERA_PRESETS } from "@/engine";
import { formatDate, formatMoney } from "@/lib/format";

type Archetype = "programmer" | "designer" | "artist";

// Cartoon emoji for each archetype — reinforces the Saturday-morning aesthetic.
const ARCHETYPE_EMOJI: Record<Archetype, string> = {
  programmer: "💻",
  designer: "✏️",
  artist: "🎨",
};

export default function HomePage() {
  const router = useRouter();
  const newGame = useGameStore((s) => s.newGame);
  const loadSlot = useGameStore((s) => s.loadSlot);
  const deleteSave = useGameStore((s) => s.deleteSave);
  const renameSave = useGameStore((s) => s.renameSave);

  // Slots list (re-fetched after any mutation)
  const [slots, setSlots] = useState<SlotMeta[]>([]);
  const refreshSlots = () => setSlots(listSlots());

  // New game form state
  const [showNewGame, setShowNewGame] = useState(false);
  const [studioName, setStudioName] = useState("Maverick Softworks");
  const [founderName, setFounderName] = useState("Michael Muirhead");
  const [founderArchetype, setFounderArchetype] = useState<Archetype>("designer");
  const [founderCity, setFounderCity] = useState("Jackson, MS");
  const [presetId, setPresetId] = useState("start_1995");
  const [slotLabel, setSlotLabel] = useState("");

  // Slot ops state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    refreshSlots();

    // Suppress the calmer in-game idle backdrop and paint the start
    // screen's louder backdrop (spinning rays, wobbling cartridges,
    // idle-jiggling CTA). Reverted on unmount so in-game screens return
    // to motion level 2 (idle on decorative, hover-only on interactive).
    document.body.classList.add("cartoon-mode");
    return () => {
      document.body.classList.remove("cartoon-mode");
    };
  }, []);

  const handleLoad = (slotId: string, kind: "manual" | "auto" = "manual") => {
    if (loadSlot(slotId, kind)) router.push("/dashboard");
  };

  const handleNewGame = () => {
    newGame(
      {
        studioName,
        founderName,
        founderArchetype,
        founderCity,
        startingPresetId: presetId,
      },
      slotLabel || studioName,
    );
    router.push("/dashboard");
  };

  const handleRenameSave = (slotId: string) => {
    if (renameDraft.trim()) {
      renameSave(slotId, renameDraft.trim());
      refreshSlots();
    }
    setRenamingId(null);
    setRenameDraft("");
  };

  const handleDelete = (slotId: string) => {
    deleteSave(slotId);
    setConfirmingDeleteId(null);
    refreshSlots();
  };

  const currentPreset = STARTING_ERA_PRESETS.find((p) => p.id === presetId);
  const atSlotCap = slots.length >= MAX_SLOTS;

  return (
    <div className="cartoon-screen">
      {/* ---- animated backdrop (decorative only) ---- */}
      <div className="rays" aria-hidden="true" />
      <div className="blob blob-teal" aria-hidden="true" />
      <div className="blob blob-pink" aria-hidden="true" />
      <div className="blob blob-purple" aria-hidden="true" />
      <div className="star star-a" aria-hidden="true">★</div>
      <div className="star star-b" aria-hidden="true">✦</div>
      <div className="star star-c" aria-hidden="true">★</div>
      <div className="star star-d" aria-hidden="true">✦</div>
      <div className="star star-e" aria-hidden="true">★</div>
      <div className="star star-f" aria-hidden="true">✦</div>
      <div className="cart cart-1" aria-hidden="true" />
      <div className="cart cart-2" aria-hidden="true" />
      <div className="cart cart-3" aria-hidden="true" />

      {/* ---- centered content stack ---- */}
      <div className="cartoon-stack">
        <h1 className="cartoon-logo">
          MAVERICK
          <span className="cartoon-logo-two">GAME TYCOON</span>
        </h1>

        <div className="cartoon-tagline">
          <span>Build your studio · Ship the classics</span>
        </div>

        {!showNewGame ? (
          <div className="cartoon-menu">
            {slots.length > 0 && (
              <div className="cartoon-slots">
                <div className="cartoon-slots-title">SAVED GAMES</div>
                {slots.map((slot) => {
                  const autoNewer =
                    slot.autoSavedAt &&
                    (!slot.manualSavedAt ||
                      Date.parse(slot.autoSavedAt) > Date.parse(slot.manualSavedAt));
                  const isRenaming = renamingId === slot.id;
                  const isConfirmingDelete = confirmingDeleteId === slot.id;
                  return (
                    <div key={slot.id} className="cartoon-slot">
                      <div className="cartoon-slot-main">
                        {isRenaming ? (
                          <input
                            className="cartoon-input cartoon-slot-rename"
                            value={renameDraft}
                            autoFocus
                            onChange={(e) => setRenameDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRenameSave(slot.id);
                              if (e.key === "Escape") {
                                setRenamingId(null);
                                setRenameDraft("");
                              }
                            }}
                          />
                        ) : (
                          <div
                            className="cartoon-slot-label"
                            onClick={() => handleLoad(slot.id)}
                          >
                            {slot.label}
                          </div>
                        )}
                        <div className="cartoon-slot-meta">
                          {slot.studioName} · {formatDate(slot.gameDate)} ·{" "}
                          {formatMoney(slot.cash)}
                        </div>
                        {autoNewer && (
                          <div className="cartoon-slot-autohint">
                            Autosave is newer (
                            {slot.autoSavedAt
                              ? new Date(slot.autoSavedAt).toLocaleString()
                              : "—"}
                            )
                          </div>
                        )}
                      </div>
                      <div className="cartoon-slot-actions">
                        {isConfirmingDelete ? (
                          <>
                            <button
                              className="cartoon-chip cartoon-chip-danger"
                              onClick={() => handleDelete(slot.id)}
                            >
                              CONFIRM DELETE
                            </button>
                            <button
                              className="cartoon-chip"
                              onClick={() => setConfirmingDeleteId(null)}
                            >
                              CANCEL
                            </button>
                          </>
                        ) : isRenaming ? (
                          <>
                            <button
                              className="cartoon-chip"
                              onClick={() => handleRenameSave(slot.id)}
                            >
                              SAVE
                            </button>
                            <button
                              className="cartoon-chip"
                              onClick={() => {
                                setRenamingId(null);
                                setRenameDraft("");
                              }}
                            >
                              CANCEL
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="cartoon-chip cartoon-chip-primary"
                              onClick={() => handleLoad(slot.id)}
                            >
                              ▶ LOAD
                            </button>
                            {autoNewer && (
                              <button
                                className="cartoon-chip"
                                onClick={() => handleLoad(slot.id, "auto")}
                                title="Load the autosave instead of the manual save"
                              >
                                ↻ AUTO
                              </button>
                            )}
                            <button
                              className="cartoon-chip"
                              onClick={() => {
                                setRenamingId(slot.id);
                                setRenameDraft(slot.label);
                              }}
                            >
                              RENAME
                            </button>
                            <button
                              className="cartoon-chip"
                              onClick={() => setConfirmingDeleteId(slot.id)}
                            >
                              DELETE
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              className={`cartoon-btn ${slots.length === 0 ? "cartoon-btn-primary" : ""}`}
              onClick={() => {
                if (atSlotCap) return;
                setSlotLabel("");
                setShowNewGame(true);
              }}
              disabled={atSlotCap}
              title={
                atSlotCap
                  ? `Save slots full (${MAX_SLOTS}). Delete one first.`
                  : undefined
              }
            >
              <span className="cartoon-btn-label">+ NEW GAME</span>
              <span className="cartoon-btn-sub">
                {atSlotCap
                  ? `All ${MAX_SLOTS} slots used — delete one first`
                  : `Start a new studio (${slots.length}/${MAX_SLOTS} slots)`}
              </span>
            </button>
          </div>
        ) : (
          <div className="cartoon-form">
            <div className="cartoon-form-title">NEW STUDIO</div>

            <label className="cartoon-label">
              Studio Name
              <input
                className="cartoon-input"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
              />
            </label>

            <label className="cartoon-label">
              Founder Name
              <input
                className="cartoon-input"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
              />
            </label>

            <label className="cartoon-label">
              Founder City
              <input
                className="cartoon-input"
                value={founderCity}
                onChange={(e) => setFounderCity(e.target.value)}
              />
            </label>

            <div className="cartoon-label">
              Founder Archetype
              <div className="cartoon-archetype">
                {(["programmer", "designer", "artist"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFounderArchetype(t)}
                    className={`cartoon-chip ${founderArchetype === t ? "active" : ""}`}
                  >
                    <span aria-hidden="true" style={{ marginRight: 4 }}>
                      {ARCHETYPE_EMOJI[t]}
                    </span>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <label className="cartoon-label">
              Starting Era
              <select
                className="cartoon-input"
                value={presetId}
                onChange={(e) => setPresetId(e.target.value)}
              >
                {STARTING_ERA_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="cartoon-label">
              Save Slot Name <span style={{ opacity: 0.6 }}>(optional)</span>
              <input
                className="cartoon-input"
                value={slotLabel}
                placeholder={studioName}
                onChange={(e) => setSlotLabel(e.target.value)}
              />
            </label>

            {currentPreset && (
              <div className="cartoon-preset-card">
                <div className="cartoon-preset-desc">{currentPreset.description}</div>
                <div className="cartoon-preset-quote">
                  &ldquo;{currentPreset.openingMessage}&rdquo;
                </div>
              </div>
            )}

            <div className="cartoon-form-actions">
              <button
                className="cartoon-btn cartoon-btn-ghost"
                onClick={() => setShowNewGame(false)}
              >
                <span className="cartoon-btn-label">BACK</span>
              </button>
              <button
                className="cartoon-btn cartoon-btn-primary"
                onClick={handleNewGame}
              >
                <span className="cartoon-btn-label">START!</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="cartoon-version">v0.1.0 · for Michael M · Built with Claude</div>
    </div>
  );
}
