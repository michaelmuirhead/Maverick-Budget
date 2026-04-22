"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import type { Staff, Room } from "@/engine";
import { cn } from "@/lib/format";

// ============ VISUAL CONSTANTS ============
// Tile size on the canvas — one "grid square" in the office layout
const TILE = 40;
const PADDING = 24;

// Palette locked to the game's amber CRT theme
const COLORS = {
  bg: "#0a0805",
  floor: "#1c1810",
  floorGrid: "#2a2214",
  wallDim: "#3d2f15",
  wallBright: "#5a4420",
  // Desk/furniture
  desk: "#4a3820",
  deskTop: "#7a5c30",
  screen: "#1a3344",
  screenOn: "#5ab3ff",
  // Employee body colors by role
  programmer: "#5ab3ff",
  designer: "#ffb000",
  artist: "#ff66cc",
  composer: "#b080ff",
  writer: "#ffd666",
  qa: "#33ff66",
  producer: "#ff8833",
  marketer: "#ff4d99",
  // Status
  morale_low: "#ff4d3d",
  morale_mid: "#ffb000",
  morale_high: "#33ff66",
  energy_low: "#ff4d3d",
  // Decorations
  plant: "#2e7a3c",
  accent: "#ffb000",
  selected: "#ffd666",
};

// ============ EMPLOYEE RENDER STATE ============
// Internal per-employee animation state, derived from game state each frame.
// We keep this in refs (not Zustand) because it changes every animation frame.
interface EmpViz {
  id: string;
  name: string;
  role: string;
  // Target desk position (in pixel coords)
  targetX: number;
  targetY: number;
  // Current animated position
  x: number;
  y: number;
  // Facing direction — affects the little body shape we draw
  facing: "S" | "E" | "W" | "N";
  // Wobble phase (idle bob, typing animation)
  phase: number;
  // Derived visual state
  morale: number;
  energy: number;
  isWorking: boolean;    // has a currentProjectId
  isCrunching: boolean;  // on a phase with crunching=true
  isSelected: boolean;
}

// ============ MAIN COMPONENT ============
export function OfficeCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useGameStore((s) => s.state);

  // Employee viz state (persists across renders via ref)
  const vizRef = useRef<Record<string, EmpViz>>({});
  // Selected employee (for hover/click highlight)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Zoom factor — smaller default on mobile so the full office is visible
  const [zoom, setZoom] = useState(
    typeof window !== "undefined" && window.innerWidth < 640 ? 0.75 : 1
  );

  // Canvas dimensions depend on office grid
  const gridW = state?.office.gridWidth ?? 10;
  const gridH = state?.office.gridHeight ?? 8;
  const canvasW = gridW * TILE + PADDING * 2;
  const canvasH = gridH * TILE + PADDING * 2;

  // ============ ANIMATION LOOP ============
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Device pixel ratio — ensures crisp rendering on retina
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    ctx.scale(dpr, dpr);

    let rafId = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000); // cap at 50ms to avoid huge jumps
      lastTime = now;

      const currentState = useGameStore.getState().state;
      if (currentState) {
        updateEmployees(vizRef.current, currentState, dt, selectedId);
        renderScene(ctx, canvasW, canvasH, currentState.office, vizRef.current, currentState, now);
      }

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [canvasW, canvasH, selectedId]);

  // ============ CLICK HANDLING ============
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Divide by zoom so the click maps back into canvas coordinate space
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    // Find closest employee within 20px
    let closest: string | null = null;
    let closestDist = 22;
    for (const emp of Object.values(vizRef.current)) {
      const d = Math.hypot(emp.x - x, emp.y - y);
      if (d < closestDist) {
        closest = emp.id;
        closestDist = d;
      }
    }
    setSelectedId(closest);
  };

  const selected = selectedId && state ? state.staff[selectedId] : null;

  if (!state) return null;

  return (
    <div className={cn("relative", className)}>
      <div
        className="overflow-auto"
        style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x pan-y", maxHeight: "70vh" }}
      >
        <canvas
          ref={canvasRef}
          onClick={handleClick}
          className="cursor-pointer block"
          style={{
            imageRendering: "pixelated",
            width: canvasW * zoom,
            height: canvasH * zoom,
          }}
        />
      </div>

      {/* Zoom controls */}
      <div className="absolute top-2 left-2 flex gap-1 text-xs">
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
          className="!min-h-[32px] !py-1 !px-2"
          style={{ background: "var(--bg-1)" }}
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
          className="!min-h-[32px] !py-1 !px-2"
          style={{ background: "var(--bg-1)" }}
          aria-label="Zoom in"
        >
          +
        </button>
        <span
          className="px-2 py-1 text-[10px] text-[color:var(--amber-dim)] self-center tabular"
          style={{ background: "var(--bg-1)" }}
        >
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Selected employee card floats over the canvas */}
      {selected && (
        <div
          className="absolute top-2 right-2 panel text-xs w-56"
          style={{ background: "var(--bg-1)" }}
        >
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[color:var(--amber-bright)]">{selected.name}</span>
            <span className="text-[color:var(--amber-dim)] capitalize">{selected.role}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 text-[10px] tabular">
            <div>MORALE</div>
            <div className="text-right">{selected.morale.toFixed(0)}</div>
            <div>ENERGY</div>
            <div className="text-right">{selected.energy.toFixed(0)}</div>
            <div>LOYALTY</div>
            <div className="text-right">{selected.loyalty.toFixed(0)}</div>
            <div>STATUS</div>
            <div className="text-right">
              {selected.currentProjectId ? "working" : "idle"}
            </div>
          </div>
          {selected.traits.length > 0 && (
            <div className="text-[10px] text-[color:var(--amber-dim)] mt-2">
              {selected.traits.slice(0, 3).join(" · ")}
            </div>
          )}
          <button
            onClick={() => setSelectedId(null)}
            className="text-[10px] mt-2 w-full"
          >
            DESELECT
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-[color:var(--amber-dim)]">
        <RoleSwatch color={COLORS.programmer} label="PROG" />
        <RoleSwatch color={COLORS.designer} label="DES" />
        <RoleSwatch color={COLORS.artist} label="ART" />
        <RoleSwatch color={COLORS.composer} label="SND" />
        <RoleSwatch color={COLORS.writer} label="WRT" />
        <RoleSwatch color={COLORS.qa} label="QA" />
        <RoleSwatch color={COLORS.producer} label="PROD" />
        <RoleSwatch color={COLORS.marketer} label="MKT" />
        <span className="ml-auto">Click a character to inspect</span>
      </div>
    </div>
  );
}

function RoleSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{ background: color, border: "1.5px solid var(--ink)" }}
      />
      {label}
    </span>
  );
}

// ============ UPDATE ============
// Sync viz state with game state — add/remove employees, update targets, animate.
function updateEmployees(
  viz: Record<string, EmpViz>,
  state: ReturnType<typeof useGameStore.getState>["state"],
  dt: number,
  selectedId: string | null
): void {
  if (!state) return;

  const employed = Object.values(state.staff).filter((s) => s.status === "employed");
  const employedSet = new Set(employed.map((s) => s.id));

  // Remove viz entries for staff no longer employed
  for (const id of Object.keys(viz)) {
    if (!employedSet.has(id)) delete viz[id];
  }

  // Assign desks deterministically — sorted by hire date so new hires fill empty slots
  const sortedStaff = [...employed].sort((a, b) => (a.hiredOn ?? "").localeCompare(b.hiredOn ?? ""));
  const workstations = computeWorkstations(state.office);

  for (let i = 0; i < sortedStaff.length; i++) {
    const staff = sortedStaff[i]!;
    const station = workstations[i % workstations.length]!;

    // Determine viz state based on staff's actual game state
    const isWorking = staff.currentProjectId !== null;
    let isCrunching = false;
    if (isWorking) {
      const project = state.projects[staff.currentProjectId!];
      if (project) {
        const phase = project.phases[project.currentPhaseIndex];
        if (phase?.crunching) isCrunching = true;
      }
    }

    let target: { x: number; y: number };
    if (isWorking) {
      // Working — sit at your desk
      target = { x: station.x, y: station.y };
    } else {
      // Idle — wander randomly, biased toward the lounge/cafeteria if they exist
      const idleSpot = pickIdleSpot(state.office, i, performance.now() / 10000);
      target = idleSpot ?? { x: station.x + 30, y: station.y + 10 };
    }

    let entry = viz[staff.id];
    if (!entry) {
      // New employee — spawn at their desk immediately
      entry = {
        id: staff.id,
        name: staff.name,
        role: staff.role,
        x: station.x,
        y: station.y,
        targetX: target.x,
        targetY: target.y,
        facing: "S",
        phase: Math.random() * Math.PI * 2,
        morale: staff.morale,
        energy: staff.energy,
        isWorking,
        isCrunching,
        isSelected: selectedId === staff.id,
      };
      viz[staff.id] = entry;
    }

    // Update targets + status
    entry.targetX = target.x;
    entry.targetY = target.y;
    entry.morale = staff.morale;
    entry.energy = staff.energy;
    entry.isWorking = isWorking;
    entry.isCrunching = isCrunching;
    entry.isSelected = selectedId === staff.id;

    // Move toward target at constant speed
    const dx = entry.targetX - entry.x;
    const dy = entry.targetY - entry.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 1) {
      const speed = isWorking ? 40 : 25; // px/sec — working = head straight there, idle = shuffle
      const step = Math.min(speed * dt, dist);
      entry.x += (dx / dist) * step;
      entry.y += (dy / dist) * step;
      // Update facing
      if (Math.abs(dx) > Math.abs(dy)) {
        entry.facing = dx > 0 ? "E" : "W";
      } else {
        entry.facing = dy > 0 ? "S" : "N";
      }
    }

    // Advance animation phase
    entry.phase += dt * (isWorking ? 4 : 2);
  }
}

