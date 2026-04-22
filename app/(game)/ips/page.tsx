"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { Panel } from "@/components/ui/Panel";
import { Progress } from "@/components/ui/Progress";
import { formatDate, formatMoney } from "@/lib/format";
import { GENRE_BY_ID, THEME_BY_ID, IP_NAME_MAX_LENGTH } from "@/engine";
import type { GameState, IP } from "@/engine";
import { FranchiseLineage } from "@/components/ips/FranchiseLineage";

const stickerHeading: React.CSSProperties = {
  background: "var(--purple)",
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
  title,
  children,
}: {
  tone?: "teal" | "pink" | "mustard" | "default";
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
      className="px-3 py-1 text-xs"
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

export default function IPsPage() {
  const state = useGameStore((s) => s.state);
  const rebootIp = useGameStore((s) => s.rebootIp);
  const licenseIpOut = useGameStore((s) => s.licenseIpOut);
  const renameIp = useGameStore((s) => s.renameIp);

  if (!state) return null;

  const ips = Object.values(state.ips);
  const owned = ips.filter((ip) => !ip.licensedOut);
  const licensed = ips.filter((ip) => ip.licensedOut);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="inline-flex items-center px-4 py-1.5 rounded-xl text-lg" style={stickerHeading}>
          INTELLECTUAL PROPERTY
        </h2>
        <span
          className="inline-flex items-center px-3 py-1 rounded-lg text-xs"
          style={{
            background: "var(--cream-2)",
            color: "var(--ink)",
            border: "2.5px solid var(--ink)",
            boxShadow: "3px 3px 0 var(--ink)",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.06em",
          }}
        >
          {owned.length} OWNED · {licensed.length} LICENSED OUT
        </span>
      </div>

      {ips.length === 0 ? (
        <Panel>
          <div className="py-12 text-center" style={{ color: "var(--ink-soft)" }}>
            No IPs yet. Successful releases automatically establish a franchise you can build
            sequels on, reboot, or license out.
          </div>
        </Panel>
      ) : (
        <>
          {owned.length > 0 && (
            <Panel title={`OWNED FRANCHISES (${owned.length})`}>
              <div className="space-y-3">
                {owned.map((ip) => (
                  <IpRow
                    key={ip.id}
                    ip={ip}
                    state={state}
                    onReboot={() => rebootIp(ip.id)}
                    onLicense={() => licenseIpOut(ip.id)}
                    onRename={(newName) => renameIp(ip.id, newName)}
                  />
                ))}
              </div>
            </Panel>
          )}

          {licensed.length > 0 && (
            <Panel title={`LICENSED OUT (${licensed.length})`}>
              <div className="space-y-3">
                {licensed.map((ip) => (
                  <LicensedRow key={ip.id} ip={ip} />
                ))}
              </div>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}

function IpRow({
  ip,
  state,
  onReboot,
  onLicense,
  onRename,
}: {
  ip: IP;
  state: GameState;
  onReboot: () => void;
  onLicense: () => void;
  onRename: (newName: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(ip.name);

  const sequelCount = ip.projectIds.length - 1;
  const fatigueTone: "good" | "warn" | "bad" =
    ip.fatigue >= 70 ? "bad" : ip.fatigue >= 40 ? "warn" : "good";
  const affinityTone: "good" | "warn" | "bad" =
    ip.fanAffinity >= 60 ? "good" : ip.fanAffinity >= 30 ? "warn" : "bad";

  const canReboot = ip.fatigue >= 50;

  function commitRename() {
    const trimmed = draft.trim();
    if (trimmed.length > 0 && trimmed !== ip.name) onRename(trimmed);
    setEditing(false);
  }

  function cancelRename() {
    setDraft(ip.name);
    setEditing(false);
  }

  return (
    <div className="p-3" style={cardStyle}>
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex items-center gap-2 flex-wrap">
              <input
                autoFocus
                type="text"
                value={draft}
                maxLength={IP_NAME_MAX_LENGTH}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename();
                  if (e.key === "Escape") cancelRename();
                }}
                className="flex-1 px-2 py-0.5 outline-none"
                style={{
                  background: "var(--cream-2)",
                  color: "var(--pink-deep)",
                  border: "2.5px solid var(--ink)",
                  borderRadius: 8,
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                }}
              />
              <ActionButton tone="teal" onClick={commitRename}>
                SAVE
              </ActionButton>
              <ActionButton onClick={cancelRename}>CANCEL</ActionButton>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ color: "var(--pink-deep)", fontWeight: 700, fontSize: "1rem" }}>
                {ip.name}
              </span>
              <button
                onClick={() => {
                  setDraft(ip.name);
                  setEditing(true);
                }}
                title="Rename this franchise. Shipped games keep their original titles."
                className="text-[10px] underline underline-offset-2"
                style={{ color: "var(--ink-soft)", background: "transparent", border: "none", padding: 0, boxShadow: "none" }}
              >
                rename
              </button>
            </div>
          )}
          <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
            {GENRE_BY_ID[ip.genreId]?.name ?? ip.genreId} ·{" "}
            {THEME_BY_ID[ip.themeId]?.name ?? ip.themeId} ·{" "}
            {sequelCount === 0
              ? "no sequels yet"
              : `${sequelCount} sequel${sequelCount === 1 ? "" : "s"}`}
          </div>
        </div>
        <div
          className="rounded-xl px-3 py-1.5 text-right"
          style={{
            background: "var(--teal)",
            color: "#fff",
            border: "2.5px solid var(--ink)",
            boxShadow: "3px 3px 0 var(--ink)",
          }}
        >
          <div
            className="tabular text-sm"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            {formatMoney(ip.lifetimeRevenue)}
          </div>
          <div className="text-[10px] opacity-80" style={{ letterSpacing: "0.06em" }}>
            LIFETIME
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <div
            className="text-[10px] mb-1"
            style={{
              color: "var(--ink-soft)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.06em",
            }}
          >
            FAN AFFINITY
          </div>
          <Progress value={ip.fanAffinity} tone={affinityTone} showLabel />
        </div>
        <div>
          <div
            className="text-[10px] mb-1"
            style={{
              color: "var(--ink-soft)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.06em",
            }}
          >
            FRANCHISE FATIGUE
          </div>
          <Progress value={ip.fatigue} tone={fatigueTone} showLabel />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] mb-3 flex-wrap gap-2" style={{ color: "var(--ink-soft)" }}>
        <div>
          Peak score:{" "}
          <span className="tabular" style={{ color: "var(--ink)", fontWeight: 700 }}>
            {ip.peakScore || "—"}
          </span>
          {" · "}
          Last release:{" "}
          <span className="tabular" style={{ color: "var(--ink)", fontWeight: 700 }}>
            {formatDate(ip.lastReleaseDate)}
          </span>
          {ip.rebootCount ? (
            <>
              {" · "}
              <span
                className="inline-block px-1.5 py-0.5 rounded-md"
                style={{
                  background: "var(--mustard)",
                  color: "var(--ink)",
                  border: "2px solid var(--ink)",
                  fontWeight: 700,
                }}
              >
                {ip.rebootCount} reboot{ip.rebootCount === 1 ? "" : "s"}
              </span>
            </>
          ) : null}
        </div>
      </div>

      <FranchiseLineage ip={ip} state={state} />

      <div className="flex items-center gap-2 flex-wrap">
        <ActionButton
          tone="mustard"
          onClick={onReboot}
          disabled={!canReboot}
          title={
            canReboot
              ? "Reset fatigue at the cost of some fan affinity"
              : "Reboots only make sense once fatigue is high (50+)"
          }
        >
          REBOOT
        </ActionButton>
        <ActionButton
          tone="teal"
          onClick={onLicense}
          title="License this IP to a third-party studio for upfront cash + annual royalties"
        >
          LICENSE OUT
        </ActionButton>
      </div>
    </div>
  );
}

