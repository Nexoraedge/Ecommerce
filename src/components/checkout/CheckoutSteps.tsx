import { Check } from 'lucide-react';

type Step = {
  id: string;
  name: string;
  status: 'complete' | 'current' | 'upcoming';
};

interface CheckoutStepsProps {
  steps: Step[];
}

export default function CheckoutSteps({ steps }: CheckoutStepsProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="md:flex-1">
            <div
              className={`group pl-4 py-2 flex flex-col border-l-4 ${
                step.status === 'complete'
                  ? 'border-black'
                  : step.status === 'current'
                  ? 'border-blue-600'
                  : 'border-gray-200'
              } md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0`}
            >
              <span
                className={`text-xs font-semibold tracking-wide uppercase ${
                  step.status === 'complete'
                    ? 'text-black'
                    : step.status === 'current'
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                {step.id}
              </span>
              <span className="text-sm font-medium">{step.name}</span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
