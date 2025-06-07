"use client";
import ResumeUploadDialog from "@/app/(routes)/dashboard/_components/ResumeUploadDialog";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

function Report({ aiReport }: any) {
  const [openResumeUpload, setOpenResumeUpload] = useState(false);
  const sections = aiReport?.sections ?? {};
  return (
    <div>
      <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            AI Analysis Results
          </h2>
          <Button onClick={() => setOpenResumeUpload(true)}>Re-analyze</Button>
        </div>

        {/* Overall Score */}
        <div className="bg-gray-100 p-5 rounded-xl text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">Overall Score</h3>
          <div className="text-4xl font-bold text-blue-600">
            {aiReport?.overall_score}
            <sup className="text-base">/100</sup>
          </div>
          <p className="text-green-600 font-semibold">
            {aiReport?.overall_feedback}
          </p>
          <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600"
              style={{ width: `${aiReport?.overall_score}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{aiReport?.summary_comment}</p>
        </div>

        {/* Category Scores */}
        <div className="grid grid-cols-2 gap-4 text-center">
          {Object.entries(sections).map(([key, section]: any) => (
            <div
              key={key}
              className={`p-4 rounded-xl ${
                section?.score >= 85
                  ? "bg-green-50"
                  : section.score >= 70
                  ? "bg-yellow-50"
                  : "bg-red-50"
              }`}
            >
              <h4
                className={`text-2xl font-bold ${
                  section?.score >= 85
                    ? "text-green-600"
                    : section?.score >= 70
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {section?.score}%
              </h4>
              <p className="text-sm text-gray-600 capitalize">
                {key.replace("_", " ")}
              </p>
              <p className="text-xs text-gray-500">{section?.comment}</p>
            </div>
          ))}
        </div>

        {/* What's Good */}
        <div className="bg-green-50 p-4 rounded-xl">
          <h4 className="font-semibold text-green-700 mb-2">✅ What's Good</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {aiReport?.whats_good?.map((tip: string, index: number) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* Needs Improvement */}
        <div className="bg-red-50 p-4 rounded-xl">
          <h4 className="font-semibold text-red-700 mb-2">
            ⚠️ Needs Improvement
          </h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {aiReport?.needs_improvement?.map((tip: string, index: number) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* Tips for Improvement */}
        <div className="bg-gray-50 p-4 rounded-xl space-y-2">
          <h4 className="font-semibold text-gray-700">Tips for Improvement</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            {aiReport?.tips_for_improvement?.map(
              (tip: string, index: number) => (
                <li key={index}>{tip}</li>
              )
            )}
          </ul>
        </div>

        <ResumeUploadDialog
          openResumeUpload={openResumeUpload}
          setOpenResumeUpload={() => setOpenResumeUpload(false)}
        />
      </div>
    </div>
  );
}

export default Report;
