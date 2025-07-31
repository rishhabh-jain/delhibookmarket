import { PINCODES } from "@/app/data/Pincode";

export type DeliveryInfo = {
  days: number | null;
  note: string;
};

// Preprocess array into a Map for O(1) lookups
const PINCODE_MAP = new Map<number, DeliveryInfo>();

for (const entry of PINCODES) {
  PINCODE_MAP.set(entry.pincode, {
    days: entry.days,
    note: entry.note,
  });
}

export function DeliveryTimeEstimator(
  pincode: string
): DeliveryInfo | { days: null; note: string } {
  const numericPin = parseInt(pincode);

  if (isNaN(numericPin)) {
    return { days: null, note: "Invalid pincode" };
  }

  const deliveryInfo = PINCODE_MAP.get(numericPin);

  if (!deliveryInfo) {
    return { days: null, note: "Pincode not serviceable" };
  }

  return deliveryInfo;
}
