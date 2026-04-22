"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { formatMoney } from "@/lib/format";
import { TECH_NODE_BY_ID, ENGINE_FEATURE_BY_ID } from "@/engine";

const stickerHeading: React.CSSProperties = {
  background: "var(--teal)",
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

const selectableStyle = (selected: boolean): React.CSSProperties => ({
  background: selected ? "var(--mustard)" : "var(--cream)",
  color: "var(--ink)",
  border: "3px solid var(--ink)",
  borderRadius: 12,
  boxShadow: selected ? "4px 4px 0 var(--ink)" : "3px 3px 0 var(--ink)",
  padding: "8px 10px",
  textAlign: "left",
  width: "100%",
  fontFamily: "var(--font-body)",
});

function ActionButton({
  tone = "default",
  disabled,
  onClick,
  children,
  full,
}: {
  tone?: "teal" | "pink" | "default";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  full?: boolean;
}) {
  const bg = disabled
    ? "var(--cream-2)"
    : tone === "teal"
      ? "var(--teal)"
      : tone === "pink"
        ? "var(--pink)"
        : "var(--cream)";
  const color = disabled ? "var(--ink-soft)" : tone === "default" ? "var(--ink)" : "#fff";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
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

function MiniStat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "good" | "bad" }) {
  const valueColor =
    tone === "good" ? "var(--teal-deep)" : tone === "bad" ? "var(--pink-deep)" : "var(--ink)";
  return (
    <div
      className="rounded-xl p-2"
      style={{
        background: "var(--cream-2)",
        border: "2.5px solid var(--ink)",
        boxShadow: "3px 3px 0 var(--ink)",
      }}
    >
      <div
        className="text-[10px]"
        style={{
          color: "var(--ink-soft)",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.06em",
        }}
      >
        {label.toUpperCase()}
      </div>
      <div className="tabular text-sm mt-0.5" style={{ color: valueColor, fontWeight: 700 }}>
        {value}
      </div>
    </div>
  );
}