// ============ LAYOUT HELPERS ============
// Compute pixel positions for every workstation in the office.
function computeWorkstations(office: ReturnType<typeof useGameStore.getState>["state"] extends null ? never : NonNullable<ReturnType<typeof useGameStore.getState>["state"]>["office"]): { x: number; y: number; roomKind: string }[] {
  const stations: { x: number; y: number; roomKind: string }[] = [];
  const workRooms = ["dev_room", "art_room", "audio_booth", "qa_lab", "rnd_lab", "marketing_dept"];

  for (const room of office.rooms) {
    if (!workRooms.includes(room.kind)) continue;
    // Pack desks in a grid within the room
    const cols = Math.max(1, room.width);
    const rows = Math.max(1, room.height);
    const capacity = Math.min(room.capacity, cols * rows);
    let placed = 0;
    for (let r = 0; r < rows && placed < capacity; r++) {
      for (let c = 0; c < cols && placed < capacity; c++) {
        stations.push({
          x: PADDING + (room.x + c + 0.5) * TILE,
          y: PADDING + (room.y + r + 0.5) * TILE,
          roomKind: room.kind,
        });
        placed++;
      }
    }
  }

  // Fallback: if no work rooms yet (garage tier), scatter positions across grid
  if (stations.length === 0) {
    for (let i = 0; i < 4; i++) {
      stations.push({
        x: PADDING + (1 + i) * TILE + TILE * 0.5,
        y: PADDING + 2 * TILE + TILE * 0.5,
        roomKind: "default",
      });
    }
  }

  return stations;
}

// Where idle staff wander — lounge or cafeteria room center, or a walkway
function pickIdleSpot(
  office: ReturnType<typeof useGameStore.getState>["state"] extends null ? never : NonNullable<ReturnType<typeof useGameStore.getState>["state"]>["office"],
  empIdx: number,
  timeSeed: number
): { x: number; y: number } | null {
  const rest = office.rooms.filter((r) => r.kind === "lounge" || r.kind === "cafeteria" || r.kind === "gym");
  if (rest.length === 0) return null;
  const pick = rest[(empIdx + Math.floor(timeSeed)) % rest.length]!;
  // Center of room, with slight offset per employee to avoid stacking
  const jitterX = ((empIdx * 17) % (pick.width * TILE)) - (pick.width * TILE) / 2;
  const jitterY = ((empIdx * 23) % (pick.height * TILE)) - (pick.height * TILE) / 2;
  return {
    x: PADDING + (pick.x + pick.width / 2) * TILE + jitterX * 0.3,
    y: PADDING + (pick.y + pick.height / 2) * TILE + jitterY * 0.3,
  };
}