function LicensedRow({ ip }: { ip: IP }) {
  const revokeIpLicense = useGameStore((s) => s.revokeIpLicense);
  return (
    <div className="p-3 flex items-start justify-between gap-4 flex-wrap" style={cardStyle}>
      <div className="flex-1 min-w-0">
        <div style={{ color: "var(--pink-deep)", fontWeight: 700 }}>{ip.name}</div>
        <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
          {GENRE_BY_ID[ip.genreId]?.name ?? ip.genreId} ·{" "}
          {THEME_BY_ID[ip.themeId]?.name ?? ip.themeId}
        </div>
        <div className="text-[11px] mt-1" style={{ color: "var(--ink-soft)" }}>
          {ip.licenseStartDate && <>From {formatDate(ip.licenseStartDate)}</>}
          {ip.licenseEndDate && <> through {formatDate(ip.licenseEndDate)}</>}
        </div>
      </div>
      <div className="text-right space-y-1.5">
        <div
          className="inline-block px-2 py-0.5 rounded-md text-xs"
          style={{
            background: "var(--teal)",
            color: "#fff",
            border: "2px solid var(--ink)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
          }}
        >
          {ip.licenseFeePerYear ? `${formatMoney(ip.licenseFeePerYear)} / yr` : "—"}
        </div>
        <div>
          <ActionButton tone="pink" onClick={() => revokeIpLicense(ip.id)}>
            END DEAL
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
