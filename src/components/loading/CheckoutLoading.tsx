"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle,
  CreditCard,
  Package,
  Sparkles,
  BookOpen,
  Heart,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderData {
  orderId?: string;
  totalAmount?: number;
  itemCount?: number;
  estimatedDelivery?: string;
  customerName?: string;
}

interface CheckoutLoadingModalProps {
  isOpen: boolean;
  isOrderProcessing?: boolean;
  isVerifying?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  orderData?: OrderData;
  errorMessage?: string;
  onClose: () => void;
  onContinueShopping?: () => void;
}

export default function CheckoutLoadingModal({
  isOpen,
  isOrderProcessing = false,
  isVerifying = false,
  isSuccess = false,
  isError = false,
  orderData = {},
  errorMessage,
  onClose,
  onContinueShopping,
}: CheckoutLoadingModalProps) {
  const [currentState, setCurrentState] = useState<
    "processing" | "verifying" | "success" | "error" | "idle"
  >("idle");

  // Determine current state based on props
  useEffect(() => {
    if (isError) {
      setCurrentState("error");
    } else if (isSuccess) {
      setCurrentState("success");
    } else if (isVerifying) {
      setCurrentState("verifying");
    } else if (isOrderProcessing) {
      setCurrentState("processing");
    } else {
      setCurrentState("idle");
    }
  }, [isOrderProcessing, isVerifying, isSuccess, isError]);

  const {
    orderId = "#BH-2024-001",
    totalAmount,
    itemCount,
    estimatedDelivery = "3-5 business days",
    customerName,
  } = orderData;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
              {""}
            </button>

            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-50" />

            {/* Floating books animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-amber-200"
                  initial={{
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                    rotate: Math.random() * 360,
                  }}
                  animate={{
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 8 + Math.random() * 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                >
                  <BookOpen size={20 + Math.random() * 10} />
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {currentState === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center space-y-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-16 h-16 mx-auto"
                      >
                        <Package className="w-16 h-16 text-amber-600" />
                      </motion.div>

                      {/* Sparkles around the icon */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute text-amber-400"
                          style={{
                            left: "50%",
                            top: "50%",
                            transform: `rotate(${i * 45}deg) translateY(-40px)`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                          }}
                        >
                          <Sparkles size={12} />
                        </motion.div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Processing Your Order
                      </h3>
                      <p className="text-gray-600">
                        {customerName ? `Hi ${customerName}! ` : ""}We are
                        carefully preparing your books...
                      </p>
                      {itemCount && (
                        <p className="text-sm text-gray-500">
                          {itemCount} item{itemCount > 1 ? "s" : ""} in your
                          order
                        </p>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "60%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                    </div>

                    {/* Loading dots */}
                    <div className="flex justify-center space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-amber-500 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentState === "verifying" && (
                  <motion.div
                    key="verifying"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center space-y-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotateY: [0, 180, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="w-16 h-16 mx-auto"
                      >
                        <CreditCard className="w-16 h-16 text-green-600" />
                      </motion.div>

                      {/* Pulse effect */}
                      <motion.div
                        className="absolute inset-0 border-2 border-green-400 rounded-full"
                        animate={{
                          scale: [1, 2, 1],
                          opacity: [0.8, 0, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Verifying Payment
                      </h3>
                      <p className="text-gray-600">
                        Securing your transaction...
                      </p>
                      {totalAmount && (
                        <p className="text-lg font-semibold text-gray-800">
                          ${totalAmount.toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        initial={{ width: "60%" }}
                        animate={{ width: "90%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                    </div>

                    {/* Security badges */}
                    <div className="flex justify-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>SSL Encrypted</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Bank Verified</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentState === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center space-y-6"
                  >
                    {/* Success icon with celebration */}
                    <div className="relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                          delay: 0.2,
                        }}
                        className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-12 h-12 text-green-600" />
                      </motion.div>

                      {/* Confetti effect */}
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: [
                              "#f59e0b",
                              "#10b981",
                              "#3b82f6",
                              "#ef4444",
                              "#8b5cf6",
                            ][i % 5],
                            left: "50%",
                            top: "50%",
                          }}
                          initial={{
                            scale: 0,
                            x: 0,
                            y: 0,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            x: (Math.random() - 0.5) * 200,
                            y: (Math.random() - 0.5) * 200,
                            rotate: Math.random() * 360,
                          }}
                          transition={{
                            duration: 2,
                            delay: 0.5 + i * 0.1,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-3"
                    >
                      <h3 className="text-2xl font-bold text-gray-800">
                        {customerName
                          ? `Thank you, ${customerName}!`
                          : "Order Complete!"}
                      </h3>
                      <p className="text-gray-600">
                        Your books are on their way to you
                      </p>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Order #</span>
                          <span className="font-mono font-semibold">
                            {orderId}
                          </span>
                        </div>
                        {totalAmount && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total</span>
                            <span className="font-semibold">
                              ${totalAmount.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Estimated delivery
                          </span>
                          <span className="font-semibold">
                            {estimatedDelivery}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="flex items-center justify-center space-x-2 text-amber-600"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">
                        Thank you for choosing BookHaven!
                      </span>
                      <Heart className="w-4 h-4" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      <Button
                        onClick={onContinueShopping || onClose}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                      >
                        Continue Shopping
                      </Button>
                    </motion.div>
                  </motion.div>
                )}

                {currentState === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center space-y-6"
                  >
                    <div className="relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                        }}
                        className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center"
                      >
                        <X className="w-12 h-12 text-red-600" />
                      </motion.div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Payment Failed
                      </h3>
                      <p className="text-gray-600">
                        {errorMessage ||
                          "There was an issue processing your payment. Please try again."}
                      </p>
                    </div>

                    <Button
                      onClick={onClose}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                    >
                      Try Again
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
