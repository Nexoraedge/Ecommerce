'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import ShippingForm from '@/components/checkout/ShippingForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PromoCode from '@/components/checkout/PromoCode';

type Step = {
  id: string;
  name: string;
  status: 'complete' | 'current' | 'upcoming';
};

const steps: Step[] = [
  { id: '01', name: 'Shipping', status: 'current' },
  { id: '02', name: 'Payment', status: 'upcoming' },
  { id: '03', name: 'Confirmation', status: 'upcoming' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const handleShippingSubmit = async (data: any) => {
    // In a real application, you would:
    // 1. Validate the shipping information
    // 2. Save it to your backend
    // 3. Move to the payment step
    console.log('Shipping data:', data);
    
    // Update steps
    const updatedSteps = steps.map((step) => ({
      ...step,
      status:
        step.id === '01'
          ? 'complete'
          : step.id === '02'
          ? 'current'
          : 'upcoming',
    }));

    // Move to payment step (in a real app, this would be a separate component)
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
            <div className="lg:col-span-7">
              {/* Checkout steps */}
              <div className="mb-8">
                <CheckoutSteps steps={steps} />
              </div>

              {/* Shipping form */}
              {currentStep === 1 && (
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                  <h2 className="text-lg font-medium text-foreground mb-6">
                    Shipping Information
                  </h2>
                  <ShippingForm onSubmit={handleShippingSubmit} />
                </div>
              )}

              {/* Payment form would go here */}
              {currentStep === 2 && (
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                  <h2 className="text-lg font-medium text-foreground mb-6">
                    Payment Method
                  </h2>
                  <p className="text-muted-foreground">
                    Payment integration would go here (e.g., Stripe)
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              {/* Order summary */}
              <div className="mt-10 lg:mt-0">
                <OrderSummary />
                <PromoCode />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
