"use client";

import { useState } from "react";
import { MessageCircle, Instagram, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Chaty() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleWhatsAppClick = () => {
    // Replace with your WhatsApp number
    const phoneNumber = "+918588856833";
    const message = "Hello! I'm interested in your services.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleInstagramClick = () => {
    // Replace with your Instagram username
    const instagramUsername = "delhibookmarket.in";
    const instagramUrl = `https://instagram.com/${instagramUsername}`;
    window.open(instagramUrl, "_blank");
  };

  const handleCallClick = () => {
    // Replace with your phone number
    const phoneNumber = "8588856833";
    window.location.href = `tel:${phoneNumber}`;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded Buttons */}
      {isExpanded && (
        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-2 duration-300">
          {/* Call Button */}
          <Button
            onClick={handleCallClick}
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 p-0"
            aria-label="Call us"
          >
            <Phone className="h-7 w-7 text-white" />
          </Button>

          {/* WhatsApp Button */}
          <Button
            onClick={handleWhatsAppClick}
            className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 p-0"
            aria-label="Contact us on WhatsApp"
          >
            <MessageCircle className="h-7 w-7 text-white" />
          </Button>

          {/* Instagram Button */}
          <Button
            onClick={handleInstagramClick}
            className="h-14 w-14 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:from-[#7A2FB3] hover:via-[#E91A1A] hover:to-[#F56A2F] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 p-0"
            aria-label="Follow us on Instagram"
          >
            <Instagram className="h-7 w-7 text-white" />
          </Button>
        </div>
      )}

      {/* Main Toggle Button */}
      <Button
        onClick={toggleExpanded}
        className="h-16 w-16 rounded-full bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 p-0"
        aria-label={isExpanded ? "Close social menu" : "Open social menu"}
      >
        {isExpanded ? (
          <X className="h-8 w-8 text-white transition-transform duration-200" />
        ) : (
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        )}
      </Button>
    </div>
  );
}
