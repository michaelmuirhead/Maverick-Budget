import clsx from "clsx";

export { clsx as cn };

// Format money (stored as cents) with nice commas and $ prefix.
// Examples: 1234567 -> "$12,345.67", 500000000 -> "$5M", 1000000 -> "$10K"
export function formatMoney(cents: number, style: "full" | "short" = "short"): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  if (style === "full") {
    return `${sign}$${(abs / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  const dollars = abs / 100;
  if (dollars >= 1_000_000_000) return `${sign}$${(dollars / 1_000_000_000).toFixed(1)}B`;
  if (dollars >= 1_000_000) return `${sign}$${(dollars / 1_000_000).toFixed(1)}M`;
  if (dollars >= 1_000) return `${sign}$${(dollars / 1_000).toFixed(0)}K`;
  return `${sign}$${dollars.toFixed(0)}`;
}

export function formatNumber(n: number, style: "full" | "short" = "short"): string {
  if (style === "full") return n.toLocaleString("en-US");
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

// "2001-04-23" -> "Apr 23, 2001"
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m!]} ${d}, ${y}`;
}

export function formatDateShort(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}/${y}`;
}
