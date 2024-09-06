import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - Your E-commerce Store",
  description: "Terms and Conditions for Your E-commerce Store",
};

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Terms and Conditions
        </h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing and using this website, you accept and agree to be
              bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-xl font-semibold mb-4">2. Use of Website</h2>
            <p className="mb-4">
              You agree to use our website for lawful purposes only and in a way
              that does not infringe the rights of, restrict or inhibit anyone
              else's use and enjoyment of the website.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              3. Product Information
            </h2>
            <p className="mb-4">
              We strive to provide accurate product information, but we do not
              warrant that product descriptions or other content is accurate,
              complete, reliable, current, or error-free.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              4. Pricing and Availability
            </h2>
            <p className="mb-4">
              All prices are subject to change without notice. We reserve the
              right to modify or discontinue any product without notice.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              5. Shipping and Delivery
            </h2>
            <p className="mb-4">
              Shipping and delivery times may vary. We are not responsible for
              delays outside our control.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              6. Returns and Refunds
            </h2>
            <p className="mb-4">
              Please refer to our Returns Policy for information on returns and
              refunds.
            </p>

            <h2 className="text-xl font-semibold mb-4">7. Privacy Policy</h2>
            <p className="mb-4">
              Please review our Privacy Policy, which also governs your visit to
              our website.
            </p>

            <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to update or modify these terms and
              conditions at any time without prior notice.
            </p>

            <p className="mt-8 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
