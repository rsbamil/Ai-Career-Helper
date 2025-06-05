import React from "react";

const questionList = [
  "What is the best way to get a job",
  "How do i get a job",
];
function EmptyState({ selectedQuestion }: any) {
  return (
    <div>
      <h2 className="text-xl font-bold text-center mt-4">
        Ask Anything to Ai Career Agent
      </h2>
      <div>
        {questionList.map((q, index) => {
          return (
            <h2
              key={index}
              onClick={() => selectedQuestion(q)}
              className="text-center p-4 border rounded-lg my-3 hover:border-primary cursor-pointer transition-all duration-300"
            >
              {q}
            </h2>
          );
        })}
      </div>
    </div>
  );
}

export default EmptyState;
