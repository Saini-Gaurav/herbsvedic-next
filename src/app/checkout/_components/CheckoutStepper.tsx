type StepKey = "address" | "review" | "payment";

const steps: { key: StepKey; label: string }[] = [
  { key: "address", label: "Address" },
  { key: "review", label: "Review" },
  { key: "payment", label: "Payment" },
];

export default function CheckoutStepper({ currentStep }: { currentStep: StepKey }) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-semibold ${
                index <= currentIndex ? "bg-canopy text-sand" : "bg-bark/10 text-bark/40"
              }`}
            >
              {index + 1}
            </span>
            <span className={`font-body text-sm ${index <= currentIndex ? "text-bark" : "text-bark/40"}`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && <span className="w-8 h-px bg-bark/20" />}
        </div>
      ))}
    </div>
  );
}