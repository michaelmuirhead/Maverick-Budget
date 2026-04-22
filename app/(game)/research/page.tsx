"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { Progress } from "@/components/ui/Progress";
import { availableResearchNodes, TECH_NODE_BY_ID } from "@/engine";

const stickerHeading: React.CSSProperties = {
  background: "var(--teal)",
  color: "#fff",
  border: "3px solid var(--ink)",
  boxShadow: "4px 4px 0 var(--ink)",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.08em",
};

const cardStyle: React.CSSProperties = {
  background: "var(--cream)",
  border: "3px solid var(--ink)",
  borderRadius: 16,
  boxShadow: "5px 5px 0 var(--ink)",
};

const selectableCardStyle = (selected: boolean): React.CSSProperties => ({
  background: selected ? "var(--mustard)" : "var(--cream)",
  color: "var(--ink)",
  border: "3px solid var(--ink)",
  borderRadius: 14,
  boxShadow: selected ? "4px 4px 0 var(--ink)" : "3px 3px 0 var(--ink)",
  padding: "10px 12px",
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

export default function ResearchPage() {
  const state = useGameStore((s) => s.state);
  const startResearch = useGameStore((s) => s.startResearch);
  const cancelResearch = useGameStore((s) => s.cancelResearch);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  if (!state) return null;

  const available = availableResearchNodes(state);
  const activeResearch = Object.values(state.researchProjects).filter((r) => !r.completed);
  const completed = state.studio.completedTechIds;

  const byBranch: Record<string, typeof available> = {};
  for (const node of available) {
    (byBranch[node.branch] ??= []).push(node);
  }

  const freeStaff = Object.values(state.staff).filter(
    (s) => s.status === "employed" && s.currentProjectId === null
  );

  const toggleStaff = (sid: string) => {
    setSelectedStaff((p) => (p.includes(sid) ? p.filter((x) => x !== sid) : [...p, sid]));
  };

  const handleStart = () => {
    if (!selectedNode || selectedStaff.length === 0) return;
    startResearch(selectedNode, selectedStaff);
    setSelectedNode(null);
    setSelectedStaff([]);
  };

  return (
    <div className="space-y-4">
      <h2 className="inline-flex items-center px-4 py-1.5 rounded-xl text-lg" style={stickerHeading}>
        RESEARCH &amp; DEVELOPMENT
      </h2>

      {activeResearch.length > 0 && (
        <Panel title={`ACTIVE RESEARCH (${activeResearch.length})`}>
          <div className="space-y-3">
            {activeResearch.map((r) => {
              const node = TECH_NODE_BY_ID[r.nodeId];
              const pct = (r.pointsAccumulated / r.pointsRequired) * 100;
              const researchers = r.assignedStaffIds.map((id) => state.staff[id]).filter(Boolean);
              return (
                <div key={r.id} className="p-3" style={cardStyle}>
                  <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                    <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                      {node?.name ?? r.nodeId}
                    </span>
                    <span className="text-xs tabular" style={{ color: "var(--ink-soft)" }}>
                      {r.pointsAccumulated.toFixed(0)} / {r.pointsRequired} pts
                    </span>
                  </div>
                  <Progress value={pct} showLabel />
                  <div className="flex justify-between items-center mt-2 text-xs flex-wrap gap-2">
                    <span style={{ color: "var(--ink-soft)" }}>
                      {researchers.length} researcher{researchers.length > 1 ? "s" : ""}:{" "}
                      <span style={{ color: "var(--ink)", fontWeight: 600 }}>
                        {researchers.map((s) => s!.name).join(", ")}
                      </span>
                    </span>
                    <ActionButton tone="pink" onClick={() => cancelResearch(r.id)}>
                      CANCEL
                    </ActionButton>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      <Panel title={`AVAILABLE RESEARCH (${available.length})`}>
        {available.length === 0 ? (
          <div className="py-6 text-center text-sm" style={{ color: "var(--ink-soft)" }}>
            No new tech available. Wait for new emergence years or complete prerequisites.
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(byBranch).map(([branch, nodes]) => (
              <div key={branch}>
                <div
                  className="inline-block px-2 py-0.5 rounded-md text-[10px] mb-2"
                  style={{
                    background: "var(--cream-2)",
                    color: "var(--ink)",
                    border: "2px solid var(--ink)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {branch.toUpperCase()}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {nodes.map((n) => {
                    const selected = selectedNode === n.id;
                    return (
                      <button
                        key={n.id}
                        onClick={() => setSelectedNode(n.id)}
                        style={selectableCardStyle(selected)}
                      >
                        <div className="flex justify-between items-baseline gap-2">
                          <span style={{ fontWeight: 700 }}>
                            <span
                              className="inline-block px-1.5 py-0.5 rounded-md text-[10px] mr-2 align-middle"
                              style={{
                                background: selected ? "var(--ink)" : "var(--purple)",
                                color: "#fff",
                                border: "2px solid var(--ink)",
                                fontFamily: "var(--font-display)",
                              }}
                            >
                              T{n.tier}
                            </span>
                            {n.name}
                          </span>
                          <span className="text-xs tabular whitespace-nowrap" style={{ color: "var(--ink-soft)" }}>
                            {n.techPointsRequired} pts
                          </span>
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                          Grants: {n.grantsFeatures.slice(0, 3).join(", ")}
                          {n.grantsFeatures.length > 3 && ` +${n.grantsFeatures.length - 3}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {selectedNode && (
        <Panel title="START RESEARCH">
          <div className="mb-3">
            <span style={{ color: "var(--pink-deep)", fontWeight: 700, fontSize: "1rem" }}>
              {TECH_NODE_BY_ID[selectedNode]?.name}
            </span>
          </div>
          <div
            className="text-xs mb-2"
            style={{
              color: "var(--ink-soft)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.06em",
            }}
          >
            ASSIGN RESEARCHERS ({selectedStaff.length} SELECTED)
          </div>
          {freeStaff.length === 0 ? (
            <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
              No free staff.
            </div>
          ) : (
            <div className="space-y-2 mb-3">
              {freeStaff.map((s) => {
                const selected = selectedStaff.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleStaff(s.id)}
                    style={selectableCardStyle(selected)}
                  >
                    <div className="flex justify-between text-sm flex-wrap gap-2">
                      <span>
                        <span style={{ fontWeight: 700 }}>{s.name}</span>{" "}
                        <span style={{ color: "var(--ink-soft)" }}>· {s.role}</span>
                      </span>
                      <span className="text-xs tabular" style={{ color: "var(--ink-soft)" }}>
                        tech {s.stats.tech} · design {s.stats.design}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          <div className="flex gap-2">
            <ActionButton
              full
              onClick={() => {
                setSelectedNode(null);
                setSelectedStaff([]);
              }}
            >
              CANCEL
            </ActionButton>
            <ActionButton
              full
              tone="teal"
              onClick={handleStart}
              disabled={selectedStaff.length === 0}
            >
              START RESEARCH
            </ActionButton>
          </div>
        </Panel>
      )}

      <Panel title={`COMPLETED TECH (${completed.length})`}>
        <div className="flex flex-wrap gap-2">
          {completed.map((id) => {
            const node = TECH_NODE_BY_ID[id];
            if (!node) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px]"
                style={{
                  background: "var(--cream-2)",
                  color: "var(--ink)",
                  border: "2.5px solid var(--ink)",
                  borderRadius: 8,
                  boxShadow: "2px 2px 0 var(--ink)",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.04em",
                }}
              >
                <span
                  className="inline-block px-1 rounded-sm text-[9px]"
                  style={{ background: "var(--teal)", color: "#fff", border: "1.5px solid var(--ink)" }}
                >
                  T{node.tier}
                </span>
                {node.name}
              </span>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
