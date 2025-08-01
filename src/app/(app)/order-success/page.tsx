import React, { Suspense } from "react";
import OrderSuccessClient from "./OrderSuccessClient";

export default function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading</div>}>
        <OrderSuccessClient />
      </Suspense>
    </div>
  );
}