// ============ RENDERING ============
function renderScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  office: ReturnType<typeof useGameStore.getState>["state"] extends null ? never : NonNullable<ReturnType<typeof useGameStore.getState>["state"]>["office"],
  viz: Record<string, EmpViz>,
  state: ReturnType<typeof useGameStore.getState>["state"],
  now: number
): void {
  // Clear
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, w, h);

  // Office boundary
  const officeW = office.gridWidth * TILE;
  const officeH = office.gridHeight * TILE;
  ctx.fillStyle = COLORS.floor;
  ctx.fillRect(PADDING, PADDING, officeW, officeH);

  // Floor grid (subtle)
  ctx.strokeStyle = COLORS.floorGrid;
  ctx.lineWidth = 1;
  for (let gx = 0; gx <= office.gridWidth; gx++) {
    ctx.beginPath();
    ctx.moveTo(PADDING + gx * TILE, PADDING);
    ctx.lineTo(PADDING + gx * TILE, PADDING + officeH);
    ctx.stroke();
  }
  for (let gy = 0; gy <= office.gridHeight; gy++) {
    ctx.beginPath();
    ctx.moveTo(PADDING, PADDING + gy * TILE);
    ctx.lineTo(PADDING + officeW, PADDING + gy * TILE);
    ctx.stroke();
  }

  // Outer wall
  ctx.strokeStyle = COLORS.wallBright;
  ctx.lineWidth = 2;
  ctx.strokeRect(PADDING, PADDING, officeW, officeH);

  // Rooms
  for (const room of office.rooms) {
    drawRoom(ctx, room);
  }

  // Desks
  const workstations = computeWorkstations(office);
  for (const ws of workstations) {
    drawDesk(ctx, ws.x, ws.y, ws.roomKind);
  }

  // Employees — sort by Y so ones lower on screen draw on top
  const sortedViz = Object.values(viz).sort((a, b) => a.y - b.y);
  for (const emp of sortedViz) {
    drawEmployee(ctx, emp, now);
  }

  // HUD: office stats overlay
  drawHud(ctx, w, h, state);
}

function drawRoom(ctx: CanvasRenderingContext2D, room: Room): void {
  const x = PADDING + room.x * TILE;
  const y = PADDING + room.y * TILE;
  const w = room.width * TILE;
  const h = room.height * TILE;

  // Room floor tint — different rooms get subtly different floor colors
  const tint = ROOM_FLOOR_COLOR[room.kind] ?? COLORS.floor;
  ctx.fillStyle = tint;
  ctx.fillRect(x, y, w, h);

  // Room outline
  ctx.strokeStyle = COLORS.wallDim;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

  // Label in top-left
  ctx.fillStyle = COLORS.wallBright;
  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(room.kind.replace("_", " ").toUpperCase(), x + 4, y + 3);

  // Special props for certain rooms
  if (room.kind === "lounge" || room.kind === "cafeteria") {
    // Plant in corner
    drawPlant(ctx, x + w - 12, y + h - 12);
  }
  if (room.kind === "server_room") {
    // Server rack icon
    ctx.fillStyle = "#5a4420";
    ctx.fillRect(x + w - 20, y + 8, 14, 18);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = (Math.floor(Date.now() / 200 + i) % 2) ? COLORS.screenOn : COLORS.screen;
      ctx.fillRect(x + w - 17, y + 11 + i * 4, 2, 2);
    }
  }
}

const ROOM_FLOOR_COLOR: Record<string, string> = {
  dev_room: "#1f1a10",
  art_room: "#221520",
  audio_booth: "#1a1520",
  qa_lab: "#15201a",
  rnd_lab: "#20201a",
  marketing_dept: "#201a15",
  server_room: "#101820",
  cafeteria: "#201a18",
  lounge: "#1c1f18",
  gym: "#181f1c",
  training_room: "#1a1a22",
  boardroom: "#1f1515",
  legal_biz: "#141a20",
  archive: "#181818",
  mocap_studio: "#150f15",
};

