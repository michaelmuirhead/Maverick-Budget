"use client";

import { Panel } from "@/components/ui/Panel";

// Credits + trademarks + legal disclaimer. This is the required notice for
// our real-name publisher / studio / founder roster. Maverick Game Tycoon is
// an unofficial fan project with no affiliation, endorsement, or sponsorship
// by any of the companies or people referenced in the sim. All trademarks
// are property of their respective owners.

const stickerStyle = (bg: string): React.CSSProperties => ({
  background: bg,
  color: "#fff",
  border: "3px solid var(--ink)",
  boxShadow: "4px 4px 0 var(--ink)",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.08em",
});

export default function CreditsPage() {
  return (
    <div className="space-y-4">
      <h2
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-lg"
        style={stickerStyle("var(--purple)")}
      >
        CREDITS &amp; ACKNOWLEDGMENTS
      </h2>

      <Panel title="ABOUT">
        <div className="text-sm space-y-2 leading-relaxed">
          <p>
            <span
              className="inline-block px-2 py-0.5 rounded-lg"
              style={{
                background: "var(--pink)",
                color: "#fff",
                border: "2.5px solid var(--ink)",
                boxShadow: "2px 2px 0 var(--ink)",
                fontFamily: "var(--font-display)",
              }}
            >
              Maverick Game Tycoon
            </span>{" "}
            is a solo-dev fan project — a love letter to the studios, publishers, and people who
            built the video game industry from 1980 onward.
          </p>
          <p style={{ color: "var(--ink-soft)" }}>
            This project is not a commercial product and is distributed as a personal simulator.
          </p>
        </div>
      </Panel>

      <Panel title="FAN PROJECT DISCLAIMER">
        <div className="text-sm space-y-3 leading-relaxed">
          <p>
            Maverick Game Tycoon references the names of real video game publishers, development
            studios, and their founders for historical flavor. This game is{" "}
            <span
              className="inline-block px-1.5 py-0.5 rounded-md"
              style={{
                background: "var(--mustard)",
                color: "var(--ink)",
                border: "2px solid var(--ink)",
                fontWeight: 700,
              }}
            >
              not affiliated with, endorsed by, sponsored by, or officially connected to
            </span>{" "}
            any of the companies, products, or individuals named in the sim.
          </p>
          <p style={{ color: "var(--ink-soft)" }}>
            All company names, product names, trademarks, and registered trademarks referenced in
            this game are the property of their respective owners. Use of these names is intended
            as historical reference only and does not imply any association with or endorsement by
            the trademark holders.
          </p>
          <p style={{ color: "var(--ink-soft)" }}>
            Founding years, headquarters locations, and founders&rsquo; names are drawn from public
            historical records. Financial figures, strategies, and in-game behavior are simulated
            for gameplay balance and should not be interpreted as reflecting any real
            company&rsquo;s actual performance, strategy, or decisions.
          </p>
          <p style={{ color: "var(--ink-soft)" }}>
            Ownership relationships modeled in the sim (for example, a studio being shown as owned
            by a publisher) reflect a canonical modern-era snapshot and may not accurately
            represent the ownership status at every historical moment.
          </p>
          <p>
            If you represent a company referenced here and would like changes or removal, please
            reach out.
          </p>
        </div>
      </Panel>

      <Panel title="INSPIRATION & THANKS">
        <div className="text-sm space-y-2 leading-relaxed">
          <p>
            Deep admiration for{" "}
            <span style={{ color: "var(--teal-deep)", fontWeight: 700 }}>Game Dev Tycoon</span>,{" "}
            <span style={{ color: "var(--teal-deep)", fontWeight: 700 }}>Mad Games Tycoon</span>,
            and every documentary, postmortem, oral history, and retrospective that made the shape
            of this industry legible to an outsider.
          </p>
          <p style={{ color: "var(--ink-soft)" }}>
            The roster of 25 studios and 18 publishers in this sim is a highly compressed snapshot
            of a much larger industry. Many extraordinary studios are absent simply because space
            is finite; no slight is intended.
          </p>
        </div>
      </Panel>

      <Panel title="BUILT WITH">
        <div className="flex flex-wrap gap-2 text-xs">
          {["Next.js 14", "TypeScript", "Zustand", "Tailwind CSS", "Paytone One", "Fredoka"].map(
            (tool) => (
              <span
                key={tool}
                className="inline-block px-2.5 py-1 rounded-lg"
                style={{
                  background: "var(--cream-2)",
                  color: "var(--ink)",
                  border: "2.5px solid var(--ink)",
                  boxShadow: "2px 2px 0 var(--ink)",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.04em",
                }}
              >
                {tool}
              </span>
            )
          )}
        </div>
      </Panel>
    </div>
  );
}
