import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Join Community Section */}
      <div className="bg-gray-800 py-12 text-center">
        <h2 className="text-teal-400 text-xl font-semibold tracking-wider mb-6">
          JOIN THE COMMUNITY
        </h2>
        <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full">
          <Send className="w-6 h-6 text-gray-800" />
        </div>
      </div>

      {/* Wavy Border */}
      <div className="relative">
        <svg
          className="w-full h-6 text-gray-800"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-teal-400 font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm">
              <p>Sector 55, Gurgaon - 122003</p>
              <p>Call us: +91 8588856833</p>
              <p>Email us - support@delhibookmarket.in</p>
              <p>Cancel Order</p>
              <p>Whatsapp Us - 8588856833</p>
            </div>
          </div>

          {/* Find it fast */}
          <div>
            <h3 className="text-teal-400 font-semibold mb-4">Find it fast</h3>
            <div className="space-y-2 text-sm">
              <p className="hover:text-teal-400 cursor-pointer">FAQS</p>
              <p className="hover:text-teal-400 cursor-pointer">All Books</p>
              <p className="hover:text-teal-400 cursor-pointer">
                Track your order
              </p>
              <p className="hover:text-teal-400 cursor-pointer">Wishlist</p>
              <p className="hover:text-teal-400 cursor-pointer">
                BULK ORDER / DROPSHIPPING
              </p>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-teal-400 font-semibold mb-4">Customer Care</h3>
            <div className="space-y-2 text-sm">
              <p className="hover:text-teal-400 cursor-pointer">My Account</p>
              <p className="hover:text-teal-400 cursor-pointer">
                Contact us on Insta
              </p>
              <p className="hover:text-teal-400 cursor-pointer">Email us</p>
              <p className="hover:text-teal-400 cursor-pointer">My orders</p>
              <p className="hover:text-teal-400 cursor-pointer">About Us</p>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-teal-400 font-semibold mb-4">Policies</h3>
            <div className="space-y-2 text-sm">
              <p className="hover:text-teal-400 cursor-pointer">
                Returns and Refunds policy
              </p>
              <p className="hover:text-teal-400 cursor-pointer">
                Shipping Policy
              </p>
              <p className="hover:text-teal-400 cursor-pointer">
                Privacy Policy
              </p>
              <p className="hover:text-teal-400 cursor-pointer">
                Terms and Conditions
              </p>
              <p className="hover:text-teal-400 cursor-pointer">
                Cancellation Policy
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 pt-8 border-t border-gray-700">
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-md"
          >
            ⊗ Cancel Order
          </Button>
          <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md">
            ⊙ Track Order
          </Button>
        </div>
      </div>
    </footer>
  );
}