function drawDesk(ctx: CanvasRenderingContext2D, x: number, y: number, roomKind: string): void {
  const dx = x - 14;
  const dy = y + 5;
  // Desk body
  ctx.fillStyle = COLORS.desk;
  ctx.fillRect(dx, dy, 28, 11);
  // Desk top highlight
  ctx.fillStyle = COLORS.deskTop;
  ctx.fillRect(dx, dy, 28, 2);

  // Monitor/device — varies by room
  if (roomKind === "dev_room" || roomKind === "rnd_lab" || roomKind === "qa_lab") {
    // Monitor
    ctx.fillStyle = COLORS.screen;
    ctx.fillRect(dx + 8, dy - 8, 12, 8);
    // Screen glow pulses
    const glow = 0.5 + 0.5 * Math.sin(Date.now() / 300 + x);
    ctx.fillStyle = `rgba(90, 179, 255, ${0.3 + glow * 0.3})`;
    ctx.fillRect(dx + 9, dy - 7, 10, 6);
  } else if (roomKind === "art_room" || roomKind === "mocap_studio") {
    // Tablet
    ctx.fillStyle = "#5a4420";
    ctx.fillRect(dx + 6, dy - 2, 16, 2);
    ctx.fillStyle = "#ff66cc";
    ctx.fillRect(dx + 7, dy - 1, 14, 1);
  } else if (roomKind === "audio_booth") {
    // Mic
    ctx.fillStyle = "#3a3a3a";
    ctx.fillRect(dx + 13, dy - 6, 2, 6);
    ctx.fillStyle = "#7a7a7a";
    ctx.beginPath();
    ctx.arc(dx + 14, dy - 7, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (roomKind === "marketing_dept") {
    // Megaphone/paperwork
    ctx.fillStyle = "#ff4d99";
    ctx.fillRect(dx + 10, dy - 4, 8, 4);
  }
}

function drawEmployee(ctx: CanvasRenderingContext2D, emp: EmpViz, now: number): void {
  const { x, y, facing, phase, morale, energy, isWorking, isCrunching, isSelected } = emp;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(x, y + 10, 7, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Selected ring
  if (isSelected) {
    ctx.strokeStyle = COLORS.selected;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = COLORS.selected;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(x, y + 10, 10, 3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Body — small bobbing motion
  const bob = Math.sin(phase) * (isWorking ? 0.5 : 1.2);
  const bodyY = y + bob;

  // Role color
  const bodyColor = ROLE_COLOR[emp.role] ?? COLORS.designer;

  // Crunching: add red glow behind employee
  if (isCrunching) {
    const pulse = 0.5 + 0.5 * Math.sin(now / 200);
    ctx.shadowColor = COLORS.morale_low;
    ctx.shadowBlur = 6 + pulse * 6;
  }

  // Body
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x - 4, bodyY - 2, 8, 8);

  // Head
  ctx.fillStyle = "#ffd9a8";
  ctx.fillRect(x - 3, bodyY - 9, 6, 6);

  // Hair — simple dark rectangle
  ctx.fillStyle = "#2a1a10";
  ctx.fillRect(x - 3, bodyY - 9, 6, 2);

  // Facing indicator — small mark on body showing direction
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  if (facing === "E") ctx.fillRect(x + 2, bodyY + 1, 2, 2);
  else if (facing === "W") ctx.fillRect(x - 4, bodyY + 1, 2, 2);
  else if (facing === "S") ctx.fillRect(x - 1, bodyY + 4, 2, 1);
  else ctx.fillRect(x - 1, bodyY - 2, 2, 1);

  ctx.shadowBlur = 0;

  // Morale indicator above head — tiny colored pip
  if (morale < 35) {
    ctx.fillStyle = COLORS.morale_low;
  } else if (morale < 65) {
    ctx.fillStyle = COLORS.morale_mid;
  } else {
    ctx.fillStyle = COLORS.morale_high;
  }
  ctx.fillRect(x - 1, bodyY - 12, 2, 2);

  // Low energy — yawn bubble every few seconds
  if (energy < 30 && Math.sin(now / 1500 + phase) > 0.7) {
    ctx.fillStyle = "rgba(255, 176, 0, 0.7)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("z", x + 6, bodyY - 10);
  }

  // Working indicator — typing particles
  if (isWorking && Math.sin(phase * 2) > 0.5) {
    ctx.fillStyle = "rgba(255, 176, 0, 0.5)";
    ctx.fillRect(x - 5 + (phase % 8), bodyY - 4, 1, 1);
  }
}

const ROLE_COLOR: Record<string, string> = {
  programmer: COLORS.programmer,
  designer: COLORS.designer,
  artist: COLORS.artist,
  composer: COLORS.composer,
  writer: COLORS.writer,
  qa: COLORS.qa,
  producer: COLORS.producer,
  marketer: COLORS.marketer,
};

function drawPlant(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // Pot
  ctx.fillStyle = "#5a4420";
  ctx.fillRect(x - 3, y + 3, 6, 4);
  // Leaves
  ctx.fillStyle = COLORS.plant;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1e5a28";
  ctx.fillRect(x - 1, y - 6, 2, 5);
}

function drawHud(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: ReturnType<typeof useGameStore.getState>["state"]
): void {
  if (!state) return;
  const employed = Object.values(state.staff).filter((s) => s.status === "employed");
  const working = employed.filter((s) => s.currentProjectId !== null).length;
  const idle = employed.length - working;

  ctx.fillStyle = "rgba(10, 8, 5, 0.8)";
  ctx.fillRect(w - 130, 8, 120, 40);
  ctx.strokeStyle = COLORS.wallDim;
  ctx.strokeRect(w - 130 + 0.5, 8 + 0.5, 120 - 1, 40 - 1);

  ctx.fillStyle = COLORS.accent;
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`STAFF: ${employed.length}`, w - 125, 14);
  ctx.fillStyle = COLORS.morale_high;
  ctx.fillText(`WORKING: ${working}`, w - 125, 26);
  ctx.fillStyle = COLORS.morale_mid;
  ctx.fillText(`IDLE: ${idle}`, w - 70, 26);
}
