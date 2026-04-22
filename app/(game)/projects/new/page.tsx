"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { formatMoney } from "@/lib/format";
import {
  GENRES, THEMES, platformsAvailableInYear,
  DLC_PLAN_KINDS, dlcKindLabel, dlcKindDescription,
  isDlcKindUnlocked, dlcKindLockedReason,
} from "@/engine";
import type { GenreId, ThemeId, TargetAudience, DLCKind } from "@/engine";

const AUDIENCES: TargetAudience[] = ["kids", "teens", "young_adults", "mature", "everyone"];

const stickerHeading: React.CSSProperties = {
  background: "var(--pink)",
  color: "#fff",
  border: "3px solid var(--ink)",
  boxShadow: "4px 4px 0 var(--ink)",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.08em",
};

const inputStyle: React.CSSProperties = {
  background: "var(--cream-2)",
  color: "var(--ink)",
  border: "2.5px solid var(--ink)",
  borderRadius: 10,
  padding: "6px 10px",
  fontFamily: "var(--font-body)",
  width: "100%",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  color: "var(--ink-soft)",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.06em",
  fontSize: "11px",
  textTransform: "uppercase",
  marginBottom: 4,
  display: "block",
};

const selectableStyle = (selected: boolean, disabled = false): React.CSSProperties => ({
  background: disabled ? "var(--cream-2)" : selected ? "var(--mustard)" : "var(--cream)",
  color: disabled ? "var(--ink-soft)" : "var(--ink)",
  border: "3px solid var(--ink)",
  borderRadius: 12,
  boxShadow: disabled ? "none" : selected ? "4px 4px 0 var(--ink)" : "3px 3px 0 var(--ink)",
  padding: "10px 12px",
  textAlign: "left",
  width: "100%",
  fontFamily: "var(--font-body)",
  opacity: disabled ? 0.55 : 1,
  cursor: disabled ? "not-allowed" : "pointer",
});

