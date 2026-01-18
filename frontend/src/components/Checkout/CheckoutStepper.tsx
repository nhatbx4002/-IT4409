import { Check } from "lucide-react";

interface CheckoutStepperProps {
  currentStep: "information" | "payment";
}

const steps = [
  { id: "cart", label: "Cart", completed: true },
  { id: "information", label: "Information", completed: false },
  { id: "payment", label: "Payment", completed: false },
  { id: "complete", label: "Complete", completed: false },
];

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const getStepIndex = (stepId: string) => {
    return steps.findIndex((s) => s.id === stepId);
  };

  const currentIndex = getStepIndex(currentStep);
  const cartIndex = getStepIndex("cart");

  return (
    <div className="flex items-center justify-center gap-4">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex || step.id === "cart";
        const isCurrent = step.id === currentStep;
        const isPast = index < currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                  isCompleted
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {isCompleted && step.id !== "cart" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCurrent ? "text-black" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-0.5 w-16 transition ${
                  isPast ? "bg-black" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

