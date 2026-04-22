"use client";

import { useMemo, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { formatDate, formatMoney } from "@/lib/format";
import {
  GENRE_BY_ID,
  GENRES,
  IMPRINT_FOUNDING_COST,
  IMPRINT_STARTING_CASH,
  IMPRINT_STARTING_REPUTATION,
  suggestedDealTerms,
} from "@/engine";
import type {
  Publisher, PublishingDeal, PublisherTier, GenreId, Competitor,
  CompetitorPublishingDeal,
} from "@/engine";
import Link from "next/link";

type Tab = "offers" | "directory" | "owned" | "imprint";
type SortKey = "tier" | "name" | "foundedYear" | "reputation" | "cash" | "marketCap";

const TIER_ORDER: Record<string, number> = { mega: 0, major: 1, mid_major: 2, indie_label: 3 };
const TIER_LABEL: Record<string, string> = {
  mega: "Mega",
  major: "Major",
  mid_major: "Mid-major",
  indie_label: "Indie label",
};

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

function TabPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs"
      style={{
        background: active ? "var(--pink)" : "var(--cream)",
        color: active ? "#fff" : "var(--ink)",
        border: "3px solid var(--ink)",
        borderRadius: 999,
        boxShadow: active ? "3px 3px 0 var(--ink)" : "2px 2px 0 var(--ink)",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.06em",
      }}
    >
      {children}
    </button>
  );
}

