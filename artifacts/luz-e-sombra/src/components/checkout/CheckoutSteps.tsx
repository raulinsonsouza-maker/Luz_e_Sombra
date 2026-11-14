const STEPS = [
  { n: 1 as const, label: "Sobre você" },
  { n: 2 as const, label: "Seu acesso" },
  { n: 3 as const, label: "Pagamento" },
];

type Props = {
  current: 1 | 2 | 3;
};

export default function CheckoutSteps({ current }: Props) {
  return (
    <nav aria-label="Etapas do cadastro" className="mb-6">
      <ol className="grid grid-cols-3 gap-2">
        {STEPS.map((step) => {
          const done = current > step.n;
          const active = current === step.n;
          return (
            <li key={step.n} className="flex flex-col items-center gap-1.5 text-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: done || active ? "rgba(200,165,107,0.22)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${
                    done || active ? "rgba(200,165,107,0.55)" : "rgba(200,165,107,0.18)"
                  }`,
                  color: done || active ? "#e8d5b0" : "rgba(247,242,236,0.4)",
                }}
                aria-current={active ? "step" : undefined}
              >
                {done ? "✓" : step.n}
              </div>
              <span
                className="text-[10px] sm:text-[11px] font-medium leading-tight"
                style={{ color: active ? "#f7f2ec" : "rgba(247,242,236,0.4)" }}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "rgba(200,165,107,0.12)" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${((current - 1) / (STEPS.length - 1)) * 100}%`,
            background: "linear-gradient(90deg, #9c7742, #c8a56b)",
          }}
        />
      </div>
    </nav>
  );
}
