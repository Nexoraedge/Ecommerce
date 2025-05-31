'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const shippingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  address: z.string().min(5, 'Address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
}

export default function ShippingForm({ onSubmit }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-foreground"
          >
            First name
          </label>
          <input
            type="text"
            id="firstName"
            {...register('firstName')}
            placeholder="Enter your first name" className={`mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-muted-foreground/60 ${
              errors.firstName ? 'border-red-500' : ''
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-foreground"
          >
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            {...register('lastName')}
            placeholder="Enter your first name" className={`mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-muted-foreground/60 ${
              errors.lastName ? 'border-red-500' : ''
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            placeholder="Enter your first name" className={`mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-muted-foreground/60 ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-foreground"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            placeholder="Enter your first name" className={`mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-muted-foreground/60 ${
              errors.phone ? 'border-red-500' : ''
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-foreground"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          {...register('address')}
          placeholder="Enter your first name" className={`mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-muted-foreground/60 ${
            errors.address ? 'border-red-500' : ''
          }`}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="apartment"
          className="block text-sm font-medium text-foreground"
        >
          Apartment, suite, etc. (optional)
        </label>
        <input
          type="text"
          id="apartment"
          {...register('apartment')}
          placeholder="Apartment, suite, etc. (optional)" className="mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-foreground"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            {...register('city')}
            placeholder="Enter your first name" className={`mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-muted-foreground/60 ${
              errors.city ? 'border-red-500' : ''
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-foreground"
          >
            State
          </label>
          <input
            type="text"
            id="state"
            {...register('state')}
            placeholder="Enter your first name" className={`mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-muted-foreground/60 ${
              errors.state ? 'border-red-500' : ''
            }`}
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="zipCode"
            className="block text-sm font-medium text-foreground"
          >
            ZIP Code
          </label>
          <input
            type="text"
            id="zipCode"
            {...register('zipCode')}
            placeholder="Enter your first name" className={`mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-muted-foreground/60 ${
              errors.zipCode ? 'border-red-500' : ''
            }`}
          />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="country"
          className="block text-sm font-medium text-foreground"
        >
          Country
        </label>
        <select
          id="country"
          {...register('country')}
          className={`mt-1 block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-muted-foreground/60 ${
            errors.country ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select a country</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="UK">United Kingdom</option>
          <option value="AU">Australia</option>
          <option value="IN">India</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          {/* Add more countries as needed */}
        </select>
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
        )}
      </div>

      <div className="mt-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : 'Continue to Payment'}
        </motion.button>
      </div>
    </form>
  );
}
