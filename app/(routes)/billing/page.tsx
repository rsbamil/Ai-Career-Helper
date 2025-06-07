import { PricingTable } from "@clerk/nextjs";
import React from "react";

function Billing() {
  return (
    <div>
      <h2 className="font-bold text-3xl text-center">Choose Your Plan</h2>
      <p className="text-lg text-center">
        Select a subscription bundle to get all AI Tools Access{" "}
      </p>
      <div className="flex justify-center items-center mt-10 gap-2 ">
        <PricingTable />
      </div>
    </div>
  );
}

export default Billing;