function ActionButton({
  tone = "default",
  disabled,
  onClick,
  children,
  full,
  title,
}: {
  tone?: "teal" | "pink" | "mustard" | "default";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  full?: boolean;
  title?: string;
}) {
  const bg = disabled
    ? "var(--cream-2)"
    : tone === "teal"
      ? "var(--teal)"
      : tone === "pink"
        ? "var(--pink)"
        : tone === "mustard"
          ? "var(--mustard)"
          : "var(--cream)";
  const color = disabled
    ? "var(--ink-soft)"
    : tone === "default" || tone === "mustard"
      ? "var(--ink)"
      : "#fff";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-3 py-1.5 text-xs ${full ? "flex-1" : ""}`}
      style={{
        background: bg,
        color,
        border: "2.5px solid var(--ink)",
        borderRadius: 10,
        boxShadow: disabled ? "none" : "2px 2px 0 var(--ink)",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.06em",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {children}
    </button>
  );
}

function FitChip({ affinity }: { affinity: number }) {
  const label =
    affinity >= 0.85
      ? "PERFECT MATCH"
      : affinity >= 0.7
        ? "STRONG FIT"
        : affinity >= 0.5
          ? "WORKABLE"
          : "POOR FIT";
  const tone =
    affinity >= 0.7
      ? { bg: "var(--teal)", color: "#fff" }
      : affinity >= 0.5
        ? { bg: "var(--mustard)", color: "var(--ink)" }
        : { bg: "var(--pink)", color: "#fff" };
  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded-md text-[10px]"
      style={{
        background: tone.bg,
        color: tone.color,
        border: "2px solid var(--ink)",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.06em",
      }}
    >
      {label} · {(affinity * 100).toFixed(0)}%
    </span>
  );
}

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = useGameStore((s) => s.state);
  const createProject = useGameStore((s) => s.createProject);

  const sequelParentId = searchParams.get("sequel");
  const sequelParent = sequelParentId ? state?.projects[sequelParentId] : null;
  const sequelNumber = useMemo(() => {
    if (!sequelParent || !state) return undefined;
    if (!sequelParent.ipId) return 2;
    const sameIp = Object.values(state.projects).filter(
      (p) => p.ipId === sequelParent.ipId && p.status === "released"
    );
    const maxN = sameIp.reduce(
      (m, p) => Math.max(m, p.sequelNumber ?? 1),
      1
    );
    return maxN + 1;
  }, [sequelParent, state]);
  const sequelDefaultName = useMemo(() => {
    if (!sequelParent) return "";
    const base = sequelParent.name.replace(/\s+\d+\s*$/, "").trim();
    return `${base} ${sequelNumber}`;
  }, [sequelParent, sequelNumber]);

  const [name, setName] = useState(sequelDefaultName);
  const [genre, setGenre] = useState<GenreId>(sequelParent?.genre ?? "rpg");
  const [theme, setTheme] = useState<ThemeId>(sequelParent?.theme ?? "fantasy");
  const [audience, setAudience] = useState<TargetAudience>(
    sequelParent?.audience ?? "young_adults"
  );
  const [platformIds, setPlatformIds] = useState<string[]>([]);
  const [engineId, setEngineId] = useState<string | null>(
    state?.studio.lastUsedEngineId ?? null
  );
  const [scope, setScope] = useState(1.0);
  const [budget, setBudget] = useState(5000000);
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>([]);
  const [dlcPlans, setDlcPlans] = useState<Array<{ kind: DLCKind; name: string }>>([]);

  const year = state ? parseInt(state.currentDate.slice(0, 4), 10) : 0;

  const validGenres = useMemo(
    () => GENRES.filter((g) => g.emergedYear <= year),
    [year]
  );
  const validThemes = useMemo(
    () => THEMES.filter((t) => t.emergedYear <= year),
    [year]
  );
  useEffect(() => {
    if (validGenres.length > 0 && !validGenres.some((g) => g.id === genre)) {
      setGenre(validGenres[0].id);
    }
    if (validThemes.length > 0 && !validThemes.some((t) => t.id === theme)) {
      setTheme(validThemes[0].id);
    }
  }, [validGenres, validThemes, genre, theme]);

  const availablePlatforms = useMemo(
    () => platformsAvailableInYear(year).filter(
      (p) => (p.genreAffinity[genre] ?? 0) > 0.3
    ),
    [year, genre]
  );

  const availableEngines = useMemo(() => {
    if (!state) return [];
    return Object.values(state.engines).filter((e) => {
      if (e.status === "discontinued") return false;
      if (e.origin === "player" && e.ownerStudioId === state.studio.id) return true;
      if (e.status === "public_release") return true;
      return false;
    }).sort((a, b) => b.overallTier - a.overallTier);
  }, [state]);

  const freeStaff = state
    ? Object.values(state.staff).filter(
        (s) => s.status === "employed" && s.currentProjectId === null
      )
    : [];

  const dlcKindStatuses = useMemo(
    () => state
      ? DLC_PLAN_KINDS.map((kind) => {
          const unlocked = isDlcKindUnlocked(state, kind);
          const lockedReason = unlocked ? null : dlcKindLockedReason(state, kind);
          return { kind, unlocked, lockedReason };
        })
      : [],
    [state]
  );

  if (!state) return null;

  const canSubmit =
    name.trim().length > 0 &&
    platformIds.length > 0 &&
    assignedStaffIds.length > 0 &&
    state.studio.cash >= budget;

  const togglePlatform = (pid: string) => {
    setPlatformIds((prev) =>
      prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]
    );
  };
  const toggleStaff = (sid: string) => {
    setAssignedStaffIds((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  };

  const handleSubmit = () => {
    const id = createProject({
      name: name.trim(),
      genre,
      theme,
      audience,
      platformIds,
      engineId,
      budget,
      assignedStaffIds,
      scopeMultiplier: scope,
      ipId: sequelParent?.ipId,
      isSequel: !!sequelParent,
      sequelNumber: sequelParent ? sequelNumber : undefined,
      dlcPlans: dlcPlans.map((p) => ({
        kind: p.kind,
        name: p.name.trim() || undefined,
      })),
    });
    if (id) router.push(`/projects/${id}`);
  };

  const addDlcPlan = (kind: DLCKind) => {
    setDlcPlans((prev) => [...prev, { kind, name: "" }]);
  };
  const renameDlcPlan = (index: number, next: string) => {
    setDlcPlans((prev) => prev.map((p, i) => (i === index ? { ...p, name: next } : p)));
  };
  const removeDlcPlan = (index: number) => {
    setDlcPlans((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <h2 className="inline-flex items-center px-4 py-1.5 rounded-xl text-lg" style={stickerHeading}>
        {sequelParent ? "NEW SEQUEL" : "NEW PROJECT"}
      </h2>

      {sequelParent && (
        <div
          className="p-3 text-xs leading-relaxed"
          style={{
            background: "var(--cream)",
            border: "3px solid var(--ink)",
            borderRadius: 14,
            boxShadow: "4px 4px 0 var(--ink)",
          }}
        >
          <div
            className="mb-1 inline-block px-2 py-0.5 rounded-md"
            style={{
              background: "var(--purple)",
              color: "#fff",
              border: "2px solid var(--ink)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.06em",
            }}
          >
            SEQUEL TO {sequelParent.name.toUpperCase()}
          </div>
          <div className="mt-2" style={{ color: "var(--ink-soft)" }}>
            {sequelParent.ipId
              ? "Franchise IP linked · fan affinity carries over · review expectations inherit from the original."
              : "No IP was attached to the original — this will still be tagged as a sequel, but fan affinity will start cold."}
            {" "}
            Genre, theme, audience pre-filled from the original. Change anything before you hit start.
          </div>
        </div>
      )}

      <Panel title="TITLE & DIRECTION">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Title</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              placeholder="Dragon's Requiem"
            />
          </div>
          <div>
            <label style={labelStyle}>Target Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as TargetAudience)}
              style={inputStyle}
            >
              {AUDIENCES.map((a) => (
                <option key={a} value={a}>
                  {a.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value as GenreId)}
              style={inputStyle}
            >
              {validGenres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeId)}
              style={inputStyle}
            >
              {validThemes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {(() => {
              const affinity =
                THEMES.find((t) => t.id === theme)?.genreAffinity[genre] ?? 0.5;
              return (
                <div className="mt-2">
                  <FitChip affinity={affinity} />
                </div>
              );
            })()}
          </div>
        </div>
      </Panel>

      <Panel title={`PLATFORMS (${platformIds.length} selected)`}>
        {availablePlatforms.length === 0 ? (
          <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
            No viable platforms for this genre in {year}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availablePlatforms.map((p) => {
              const selected = platformIds.includes(p.id);
              const affinity = p.genreAffinity[genre] ?? 0.5;
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  style={selectableStyle(selected)}
                >
                  <div className="flex justify-between items-center gap-2 flex-wrap">
                    <span style={{ fontWeight: 700 }}>{p.name}</span>
                    <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      {formatMoney(p.devKitCost)} devkit · {(affinity * 100).toFixed(0)}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel title="ENGINE">
        <div className="space-y-2">
          {(() => {
            const selected = engineId === null;
            const isDefault = state.studio.lastUsedEngineId === null;
            return (
              <button onClick={() => setEngineId(null)} style={selectableStyle(selected)}>
                <div className="flex justify-between items-center gap-2 flex-wrap">
                  <div>
                    <span style={{ fontWeight: 700 }}>HAND-CODED</span>
                    <span className="text-xs ml-2" style={{ color: "var(--ink-soft)" }}>
                      no engine · pure craft
                      {isDefault && " · DEFAULT"}
                    </span>
                  </div>
                  <span
                    className="inline-block px-1.5 py-0.5 rounded-md text-[10px]"
                    style={{
                      background: "var(--teal)",
                      color: "#fff",
                      border: "2px solid var(--ink)",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    FREE
                  </span>
                </div>
              </button>
            );
          })()}
          {availableEngines.map((e) => {
            const selected = engineId === e.id;
            const isOwn = e.ownerStudioId === state.studio.id;
            const isDefault = state.studio.lastUsedEngineId === e.id;
            const royalty = isOwn ? 0 : e.licenseTerms.royaltyRate;
            return (
              <button key={e.id} onClick={() => setEngineId(e.id)} style={selectableStyle(selected)}>
                <div className="flex justify-between items-center gap-2 flex-wrap">
                  <div>
                    <span style={{ fontWeight: 700 }}>{e.name}</span>
                    <span className="text-xs ml-2" style={{ color: "var(--ink-soft)" }}>
                      tier {e.overallTier} · {e.featureIds.length} features
                      {isOwn && " · YOURS"}
                      {isDefault && " · DEFAULT"}
                    </span>
                  </div>
                  <span
                    className="inline-block px-1.5 py-0.5 rounded-md text-[10px]"
                    style={{
                      background: isOwn ? "var(--teal)" : "var(--cream-2)",
                      color: isOwn ? "#fff" : "var(--ink)",
                      border: "2px solid var(--ink)",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {isOwn
                      ? "FREE"
                      : `${e.licenseTerms.licenseFee > 0 ? formatMoney(e.licenseTerms.licenseFee) : ""}${
                          e.licenseTerms.licenseFee > 0 && royalty > 0 ? " + " : ""
                        }${royalty > 0 ? `${(royalty * 100).toFixed(1)}%` : ""}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="SCOPE & BUDGET">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Scope: {scope.toFixed(1)}x</label>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.1}
              value={scope}
              onChange={(e) => setScope(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
              Lower scope = faster; higher scope = more impact
            </div>
          </div>
          <div>
            <label style={labelStyle}>Budget</label>
            <input
              type="number"
              value={Math.round(budget / 100)}
              onChange={(e) => setBudget(parseInt(e.target.value || "0") * 100)}
              style={inputStyle}
            />
            <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
              {formatMoney(budget)} · available:{" "}
              <span
                className="tabular"
                style={{
                  color: state.studio.cash >= budget ? "var(--ink)" : "var(--pink-deep)",
                  fontWeight: 700,
                }}
              >
                {formatMoney(state.studio.cash)}
              </span>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title={`DLC PLAN (${dlcPlans.length} declared)`}>
        <div className="text-xs mb-3 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Declare DLC at concept to unlock the season-pass slot. Plans are
          non-binding — you can cancel or add more later. DLC unit sales are
          hard-capped at the base game&apos;s lifetime sales; expansions can
          trigger market-movers, cosmetics and packs cannot.
        </div>

        {dlcPlans.length > 0 && (
          <div className="space-y-2 mb-3">
            {dlcPlans.map((plan, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 flex-wrap"
                style={{
                  background: "var(--cream)",
                  border: "2.5px solid var(--cream-2)",
                  borderRadius: 12,
                }}
              >
                <span
                  className="inline-block px-2 py-0.5 rounded-md text-[10px]"
                  style={{
                    background: "var(--purple)",
                    color: "#fff",
                    border: "2px solid var(--ink)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {dlcKindLabel(plan.kind).toUpperCase()}
                </span>
                <input
                  value={plan.name}
                  onChange={(e) => renameDlcPlan(i, e.target.value)}
                  placeholder="Working title (optional)"
                  className="flex-1 text-xs"
                  style={inputStyle}
                />
                <ActionButton tone="pink" onClick={() => removeDlcPlan(i)} title="Remove this plan">
                  REMOVE
                </ActionButton>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {dlcKindStatuses.map(({ kind, unlocked, lockedReason }) => {
            const alreadyPlanned = dlcPlans.some((p) => p.kind === kind);
            const oneOnly = kind === "season_pass";
            const disabled = !unlocked || (oneOnly && alreadyPlanned);
            const title = !unlocked
              ? (lockedReason ?? "Locked")
              : oneOnly && alreadyPlanned
                ? "Already planned"
                : "Add to DLC plan";
            return (
              <button
                key={kind}
                onClick={() => unlocked && addDlcPlan(kind)}
                disabled={disabled}
                style={selectableStyle(false, disabled)}
                title={title}
              >
                <div
                  className="text-xs flex items-center gap-1"
                  style={{ color: "var(--pink-deep)", fontWeight: 700 }}
                >
                  <span>{unlocked ? "+" : "🔒"}</span>
                  <span>{dlcKindLabel(kind)}</span>
                </div>
                <div className="text-[11px] leading-tight mt-1" style={{ color: "var(--ink-soft)" }}>
                  {unlocked
                    ? dlcKindDescription(kind)
                    : (lockedReason ?? dlcKindDescription(kind))}
                </div>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title={`TEAM (${assignedStaffIds.length} assigned)`}>
        {freeStaff.length === 0 ? (
          <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
            No free staff. Hire more or unassign from other projects.
          </div>
        ) : (
          <div className="space-y-2">
            {freeStaff.map((s) => {
              const selected = assignedStaffIds.includes(s.id);
              return (
                <button key={s.id} onClick={() => toggleStaff(s.id)} style={selectableStyle(selected)}>
                  <div className="flex justify-between items-center text-sm gap-2 flex-wrap">
                    <span>
                      <span style={{ fontWeight: 700 }}>{s.name}</span>{" "}
                      <span style={{ color: "var(--ink-soft)" }}>· {s.role}</span>
                    </span>
                    <span className="text-xs tabular" style={{ color: "var(--ink-soft)" }}>
                      {formatMoney(s.salary)}/yr · morale {s.morale.toFixed(0)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Panel>

      {!canSubmit && (
        <div
          className="p-3 text-xs leading-relaxed"
          style={{
            background: "var(--cream)",
            border: "3px solid var(--ink)",
            borderRadius: 14,
            boxShadow: "4px 4px 0 var(--ink)",
          }}
        >
          <div
            className="mb-2 inline-block px-2 py-0.5 rounded-md"
            style={{
              background: "var(--pink)",
              color: "#fff",
              border: "2px solid var(--ink)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.06em",
            }}
          >
            CANNOT START YET — MISSING:
          </div>
          <ul className="list-disc pl-5 space-y-0.5" style={{ color: "var(--ink-soft)" }}>
            {name.trim().length === 0 && <li>Title is required</li>}
            {platformIds.length === 0 && (
              <li>
                Select at least one platform
                {availablePlatforms.length === 0 && (
                  <>
                    {" "}— no platform supports <strong>{genre}</strong> in {year}; pick a different genre above
                  </>
                )}
              </li>
            )}
            {assignedStaffIds.length === 0 && (
              <li>
                Assign at least one staff member
                {freeStaff.length === 0 && <> — hire staff or free someone from another project</>}
              </li>
            )}
            {state.studio.cash < budget && (
              <li>
                Insufficient cash — need {formatMoney(budget)}, have {formatMoney(state.studio.cash)}. Lower the budget or sell something.
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <ActionButton full onClick={() => router.push("/projects")}>
          CANCEL
        </ActionButton>
        <ActionButton full tone="teal" onClick={handleSubmit} disabled={!canSubmit}>
          START PROJECT
        </ActionButton>
      </div>
    </div>
  );
}
