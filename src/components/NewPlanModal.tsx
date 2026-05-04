import { useState, type FormEvent } from "react";
import type { User } from "firebase/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sheet } from "@/components/ui/Sheet";
import { createHousehold, setActiveHousehold } from "@/lib/household";
import type {
  CurrencyPlacement,
  DateFormat,
  NumberFormat,
} from "@/types/schema";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
  /** Switch the user's active household to the new one after create. Defaults to true. */
  setActiveAfterCreate?: boolean;
}

const CURRENCIES: { code: string; label: string }[] = [
  { code: "USD", label: "US Dollar — USD" },
  { code: "CAD", label: "Canadian Dollar — CAD" },
  { code: "EUR", label: "Euro — EUR" },
  { code: "GBP", label: "British Pound — GBP" },
  { code: "AUD", label: "Australian Dollar — AUD" },
  { code: "MXN", label: "Mexican Peso — MXN" },
  { code: "JPY", label: "Japanese Yen — JPY" },
  { code: "INR", label: "Indian Rupee — INR" },
  { code: "BRL", label: "Brazilian Real — BRL" },
  { code: "ZAR", label: "South African Rand — ZAR" },
];

const NUMBER_FORMATS: { value: NumberFormat; label: string }[] = [
  { value: "1,234.56", label: "123,456.78" },
  { value: "1.234,56", label: "123.456,78" },
  { value: "1,23,456.78", label: "1,23,456.78" },
];

const DATE_FORMATS: { value: DateFormat; label: string }[] = [
  { value: "MM/DD/YYYY", label: "12/30/2026" },
  { value: "DD/MM/YYYY", label: "30/12/2026" },
  { value: "YYYY-MM-DD", label: "2026-12-30" },
];

export function NewPlanModal({
  open,
  onClose,
  user,
  setActiveAfterCreate = true,
}: Props) {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [currencyPlacement, setCurrencyPlacement] =
    useState<CurrencyPlacement>("before");
  const [numberFormat, setNumberFormat] = useState<NumberFormat>("1,234.56");
  const [dateFormat, setDateFormat] = useState<DateFormat>("MM/DD/YYYY");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setName("");
    setCurrency("USD");
    setCurrencyPlacement("before");
    setNumberFormat("1,234.56");
    setDateFormat("MM/DD/YYYY");
    setError(null);
    setSubmitting(false);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Give your plan a name.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const household = await createHousehold({
        name,
        ownerUid: user.uid,
        ownerDisplayName: user.displayName,
        ownerEmail: user.email,
        ownerPhotoURL: user.photoURL,
        currency,
        currencyPlacement,
        numberFormat,
        dateFormat,
      });
      if (setActiveAfterCreate) {
        await setActiveHousehold(user.uid, household.id);
      }
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create plan.");
      setSubmitting(false);
    }
  }

  // Live preview of how money + dates will look with the picked options.
  const previewAmount = currencyPlacement === "before" ? "$123,456.78" : "123,456.78$";
  const previewExample =
    numberFormat === "1.234,56"
      ? previewAmount.replace("123,456.78", "123.456,78")
      : numberFormat === "1,23,456.78"
        ? previewAmount.replace("123,456.78", "1,23,456.78")
        : previewAmount;

  return (
    <Sheet open={open} onClose={onClose} title="New Plan">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Plan Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="The Doe Family"
          autoFocus
        />

        <div className="grid grid-cols-2 gap-3">
          <Picker
            label="Currency"
            value={currency}
            onChange={setCurrency}
            options={CURRENCIES.map((c) => ({ value: c.code, label: c.label }))}
          />
          <Picker
            label="Currency Placement"
            value={currencyPlacement}
            onChange={(v) => setCurrencyPlacement(v as CurrencyPlacement)}
            options={[
              { value: "before", label: `Before amount (${preview(currency, "before")})` },
              { value: "after", label: `After amount (${preview(currency, "after")})` },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Picker
            label="Number Format"
            value={numberFormat}
            onChange={(v) => setNumberFormat(v as NumberFormat)}
            options={NUMBER_FORMATS.map((n) => ({ value: n.value, label: n.label }))}
          />
          <Picker
            label="Date Format"
            value={dateFormat}
            onChange={(v) => setDateFormat(v as DateFormat)}
            options={DATE_FORMATS.map((d) => ({ value: d.value, label: d.label }))}
          />
        </div>

        <div className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/10 text-xs text-white/60">
          Preview: <span className="font-mono text-white">{previewExample}</span>
        </div>

        {error ? (
          <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">
            {error}
          </div>
        ) : null}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              reset();
              onClose();
            }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting} fullWidth>
            Create Plan
          </Button>
        </div>
      </form>
    </Sheet>
  );
}

/** Tiny preview of a currency symbol's placement, e.g. "$1.23" / "1.23$". */
function preview(currency: string, placement: CurrencyPlacement): string {
  const symbol =
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((p) => p.type === "currency")?.value ?? currency;
  return placement === "before" ? `${symbol}1.23` : `1.23${symbol}`;
}

interface PickerProps<T extends string> {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}

function Picker<T extends string>({ label, value, onChange, options }: PickerProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-white/70">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="min-h-[44px] rounded-xl bg-white/5 px-3 py-3 text-base text-white ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
