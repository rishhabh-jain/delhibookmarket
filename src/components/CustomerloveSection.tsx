import { Truck, ClipboardCheck, Headphones } from "lucide-react";

export default function Component() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Why Over 50K+ Customers Love
        <br />
        Delhi Book Market
      </h2>

      <div className="space-y-6 mb-8">
        {/* Fast Shipping */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Fast Shipping
            </h3>
            <p className="text-sm text-gray-600">
              From best couriers like xpressbees and bluedart
            </p>
          </div>
        </div>

        {/* Quality Assured Products */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Quality Assured Products
            </h3>
            <p className="text-sm text-gray-600">
              All products go through rigorous testing ensure that our customers
              recieve the highest quality products.
            </p>
          </div>
        </div>

        {/* Passionate Customer Service */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Headphones className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Passionate Customer Service
            </h3>
            <p className="text-sm text-gray-600">
              Call us at +91 8588856833 between 10:00 AM - 6:00 PM local time
              for any support
            </p>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex justify-center gap-6 text-sm text-gray-500">
        <a href="#" className="hover:text-gray-700 transition-colors">
          Refund Policy
        </a>
        <a href="#" className="hover:text-gray-700 transition-colors">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-gray-700 transition-colors">
          Terms of Service
        </a>
      </div>
    </div>
  );
}