export default function NewEnginePage() {
  const router = useRouter();
  const state = useGameStore((s) => s.state);
  const startEngineProject = useGameStore((s) => s.startEngineProject);

  const [name, setName] = useState("MavForge");
  const [lineageId, setLineageId] = useState("mav_forge");
  const [version, setVersion] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  const availableFeatures = useMemo(() => {
    if (!state) return [];
    const feats = new Set<string>();
    for (const nodeId of state.studio.completedTechIds) {
      const node = TECH_NODE_BY_ID[nodeId];
      if (node) for (const f of node.grantsFeatures) feats.add(f);
    }
    return [...feats]
      .map((id) => ENGINE_FEATURE_BY_ID[id])
      .filter(Boolean)
      .sort((a, b) => a!.branch.localeCompare(b!.branch) || a!.tier - b!.tier);
  }, [state]);

  const freeStaff = state
    ? Object.values(state.staff).filter(
        (s) => s.status === "employed" && s.currentProjectId === null
      )
    : [];

  const buildCost = selectedFeatures.reduce((sum, fid) => {
    const f = ENGINE_FEATURE_BY_ID[fid];
    if (!f) return sum;
    return sum + Math.round(10000 * 100 * Math.pow(2, f.tier - 1));
  }, 0);

  const branchTiers = useMemo(() => {
    const tiers: Record<string, number> = {
      graphics: 0, audio: 0, networking: 0, simulation: 0, platform: 0,
      ai_tools: 0, monetization: 0, input_ux: 0,
    };
    for (const fid of selectedFeatures) {
      const f = ENGINE_FEATURE_BY_ID[fid];
      if (!f) continue;
      if (f.tier > tiers[f.branch]!) tiers[f.branch] = f.tier;
    }
    return tiers;
  }, [selectedFeatures]);

  const canSubmit =
    state !== null &&
    name.trim().length > 0 &&
    selectedFeatures.length > 0 &&
    selectedStaffIds.length > 0 &&
    state.studio.cash >= buildCost;

  const handleSubmit = () => {
    const id = startEngineProject({
      plannedName: name.trim(),
      plannedLineageId: lineageId,
      plannedVersionNumber: version,
      featureIds: selectedFeatures,
      assignedStaffIds: selectedStaffIds,
    });
    if (id) router.push("/engines");
  };

  if (!state) return null;

  const toggleFeature = (fid: string) => {
    setSelectedFeatures((p) =>
      p.includes(fid) ? p.filter((x) => x !== fid) : [...p, fid]
    );
  };
  const toggleStaff = (sid: string) => {
    setSelectedStaffIds((p) => (p.includes(sid) ? p.filter((x) => x !== sid) : [...p, sid]));
  };

  const byBranch = availableFeatures.reduce(
    (acc, f) => {
      if (!f) return acc;
      (acc[f.branch] ??= []).push(f);
      return acc;
    },
    {} as Record<string, (typeof availableFeatures[number])[]>
  );

  const overallTier =
    Math.min(...Object.values(branchTiers).filter((v) => v > 0)) || 0;
  const affordable = state.studio.cash >= buildCost;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <h2 className="inline-flex items-center px-4 py-1.5 rounded-xl text-lg" style={stickerHeading}>
        NEW ENGINE
      </h2>

      <Panel title="ENGINE IDENTITY">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label style={labelStyle}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Lineage ID</label>
            <input value={lineageId} onChange={(e) => setLineageId(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Version</label>
            <input
              type="number"
              min={1}
              value={version}
              onChange={(e) => setVersion(parseInt(e.target.value || "1"))}
              style={inputStyle}
            />
          </div>
        </div>
      </Panel>

      <Panel
        title={`FEATURES (${selectedFeatures.length} selected)`}
        headerRight={
          <span
            className="inline-block px-2 py-0.5 rounded-md text-[11px] tabular"
            style={{
              background: "var(--teal)",
              color: "#fff",
              border: "2px solid var(--ink)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
            }}
          >
            {formatMoney(buildCost)}
          </span>
        }
      >
        {Object.keys(byBranch).length === 0 ? (
          <div className="py-6 text-center text-sm" style={{ color: "var(--ink-soft)" }}>
            No engine features available yet — research tech to unlock features.
          </div>
        ) : (
          Object.entries(byBranch).map(([branch, feats]) => (
            <div key={branch} className="mb-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className="inline-block px-2 py-0.5 rounded-md text-[10px]"
                  style={{
                    background: "var(--cream-2)",
                    color: "var(--ink)",
                    border: "2px solid var(--ink)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {branch.toUpperCase()}
                </span>
                <span className="text-[11px]" style={{ color: "var(--ink-soft)" }}>
                  max tier selected:{" "}
                  <span
                    className="inline-block px-1.5 py-0.5 rounded-md text-[10px] tabular"
                    style={{
                      background: branchTiers[branch] ? "var(--purple)" : "var(--cream-2)",
                      color: branchTiers[branch] ? "#fff" : "var(--ink-soft)",
                      border: "2px solid var(--ink)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                    }}
                  >
                    T{branchTiers[branch] || 0}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {feats.map((f) => {
                  const selected = selectedFeatures.includes(f!.id);
                  const cost = Math.round(10000 * 100 * Math.pow(2, f!.tier - 1));
                  return (
                    <button
                      key={f!.id}
                      onClick={() => toggleFeature(f!.id)}
                      style={selectableStyle(selected)}
                    >
                      <div className="flex justify-between items-center text-xs gap-2 flex-wrap">
                        <span>
                          <span
                            className="inline-block px-1 py-0.5 rounded-md text-[9px] mr-1.5 align-middle"
                            style={{
                              background: selected ? "var(--ink)" : "var(--purple)",
                              color: "#fff",
                              border: "2px solid var(--ink)",
                              fontFamily: "var(--font-display)",
                            }}
                          >
                            T{f!.tier}
                          </span>
                          <span style={{ fontWeight: 700 }}>{f!.name}</span>
                        </span>
                        <span className="tabular" style={{ color: "var(--ink-soft)" }}>
                          {formatMoney(cost)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </Panel>

      <Panel title={`TEAM (${selectedStaffIds.length} assigned)`}>
        {freeStaff.length === 0 ? (
          <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
            No free staff.
          </div>
        ) : (
          <div className="space-y-2">
            {freeStaff.map((s) => {
              const selected = selectedStaffIds.includes(s.id);
              return (
                <button key={s.id} onClick={() => toggleStaff(s.id)} style={selectableStyle(selected)}>
                  <div className="flex justify-between items-center text-sm gap-2 flex-wrap">
                    <span>
                      <span style={{ fontWeight: 700 }}>{s.name}</span>{" "}
                      <span style={{ color: "var(--ink-soft)" }}>· {s.role}</span>
                    </span>
                    <span className="text-xs tabular" style={{ color: "var(--ink-soft)" }}>
                      tech {s.stats.tech} · morale {s.morale.toFixed(0)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel title="SUMMARY">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <MiniStat
            label="Build cost"
            value={formatMoney(buildCost)}
            tone={affordable ? "default" : "bad"}
          />
          <MiniStat label="Available" value={formatMoney(state.studio.cash)} />
          <MiniStat label="Overall tier" value={`T${overallTier}`} tone={overallTier > 0 ? "good" : "default"} />
          <MiniStat label="Features" value={String(selectedFeatures.length)} />
        </div>
      </Panel>

      <div className="flex gap-2">
        <ActionButton full onClick={() => router.push("/engines")}>
          CANCEL
        </ActionButton>
        <ActionButton full tone="teal" onClick={handleSubmit} disabled={!canSubmit}>
          START BUILD
        </ActionButton>
      </div>
    </div>
  );
}
