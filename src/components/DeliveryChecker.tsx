import React, { useState } from "react";
import { Input } from "./ui/input";
import {
  DeliveryInfo,
  DeliveryTimeEstimator,
} from "@/utils/DeliveryTimeEstimator";
import { Button } from "./ui/button";

export default function DeliveryChecker() {
  const [pincode, setPincode] = useState("");
  const [deliveryData, setDeliveryData] = useState<DeliveryInfo | null>(null);

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Delivery:</h3>
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-3">
            Check Availability At
          </h4>
          <div className="flex flex-col my-1">
            <div className="flex">
              <Input
                type="text"
                placeholder="Enter Pincode/ Zipcode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1"
              />
              <Button
                className="bg-red-500 hover:bg-red-600 text-white px-8"
                onClick={() => {
                  const data = DeliveryTimeEstimator(pincode);
                  setDeliveryData(data);
                }}
              >
                CHECK
              </Button>
            </div>

            {deliveryData && (
              <div className="mt-4 p-4 rounded-lg border bg-gray-50 text-sm text-gray-800">
                <p>
                  <span className="font-semibold text-gray-900">
                    Delivery in:
                  </span>{" "}
                  {deliveryData.days !== null
                    ? `${deliveryData.days} day(s)`
                    : "N/A"}
                </p>
                {deliveryData.note && (
                  <p className="mt-1 text-gray-600">{deliveryData.note}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