function ActionButton({
  tone = "default",
  disabled,
  onClick,
  title,
  children,
}: {
  tone?: "teal" | "pink" | "default";
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
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
      title={title}
      className="px-2.5 py-1 text-xs"
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

function TierChip({ tier }: { tier: Publisher["tier"] }) {
  const bg =
    tier === "mega"
      ? "var(--purple)"
      : tier === "major"
        ? "var(--teal)"
        : tier === "mid_major"
          ? "var(--mustard)"
          : "var(--cream-2)";
  const color = tier === "indie_label" ? "var(--ink)" : "#fff";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[10px] whitespace-nowrap"
      style={{
        background: bg,
        color,
        border: "2px solid var(--ink)",
        borderRadius: 8,
        fontFamily: "var(--font-display)",
        letterSpacing: "0.06em",
      }}
    >
      {TIER_LABEL[tier] ?? tier}
    </span>
  );
}

export default function PublishersPage() {
  const state = useGameStore((s) => s.state);
  const acceptPublishingDeal = useGameStore((s) => s.acceptPublishingDeal);
  const declinePublishingDeal = useGameStore((s) => s.declinePublishingDeal);
  const acquirePublisher = useGameStore((s) => s.acquirePublisher);
  const foundPublisherImprint = useGameStore((s) => s.foundPublisherImprint);
  const signCompetitorToImprint = useGameStore((s) => s.signCompetitorToImprint);
  const [tab, setTab] = useState<Tab>("directory");
  const [sortKey, setSortKey] = useState<SortKey>("tier");

  if (!state) return null;

  const offers = Object.values(state.publishingDeals).filter((d) => d.status === "offered");
  const activeDeals = Object.values(state.publishingDeals).filter((d) => d.status === "active");
  const allPublishers = Object.values(state.publishers);
  const activePublishers = allPublishers.filter((p) => p.status === "active");
  const ownedPublishers = allPublishers.filter(
    (p) => p.status === "acquired" && p.ownerStudioId === state.studio.id
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="inline-flex items-center px-4 py-1.5 rounded-xl text-lg" style={stickerHeading}>
          PUBLISHERS
        </h2>
        <div className="ml-auto flex gap-2 flex-wrap">
          <TabPill active={tab === "offers"} onClick={() => setTab("offers")}>
            OFFERS ({offers.length})
          </TabPill>
          <TabPill active={tab === "directory"} onClick={() => setTab("directory")}>
            DIRECTORY ({activePublishers.length})
          </TabPill>
          <TabPill active={tab === "owned"} onClick={() => setTab("owned")}>
            OWNED ({ownedPublishers.length})
          </TabPill>
          <TabPill active={tab === "imprint"} onClick={() => setTab("imprint")}>
            MY IMPRINT
          </TabPill>
        </div>
      </div>

      {tab === "offers" && (
        <>
          {activeDeals.length > 0 && (
            <Panel title={`ACTIVE DEALS (${activeDeals.length})`}>
              <div className="space-y-3">
                {activeDeals.map((d) => {
                  const pub = state.publishers[d.publisherId]!;
                  const project = state.projects[d.projectId];
                  return (
                    <div key={d.id} className="p-3" style={cardStyle}>
                      <div className="flex justify-between items-baseline gap-4 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <TierChip tier={pub.tier} />
                          <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                            {pub.name}
                          </span>
                          <span style={{ color: "var(--ink-soft)" }}>×</span>
                          <Link href={`/projects/${d.projectId}`} className="!no-underline">
                            {project?.name ?? "—"}
                          </Link>
                        </div>
                        <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
                          Share: <span className="tabular" style={{ color: "var(--ink)" }}>{(d.revenueShare * 100).toFixed(0)}%</span>
                          {" · "}Collected: <span className="tabular" style={{ color: "var(--ink)" }}>{formatMoney(d.revenueCollected)}</span>
                        </div>
                      </div>
                      {d.metacriticBonusAmount && d.metacriticBonusThreshold && (
                        <div className="text-xs mt-2">
                          <span style={{ color: "var(--ink-soft)" }}>Metacritic bonus: </span>
                          <span
                            className="inline-block px-1.5 py-0.5 rounded-md"
                            style={{
                              background: d.bonusPaid ? "var(--teal)" : "var(--mustard)",
                              color: d.bonusPaid ? "#fff" : "var(--ink)",
                              border: "2px solid var(--ink)",
                              fontWeight: 700,
                            }}
                          >
                            {formatMoney(d.metacriticBonusAmount)} at {d.metacriticBonusThreshold}+
                            {d.bonusPaid && " ✓ PAID"}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Panel>
          )}

          <Panel title={`PENDING OFFERS (${offers.length})`}>
            {offers.length === 0 ? (
              <div className="py-6 text-center" style={{ color: "var(--ink-soft)" }}>
                No outstanding offers. Publishers send offers when you start a new project.
              </div>
            ) : (
              <div className="space-y-3">
                {offers.map((d) => (
                  <OfferRow
                    key={d.id}
                    deal={d}
                    publisher={state.publishers[d.publisherId]!}
                    projectName={state.projects[d.projectId]?.name ?? "—"}
                    onAccept={() => acceptPublishingDeal(d.id)}
                    onDecline={() => declinePublishingDeal(d.id)}
                  />
                ))}
              </div>
            )}
          </Panel>
        </>
      )}

      {tab === "directory" && (
        <>
          <Panel title={`PUBLISHER DIRECTORY (${activePublishers.length})`}>
            <table className="data-table">
              <thead>
                <tr>
                  <SortHeader label="PUBLISHER" k="name" current={sortKey} onClick={setSortKey} />
                  <SortHeader label="TIER" k="tier" current={sortKey} onClick={setSortKey} />
                  <th>CITY</th>
                  <SortHeader label="FOUNDED" k="foundedYear" current={sortKey} onClick={setSortKey} />
                  <SortHeader label="REP" k="reputation" current={sortKey} onClick={setSortKey} />
                  <SortHeader label="CASH" k="cash" current={sortKey} onClick={setSortKey} />
                  <th>SHARE</th>
                  <SortHeader label="MARKET CAP" k="marketCap" current={sortKey} onClick={setSortKey} />
                  <th>STUDIOS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sortPublishers(activePublishers, sortKey).map((p) => {
                  const price = Math.round(p.marketCap * 1.15);
                  const canAcquire = state.studio.cash >= price;
                  const ownedStudios = p.ownedStudioIds
                    .map((id) => state.competitors[id])
                    .filter((c): c is NonNullable<typeof c> => Boolean(c));
                  const studioTooltip =
                    ownedStudios.length > 0
                      ? ownedStudios.map((c) => c.name).join(", ")
                      : "No owned studios";
                  return (
                    <tr key={p.id}>
                      <td style={{ color: "var(--pink-deep)", fontWeight: 700 }}>{p.name}</td>
                      <td>
                        <TierChip tier={p.tier} />
                      </td>
                      <td style={{ color: "var(--ink-soft)" }}>{p.hqCity}</td>
                      <td className="tabular" style={{ color: "var(--ink-soft)" }}>{p.foundedYear}</td>
                      <td className="tabular">{p.reputation.toFixed(0)}</td>
                      <td className="tabular">{formatMoney(p.cash)}</td>
                      <td className="tabular" style={{ color: "var(--ink-soft)" }}>
                        {(p.baseRevenueShare * 100).toFixed(0)}%
                      </td>
                      <td className="tabular">{formatMoney(p.marketCap)}</td>
                      <td className="tabular text-xs" title={studioTooltip}>
                        {ownedStudios.length > 0 ? (
                          <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                            {ownedStudios.length}
                          </span>
                        ) : (
                          <span className="opacity-40">—</span>
                        )}
                      </td>
                      <td>
                        <ActionButton
                          tone="teal"
                          disabled={!canAcquire}
                          onClick={() => {
                            if (confirm(`Acquire ${p.name} for ${formatMoney(price)}?`)) {
                              acquirePublisher(p.id);
                            }
                          }}
                          title={
                            canAcquire
                              ? `Acquire for ${formatMoney(price)}`
                              : `Need ${formatMoney(price)}`
                          }
                        >
                          BUY
                        </ActionButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Panel>

          {(() => {
            const signedDeals = Object.values(state.publishingDeals)
              .filter((d) => d.status === "active" || d.status === "completed")
              .slice()
              .sort((a, b) =>
                (b.acceptedOn ?? b.offeredOn).localeCompare(a.acceptedOn ?? a.offeredOn)
              )
              .slice(0, 20);
            if (signedDeals.length === 0) return null;
            return (
              <Panel title={`RECENT DEALS (${signedDeals.length})`}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>PUBLISHER</th>
                      <th>GAME</th>
                      <th>SHARE</th>
                      <th>ADVANCE</th>
                      <th>COLLECTED</th>
                      <th>SIGNED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signedDeals.map((d) => {
                      const pub = state.publishers[d.publisherId];
                      const project = state.projects[d.projectId];
                      return (
                        <tr key={d.id}>
                          <td style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                            {pub?.name ?? "—"}
                          </td>
                          <td>
                            {project ? (
                              <Link href={`/projects/${project.id}`} className="!no-underline">
                                {project.name}
                              </Link>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="tabular">{(d.revenueShare * 100).toFixed(0)}%</td>
                          <td className="tabular">{formatMoney(d.advanceAmount)}</td>
                          <td className="tabular">{formatMoney(d.revenueCollected)}</td>
                          <td className="tabular" style={{ color: "var(--ink-soft)" }}>
                            {d.acceptedOn ? formatDate(d.acceptedOn) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Panel>
            );
          })()}
        </>
      )}

      {tab === "imprint" && (
        <ImprintTab
          state={state}
          onFound={(input) => foundPublisherImprint(input)}
          onSign={(input) => signCompetitorToImprint(input)}
        />
      )}

      {tab === "owned" && (
        <Panel title={`OWNED PUBLISHERS (${ownedPublishers.length})`}>
          {ownedPublishers.length === 0 ? (
            <div className="py-6 text-center" style={{ color: "var(--ink-soft)" }}>
              You don&rsquo;t own any publishers yet. Acquire them from the Directory tab once you
              have the capital.
            </div>
          ) : (
            <div className="space-y-3">
              {ownedPublishers.map((p) => {
                const ownedStudios = p.ownedStudioIds
                  .map((id) => state.competitors[id])
                  .filter((c): c is NonNullable<typeof c> => Boolean(c));
                return (
                  <div key={p.id} className="p-3" style={cardStyle}>
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <TierChip tier={p.tier} />
                          <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                            {p.name}
                          </span>
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                          {p.hqCity} · founded {p.foundedYear}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                          Prefers:{" "}
                          <span style={{ color: "var(--ink)" }}>
                            {p.preferredGenres.map((g) => GENRE_BY_ID[g]?.name ?? g).join(", ")}
                          </span>
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                          Acquired: {p.acquiredOn ? formatDate(p.acquiredOn) : "—"}
                        </div>
                        {ownedStudios.length > 0 && (
                          <div className="text-xs mt-1">
                            <span style={{ color: "var(--ink-soft)" }}>Owned studios: </span>
                            <span style={{ color: "var(--ink)", fontWeight: 600 }}>
                              {ownedStudios.map((c) => c.name).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0 text-xs space-y-0.5">
                        <StatLine label="Cash" value={formatMoney(p.cash)} highlight />
                        <StatLine label="Lifetime rev" value={formatMoney(p.lifetimeRevenue)} />
                        <StatLine label="Rep" value={p.reputation.toFixed(0)} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}

// ============ IMPRINT TAB (#114) ============
// Player-owned publishing imprint: found one if you don't have it; otherwise
// see your imprint stats, sign competitor studios to deals, and watch active
// deals progress.
function ImprintTab({
  state,
  onFound,
  onSign,
}: {
  state: NonNullable<ReturnType<typeof useGameStore.getState>["state"]>;
  onFound: (input: { name: string; hqCity: string; tier: PublisherTier; preferredGenres: GenreId[] }) => void;
  onSign: (input: { publisherId: string; competitorId: string; advanceAmount: number; revenueShare: number }) => void;
}) {
  // The first player-imprint we find drives the UI (one imprint per studio
  // for now; #115 sub-labels will let us expand to multiples later).
  const imprint = useMemo(
    () =>
      Object.values(state.publishers).find(
        (p) => p.status === "acquired" && p.ownerStudioId === state.studio.id,
      ),
    [state.publishers, state.studio.id],
  );

  if (!imprint) {
    return <FoundImprintPanel state={state} onFound={onFound} />;
  }

  return <ManageImprintPanel state={state} imprint={imprint} onSign={onSign} />;
}

function FoundImprintPanel({
  state,
  onFound,
}: {
  state: NonNullable<ReturnType<typeof useGameStore.getState>["state"]>;
  onFound: (input: { name: string; hqCity: string; tier: PublisherTier; preferredGenres: GenreId[] }) => void;
}) {
  const [name, setName] = useState("");
  const [hqCity, setHqCity] = useState(state.studio.name + " HQ");
  const [tier, setTier] = useState<PublisherTier>("indie_label");
  const [preferred, setPreferred] = useState<GenreId[]>([]);

  const cost = IMPRINT_FOUNDING_COST[tier];
  const startingCash = IMPRINT_STARTING_CASH[tier];
  const startingRep = IMPRINT_STARTING_REPUTATION[tier];
  const canAfford = state.studio.cash >= cost;
  const nameTrimmed = name.trim();
  const nameOk = nameTrimmed.length > 0;
  const nameTaken = nameOk
    && Object.values(state.publishers).some(
      (p) => p.name.toLowerCase() === nameTrimmed.toLowerCase(),
    );
  const submittable = canAfford && nameOk && !nameTaken;

  const toggleGenre = (g: GenreId) => {
    setPreferred((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  return (
    <Panel title="FOUND A PUBLISHING IMPRINT">
      <div className="space-y-4">
        <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
          Open your own publishing label to sign competitor studios and take a cut of their releases.
          Your imprint compounds catalog revenue passively (just like the big publishers do).
          You can later acquire other labels separately from the Directory tab.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="IMPRINT NAME">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`${state.studio.name} Publishing`}
              className="w-full px-2 py-1.5 text-sm"
              style={inputStyle}
            />
            {nameTaken && (
              <div className="text-xs mt-1" style={{ color: "var(--pink-deep)" }}>
                That name is already in use.
              </div>
            )}
          </Field>
          <Field label="HQ CITY">
            <input
              value={hqCity}
              onChange={(e) => setHqCity(e.target.value)}
              className="w-full px-2 py-1.5 text-sm"
              style={inputStyle}
            />
          </Field>
        </div>

        <Field label="TIER">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["indie_label", "mid_major", "major", "mega"] as PublisherTier[]).map((t) => {
              const active = t === tier;
              const c = IMPRINT_FOUNDING_COST[t];
              const affordable = state.studio.cash >= c;
              return (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className="px-2 py-2 text-xs text-left"
                  style={{
                    background: active ? "var(--pink)" : "var(--cream)",
                    color: active ? "#fff" : "var(--ink)",
                    border: "2.5px solid var(--ink)",
                    borderRadius: 12,
                    boxShadow: "3px 3px 0 var(--ink)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.05em",
                    opacity: !active && !affordable ? 0.55 : 1,
                  }}
                >
                  <div>{TIER_LABEL[t]}</div>
                  <div className="text-[10px] mt-1 tabular" style={{ opacity: 0.85 }}>
                    {formatMoney(c)}
                  </div>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="PREFERRED GENRES (optional)">
          <div className="flex gap-1.5 flex-wrap">
            {GENRES.map((g) => {
              const active = preferred.includes(g.id as GenreId);
              return (
                <button
                  key={g.id}
                  onClick={() => toggleGenre(g.id as GenreId)}
                  className="px-2 py-0.5 text-xs"
                  style={{
                    background: active ? "var(--teal)" : "var(--cream-2)",
                    color: active ? "#fff" : "var(--ink)",
                    border: "2px solid var(--ink)",
                    borderRadius: 999,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid grid-cols-3 gap-2">
          <OfferStat label="FOUNDING COST" value={formatMoney(cost)} highlight />
          <OfferStat label="STARTING TREASURY" value={formatMoney(startingCash)} />
          <OfferStat label="STARTING REP" value={`${startingRep}`} />
        </div>

        <div className="flex justify-end pt-1">
          <ActionButton
            tone="teal"
            disabled={!submittable}
            onClick={() => onFound({ name: nameTrimmed, hqCity: hqCity.trim() || `${state.studio.name} HQ`, tier, preferredGenres: preferred })}
            title={
              !canAfford
                ? `Need ${formatMoney(cost)}`
                : nameTaken
                  ? "Pick a different name"
                  : !nameOk
                    ? "Enter a name"
                    : `Found for ${formatMoney(cost)}`
            }
          >
            FOUND IMPRINT — {formatMoney(cost)}
          </ActionButton>
        </div>
      </div>
    </Panel>
  );
}

function ManageImprintPanel({
  state,
  imprint,
  onSign,
}: {
  state: NonNullable<ReturnType<typeof useGameStore.getState>["state"]>;
  imprint: Publisher;
  onSign: (input: { publisherId: string; competitorId: string; advanceAmount: number; revenueShare: number }) => void;
}) {
  // Pool of competitors that are currently signable: active, no other active
  // imprint deal in flight, not already a sub of this imprint.
  const activeDeals = Object.values(state.competitorPublishingDeals);
  const lockedCompetitorIds = new Set(
    activeDeals.filter((d) => d.status === "active").map((d) => d.competitorId),
  );
  const eligibleCompetitors = useMemo(
    () =>
      Object.values(state.competitors)
        .filter((c) => c.status === "active" && !lockedCompetitorIds.has(c.id))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [state.competitors, lockedCompetitorIds],
  );

  const [selectedCompId, setSelectedCompId] = useState<string>(eligibleCompetitors[0]?.id ?? "");
  const selected = state.competitors[selectedCompId];

  // Suggested defaults from the engine when the selection changes.
  const suggested = useMemo(
    () => (selected ? suggestedDealTerms(selected, imprint) : null),
    [selected, imprint],
  );
  const [advance, setAdvance] = useState(suggested?.advance ?? 10_000_000);
  const [share, setShare] = useState(suggested?.revenueShare ?? 0.35);

  // Resync when competitor changes
  const competitorKey = selectedCompId + ":" + imprint.id;
  const [lastKey, setLastKey] = useState(competitorKey);
  if (competitorKey !== lastKey) {
    setLastKey(competitorKey);
    if (suggested) {
      setAdvance(suggested.advance);
      setShare(suggested.revenueShare);
    }
  }

  const advanceDollars = Math.round(advance / 100);
  const canAfford = state.studio.cash >= advance;

  const ourActive = activeDeals
    .filter((d) => d.publisherId === imprint.id && d.status === "active")
    .sort((a, b) => b.signedDate.localeCompare(a.signedDate));
  const ourHistory = activeDeals
    .filter((d) => d.publisherId === imprint.id && d.status !== "active")
    .sort((a, b) => b.signedDate.localeCompare(a.signedDate))
    .slice(0, 25);

  return (
    <div className="space-y-4">
      {/* Imprint summary card */}
      <Panel title="MY IMPRINT">
        <div className="p-3" style={cardStyle}>
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <TierChip tier={imprint.tier} />
                <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>{imprint.name}</span>
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                {imprint.hqCity} · founded {imprint.foundedYear}
              </div>
              {imprint.preferredGenres.length > 0 && (
                <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                  Prefers:{" "}
                  <span style={{ color: "var(--ink)" }}>
                    {imprint.preferredGenres.map((g) => GENRE_BY_ID[g]?.name ?? g).join(", ")}
                  </span>
                </div>
              )}
            </div>
            <div className="text-right shrink-0 text-xs space-y-0.5">
              <StatLine label="Treasury" value={formatMoney(imprint.cash)} highlight />
              <StatLine label="Lifetime rev" value={formatMoney(imprint.lifetimeRevenue)} />
              <StatLine label="Reputation" value={imprint.reputation.toFixed(0)} />
              <StatLine label="Active signings" value={ourActive.length.toString()} />
            </div>
          </div>
        </div>
      </Panel>

      {/* Sign-a-studio form */}
      <Panel title="SIGN A STUDIO">
        {eligibleCompetitors.length === 0 ? (
          <div className="py-6 text-center" style={{ color: "var(--ink-soft)" }}>
            No competitors available to sign right now.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
              Pay an upfront advance for the rights to publish a competitor&rsquo;s next release.
              When they ship, your cut comes off the top of their lifetime revenue and lands in
              your treasury (and your studio cash). If they don&rsquo;t ship within 18 months, the
              advance is a sunk cost.
            </div>

            <Field label="STUDIO">
              <select
                value={selectedCompId}
                onChange={(e) => setSelectedCompId(e.target.value)}
                className="w-full px-2 py-1.5 text-sm"
                style={inputStyle}
              >
                {eligibleCompetitors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.strategy} — Cash {formatMoney(c.cash)} · Rep {c.reputation.toFixed(0)}
                  </option>
                ))}
              </select>
            </Field>

            {selected && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={`ADVANCE — ${formatMoney(advance)}`}>
                  <input
                    type="range"
                    min={1_000_000}
                    max={Math.max(state.studio.cash, 100_000_000)}
                    step={1_000_000}
                    value={advance}
                    onChange={(e) => setAdvance(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-[10px] mt-1" style={{ color: "var(--ink-soft)" }}>
                    Their cash: {formatMoney(selected.cash)} · suggests $
                    {Math.round((suggested?.advance ?? 0) / 100).toLocaleString()}
                  </div>
                </Field>
                <Field label={`YOUR REVENUE SHARE — ${(share * 100).toFixed(0)}%`}>
                  <input
                    type="range"
                    min={0.05}
                    max={0.7}
                    step={0.01}
                    value={share}
                    onChange={(e) => setShare(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-[10px] mt-1" style={{ color: "var(--ink-soft)" }}>
                    {share <= 0.25
                      ? "Generous to them — easier accept"
                      : share >= 0.55
                        ? "Predatory — almost certain decline"
                        : "Standard range"}
                  </div>
                </Field>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <ActionButton
                tone="teal"
                disabled={!selected || !canAfford || advanceDollars <= 0}
                onClick={() =>
                  selected &&
                  onSign({
                    publisherId: imprint.id,
                    competitorId: selected.id,
                    advanceAmount: advance,
                    revenueShare: share,
                  })
                }
                title={
                  !canAfford
                    ? `Need ${formatMoney(advance)}`
                    : `Make offer of ${formatMoney(advance)} for ${(share * 100).toFixed(0)}% of next release`
                }
              >
                MAKE OFFER
              </ActionButton>
            </div>
          </div>
        )}
      </Panel>

      {/* Active deals */}
      <Panel title={`ACTIVE SIGNINGS (${ourActive.length})`}>
        {ourActive.length === 0 ? (
          <div className="py-6 text-center" style={{ color: "var(--ink-soft)" }}>
            No studios currently signed. Use the form above to propose a deal.
          </div>
        ) : (
          <div className="space-y-2">
            {ourActive.map((d) => (
              <ImprintDealRow key={d.id} deal={d} state={state} />
            ))}
          </div>
        )}
      </Panel>

      {/* History */}
      {ourHistory.length > 0 && (
        <Panel title={`DEAL HISTORY (${ourHistory.length})`}>
          <table className="data-table">
            <thead>
              <tr>
                <th>STUDIO</th>
                <th>STATUS</th>
                <th>ADVANCE</th>
                <th>SHARE</th>
                <th>COLLECTED</th>
                <th>SIGNED</th>
              </tr>
            </thead>
            <tbody>
              {ourHistory.map((d) => {
                const c = state.competitors[d.competitorId];
                return (
                  <tr key={d.id}>
                    <td style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
                      {c?.name ?? "—"}
                    </td>
                    <td>
                      <DealStatusChip status={d.status} />
                    </td>
                    <td className="tabular">{formatMoney(d.advanceAmount)}</td>
                    <td className="tabular">{(d.revenueShare * 100).toFixed(0)}%</td>
                    <td className="tabular">{formatMoney(d.revenueCollected)}</td>
                    <td className="tabular" style={{ color: "var(--ink-soft)" }}>
                      {formatDate(d.signedDate)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}

function ImprintDealRow({
  deal,
  state,
}: {
  deal: CompetitorPublishingDeal;
  state: NonNullable<ReturnType<typeof useGameStore.getState>["state"]>;
}) {
  const competitor: Competitor | undefined = state.competitors[deal.competitorId];
  return (
    <div className="p-3" style={cardStyle}>
      <div className="flex justify-between items-baseline gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>
            {competitor?.name ?? "—"}
          </span>
          <span style={{ color: "var(--ink-soft)" }} className="text-xs">
            advance {formatMoney(deal.advanceAmount)} · cut {(deal.revenueShare * 100).toFixed(0)}%
          </span>
        </div>
        <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
          Signed <span className="tabular" style={{ color: "var(--ink)" }}>{formatDate(deal.signedDate)}</span>
          {" · expires "}
          <span className="tabular" style={{ color: "var(--ink)" }}>{formatDate(deal.expiresDate)}</span>
        </div>
      </div>
    </div>
  );
}

function DealStatusChip({ status }: { status: CompetitorPublishingDeal["status"] }) {
  const bg =
    status === "fulfilled"
      ? "var(--teal)"
      : status === "expired"
        ? "var(--mustard)"
        : status === "declined"
          ? "var(--cream-2)"
          : "var(--pink)";
  const color = status === "expired" || status === "declined" ? "var(--ink)" : "#fff";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[10px] whitespace-nowrap"
      style={{
        background: bg,
        color,
        border: "2px solid var(--ink)",
        borderRadius: 8,
        fontFamily: "var(--font-display)",
        letterSpacing: "0.06em",
      }}
    >
      {status.toUpperCase()}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        className="text-[10px] mb-1"
        style={{
          color: "var(--ink-soft)",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--cream)",
  border: "2.5px solid var(--ink)",
  borderRadius: 10,
  color: "var(--ink)",
  fontFamily: "var(--font-body)",
  boxShadow: "2px 2px 0 var(--ink)",
};

function StatLine({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <span style={{ color: "var(--ink-soft)" }}>{label}:</span>{" "}
      <span
        className="tabular"
        style={{ color: highlight ? "var(--pink-deep)" : "var(--ink)", fontWeight: 600 }}
      >
        {value}
      </span>
    </div>
  );
}

// ============ OFFER ROW ============
function OfferRow({
  deal: d,
  publisher: pub,
  projectName,
  onAccept,
  onDecline,
}: {
  deal: PublishingDeal;
  publisher: Publisher;
  projectName: string;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="p-3" style={cardStyle}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <TierChip tier={pub.tier} />
            <span style={{ color: "var(--pink-deep)", fontWeight: 700 }}>{pub.name}</span>
            <span style={{ color: "var(--ink-soft)" }}>wants to publish</span>
            <span style={{ color: "var(--ink)", fontWeight: 700 }}>{projectName}</span>
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
            {pub.hqCity} · Reputation {pub.reputation.toFixed(0)}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            <OfferStat label="ADVANCE" value={formatMoney(d.advanceAmount)} highlight />
            <OfferStat label="MARKETING" value={formatMoney(d.marketingBudget)} />
            <OfferStat label="THEIR SHARE" value={`${(d.revenueShare * 100).toFixed(0)}%`} />
            <OfferStat label="EXPIRES" value={formatDate(d.expiresOn)} />
          </div>
          {d.metacriticBonusAmount && d.metacriticBonusThreshold && (
            <div className="text-xs mt-3" style={{ color: "var(--ink-soft)" }}>
              Bonus:{" "}
              <span
                className="inline-block px-1.5 py-0.5 rounded-md"
                style={{
                  background: "var(--teal)",
                  color: "#fff",
                  border: "2px solid var(--ink)",
                  fontWeight: 700,
                }}
              >
                {formatMoney(d.metacriticBonusAmount)}
              </span>{" "}
              if game scores {d.metacriticBonusThreshold}+ on Metacritic
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <ActionButton tone="pink" onClick={onDecline}>
            DECLINE
          </ActionButton>
          <ActionButton tone="teal" onClick={onAccept}>
            ACCEPT
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

function OfferStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-xl px-2.5 py-1.5"
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
        {label}
      </div>
      <div
        className="tabular text-sm"
        style={{ color: highlight ? "var(--pink-deep)" : "var(--ink)", fontWeight: 700 }}
      >
        {value}
      </div>
    </div>
  );
}

// ============ DIRECTORY HELPERS ============
function sortPublishers(list: Publisher[], key: SortKey): Publisher[] {
  const copy = list.slice();
  copy.sort((a, b) => {
    switch (key) {
      case "tier":
        return (
          TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.foundedYear - b.foundedYear
        );
      case "name":
        return a.name.localeCompare(b.name);
      case "foundedYear":
        return a.foundedYear - b.foundedYear;
      case "reputation":
        return b.reputation - a.reputation;
      case "cash":
        return b.cash - a.cash;
      case "marketCap":
        return b.marketCap - a.marketCap;
    }
  });
  return copy;
}

function SortHeader({
  label,
  k,
  current,
  onClick,
}: {
  label: string;
  k: SortKey;
  current: SortKey;
  onClick: (k: SortKey) => void;
}) {
  const active = current === k;
  return (
    <th>
      <button
        onClick={() => onClick(k)}
        className="text-xs !p-0 !border-0 !bg-transparent"
        style={{
          color: active ? "var(--pink-deep)" : "var(--ink-soft)",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.08em",
          boxShadow: "none",
        }}
      >
        {label}
        {active ? " ▾" : ""}
      </button>
    </th>
  );
}
