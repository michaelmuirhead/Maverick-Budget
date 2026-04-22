"use client";

import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { Progress } from "@/components/ui/Progress";
import { formatMoney } from "@/lib/format";
import Link from "next/link";

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

function ActionButton({
  tone = "default",
  disabled,
  onClick,
  children,
}: {
  tone?: "teal" | "pink" | "default";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
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
      className="px-3 py-1.5 text-xs"
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

function StatusChip({ status }: { status: string }) {
  const bg =
    status === "public_release"
      ? "var(--teal)"
      : status === "deprecated"
        ? "var(--mustard)"
        : status === "discontinued"
          ? "var(--pink)"
          : "var(--cream-2)";
  const color = status === "deprecated" ? "var(--ink)" : status === "internal_only" ? "var(--ink)" : "#fff";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[10px]"
      style={{
        background: bg,
        color,
        border: "2px solid var(--ink)",
        borderRadius: 8,
        fontFamily: "var(--font-display)",
        letterSpacing: "0.06em",
      }}
    >
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
}

function BranchStat({ branch, tier }: { branch: string; tier: number }) {
  return (
    <div
      className="rounded-lg px-2 py-1 text-center"
      style={{
        background: "var(--cream-2)",
        border: "2px solid var(--ink)",
        boxShadow: "2px 2px 0 var(--ink)",
      }}
    >
      <div
        className="text-[9px]"
        style={{
          color: "var(--ink-soft)",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.05em",
        }}
      >
        {branch.toUpperCase()}
      </div>
      <div
        className="tabular text-sm"
        style={{ color: tier > 0 ? "var(--pink-deep)" : "var(--ink-soft)", fontWeight: 700 }}
      >
        T{tier || "—"}
      </div>
    </div>
  );
}

export default function EnginesPage() {
  const state = useGameStore((s) => s.state);
  const publiclyReleaseEngine = useGameStore((s) => s.publiclyReleaseEngine);

  if (!state) return null;

  const playerEngines = Object.values(state.engines).filter(
    (e) => e.ownerStudioId === state.studio.id
  );
  const thirdParty = Object.values(state.engines)
    .filter((e) => e.origin === "third_party" && e.status !== "discontinued")
    .sort((a, b) => b.overallTier - a.overallTier);

  const engineProjects = Object.values(state.engineProjects).filter((p) => !p.cancelled);

  const licensesByEngine = new Map<string, typeof state.engineLicenses[string][]>();
  for (const lic of Object.values(state.engineLicenses)) {
    if (!lic.active) continue;
    const bucket = licensesByEngine.get(lic.engineId) ?? [];
    bucket.push(lic);
    licensesByEngine.set(lic.engineId, bucket);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="inline-flex items-center px-4 py-1.5 rounded-xl text-lg" style={stickerHeading}>
          ENGINES
        </h2>
        <Link
          href="/engines/new"
          className="!no-underline px-4 py-1.5 text-sm"
          style={{
            background: "var(--pink)",
            color: "#fff",
            border: "3px solid var(--ink)",
            borderRadius: 12,
            boxShadow: "3px 3px 0 var(--ink)",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.06em",
          }}
        >
          + BUILD NEW ENGINE
        </Link>
      </div>

      {engineProjects.length > 0 && (
        <Panel title={`IN DEVELOPMENT (${engineProjects.length})`}>
          <div className="space-y-3">
            {engineProjects.map((p) => {
              const current = p.phases[p.currentPhaseIndex]!;
              const overall =
                (p.currentPhaseIndex / p.phases.length) * 100 +
                current.completion / p.phases.length;
              return (
                <div key={p.id} className="p-3" style={cardStyle}>
                  <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                    <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                      {p.plannedName} v{p.plannedVersionNumber}
                    </span>
                    <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      {current.name} · {p.plannedFeatureIds.length} features ·{" "}
                      {p.assignedStaffIds.length} staff
                    </span>
                  </div>
                  <Progress value={overall} showLabel />
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {playerEngines.length > 0 && (
        <Panel title={`YOUR ENGINES (${playerEngines.length})`}>
          <div className="space-y-3">
            {playerEngines.map((e) => {
              const activeLicenses = (licensesByEngine.get(e.id) ?? []).sort(
                (a, b) => b.lifetimeRoyaltiesPaid - a.lifetimeRoyaltiesPaid
              );
              const lifetimeRoyalties = activeLicenses.reduce(
                (s, l) => s + l.lifetimeRoyaltiesPaid,
                0
              );
              const shippedOnEngine = activeLicenses.reduce((s, l) => s + l.projectIds.length, 0);
              return (
                <div key={e.id} className="p-3" style={cardStyle}>
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                          {e.name}
                        </span>
                        <StatusChip status={e.status} />
                      </div>
                      <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                        tier {e.overallTier} · {e.featureIds.length} features · built{" "}
                        {e.releasedYear}
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      {e.status === "public_release" && (
                        <div className="space-y-0.5">
                          <div>
                            <span style={{ color: "var(--ink-soft)" }}>Licensees:</span>{" "}
                            <span className="tabular" style={{ fontWeight: 700 }}>
                              {e.totalLicensees}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: "var(--ink-soft)" }}>Built on:</span>{" "}
                            <span className="tabular" style={{ fontWeight: 700 }}>
                              {e.projectsBuilt}
                            </span>
                          </div>
                          <div style={{ color: "var(--ink-soft)" }}>
                            {formatMoney(e.licenseTerms.licenseFee)} +{" "}
                            {(e.licenseTerms.royaltyRate * 100).toFixed(1)}%
                          </div>
                        </div>
                      )}
                      {e.status === "internal_only" && (
                        <ActionButton
                          tone="teal"
                          disabled={state.studio.cash < (e.publicReleaseCost ?? 0)}
                          onClick={() => {
                            if (
                              confirm(
                                `Publicly release ${e.name}? Cost: ${formatMoney(
                                  e.publicReleaseCost ?? 0
                                )}`
                              )
                            ) {
                              publiclyReleaseEngine(e.id);
                            }
                          }}
                        >
                          PUBLIC RELEASE
                        </ActionButton>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                    {(Object.entries(e.branchTiers) as [string, number][]).map(([branch, tier]) => (
                      <BranchStat key={branch} branch={branch} tier={tier} />
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span
                        style={{
                          color: "var(--ink-soft)",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        CURRENTNESS
                      </span>
                      <span className="tabular" style={{ fontWeight: 700 }}>
                        {e.currentness.toFixed(0)}
                      </span>
                    </div>
                    <Progress
                      value={e.currentness}
                      tone={
                        e.currentness > 70 ? "good" : e.currentness > 40 ? "warn" : "bad"
                      }
                    />
                  </div>

                  {e.status === "public_release" && activeLicenses.length > 0 && (
                    <div
                      className="mt-3 pt-3"
                      style={{ borderTop: "2px dashed var(--cream-2)" }}
                    >
                      <div className="flex justify-between items-baseline text-xs mb-2 flex-wrap gap-2">
                        <span
                          style={{
                            color: "var(--ink-soft)",
                            fontFamily: "var(--font-display)",
                            letterSpacing: "0.06em",
                          }}
                        >
                          ACTIVE LICENSEES ({activeLicenses.length})
                        </span>
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-md tabular"
                          style={{
                            background: "var(--teal)",
                            color: "#fff",
                            border: "2px solid var(--ink)",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {formatMoney(lifetimeRoyalties)} · {shippedOnEngine} shipped
                        </span>
                      </div>
                      <table className="data-table text-xs">
                        <thead>
                          <tr>
                            <th>LICENSEE</th>
                            <th>SHIPPED</th>
                            <th>TERMS</th>
                            <th>LIFETIME ROYALTIES</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeLicenses.map((lic) => {
                            const licensee = state.competitors[lic.licenseeStudioId];
                            const terms = lic.termsSnapshot;
                            return (
                              <tr key={lic.id}>
                                <td style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                                  {licensee?.name ?? "Unknown studio"}
                                </td>
                                <td className="tabular">{lic.projectIds.length}</td>
                                <td className="tabular" style={{ color: "var(--ink-soft)" }}>
                                  {terms.openSource
                                    ? "FREE"
                                    : `${formatMoney(terms.licenseFee)} + ${(
                                        terms.royaltyRate * 100
                                      ).toFixed(1)}%`}
                                </td>
                                <td className="tabular">{formatMoney(lic.lifetimeRoyaltiesPaid)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      <Panel title={`THIRD-PARTY MARKET (${thirdParty.length})`}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ENGINE</th>
              <th>TIER</th>
              <th>FEATURES</th>
              <th>FEE</th>
              <th>ROYALTY</th>
              <th>REPUTATION</th>
            </tr>
          </thead>
          <tbody>
            {thirdParty.map((e) => (
              <tr key={e.id}>
                <td style={{ color: "var(--pink-deep)", fontWeight: 700 }}>{e.name}</td>
                <td className="tabular">T{e.overallTier}</td>
                <td className="tabular">{e.featureIds.length}</td>
                <td className="tabular">
                  {e.licenseTerms.openSource ? (
                    <span
                      className="inline-block px-1.5 py-0.5 rounded-md"
                      style={{
                        background: "var(--teal)",
                        color: "#fff",
                        border: "2px solid var(--ink)",
                        fontWeight: 700,
                      }}
                    >
                      FREE
                    </span>
                  ) : (
                    formatMoney(e.licenseTerms.licenseFee)
                  )}
                </td>
                <td className="tabular">{(e.licenseTerms.royaltyRate * 100).toFixed(1)}%</td>
                <td className="tabular">{e.engineReputation.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
