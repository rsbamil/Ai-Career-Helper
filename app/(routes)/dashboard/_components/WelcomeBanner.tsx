import { Button } from "@/components/ui/button";
import React from "react";

function WelcomeBanner() {
  return (
    <div className="p-5 bg-gradient-to-tr from-[rgb(190,87,95)] via-[#A338E3] to-[#AC76D6] rounded-lg">
      <h2 className="font-bold text-2xl text-white">Ai Career Helper</h2>
      <p className="text-white py-3">
        Smarter Career decisions start here - get tailored , real-time market
        data, insights and advice for your career.
      </p>
      <Button variant="outline">Let's Get Started</Button>
    </div>
  );
}

export default WelcomeBanner;
