import React, { useState, useEffect } from "react";
import { FaCheck, FaForward } from "react-icons/fa";
import { shuffleArray } from "../utils/shuffle";
import { questions as originalQuestions } from "../utils/questions";

const Quiz = ({ onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [timer, setTimer] = useState(30);
  const [progress, setProgress] = useState(0);
  const [inputStatus, setInputStatus] = useState(null);

  useEffect(() => {
    const shuffledQuestions = shuffleArray(
      originalQuestions.map((q) => {
        if (q.type === "mcq") {
          const shuffledOptions = shuffleArray(q.options);
          return {
            ...q,
            options: shuffledOptions,
            correct: shuffledOptions.indexOf(q.options[q.correct]),
          };
        }
        return q;
      })
    );
    setQuestions(shuffledQuestions);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQuestion]);

  useEffect(() => {
    if (timer === 0) {
      handleNextQuestion(false);
    }
  }, [timer]);

  useEffect(() => {
    setProgress(((currentQuestion + 1) / questions.length) * 100);
  }, [currentQuestion, questions.length]);

  const handleSubmitAnswer = () => {
    if (selectedAnswer === "") return;

    const currentQ = questions[currentQuestion];
    let isCorrect = false;

    if (currentQ.type === "integer") {
      isCorrect = parseInt(selectedAnswer, 10) === currentQ.correct;
    } else if (currentQ.type === "mcq") {
      isCorrect = selectedAnswer === currentQ.options[currentQ.correct];
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setInputStatus("correct");
    } else {
      setInputStatus("incorrect");
    }

    setTimeout(() => handleNextQuestion(true), 600);
  };

  const handleNextQuestion = (answered) => {
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer("");
        setTimer(30);
        setInputStatus(null);
      } else {
        onComplete(score);
      }
    }, answered ? 600 : 500);
  };

  if (questions.length === 0) return <div>Loading...</div>;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white text-center p-6">
      <div className="relative p-6 bg-white w-full max-w-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-black">Quiz</h2>

        {/* Progress Bar */}
        <div className="relative w-full bg-gray-300 h-3 rounded-full mb-4 overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="text-lg font-medium mb-2 text-black">
          {questions[currentQuestion].question}
        </div>
        <div className="text-sm text-gray-600 mb-2">Time Left: {timer}s</div>

        {questions[currentQuestion].type === "mcq" ? (
          <div className="grid gap-2">
            {questions[currentQuestion].options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center gap-2 py-2 px-4 rounded-md transition-all duration-300 border border-gray-300 cursor-pointer ${
                  selectedAnswer === option
                    ? inputStatus === "correct"
                      ? "bg-green-200 text-black"
                      : inputStatus === "incorrect"
                      ? "bg-red-200 text-black"
                      : "bg-blue-200 text-black"
                    : "bg-white text-black"
                }`}
              >
                <input
                  type="radio"
                  name="mcq"
                  value={option}
                  className="form-radio h-5 w-5 text-blue-500 cursor-pointer"
                  checked={selectedAnswer === option}
                  onChange={() => setSelectedAnswer(option)}
                />
                {option}
              </label>
            ))}
          </div>
        ) : (
          <div className="relative mt-3 flex items-center gap-2">
            <span className="text-lg font-medium text-gray-700">Answer:</span>
            <input
  type="number"
  className={`text-lg p-2 w-32 rounded-md focus:outline-none transition-all duration-300 ${
    inputStatus === "correct"
      ? "bg-green-200 text-black"
      : inputStatus === "incorrect"
      ? "bg-red-200 text-black"
      : "bg-white text-black"
  }`}
  placeholder="_______"
  value={selectedAnswer}
  onChange={(e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setSelectedAnswer(value);
    }
  }}
  style={{
    appearance: "textfield", // Ensures no number input styling
    WebkitAppearance: "none", // Chrome, Safari
    MozAppearance: "textfield", // Firefox
  }}
/>

          </div>
        )}

        {/* Buttons in one line */}
        <div className="mt-4 flex gap-2">
          {/* Show Submit button when an option is selected */}
          {selectedAnswer && (
            <button
              onClick={handleSubmitAnswer}
              className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-md flex justify-center items-center gap-2"
            >
              <FaCheck size={18} />
            </button>
          )}

          {/* Skip Button (always visible) */}
          <button
            onClick={() => handleNextQuestion(false)}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md flex justify-center items-center gap-2"
          >
            <FaForward size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
