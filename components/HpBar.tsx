type Props = { value: number; max: number; label: string; color?: string };

export default function HpBar({ value, max, label, color = "var(--color-red)" }: Props) {
  const pct = max > 0 ? Math.max(0, value / max) * 100 : 0;
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between font-mono text-xs text-dim">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="h-5 border-[3px] border-ink p-[3px]">
        <div className="h-full transition-[width] duration-500 ease-out" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
