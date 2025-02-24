import React, { useEffect, useState } from "react";
import { FaTrophy, FaThumbsUp, FaRocket } from "react-icons/fa";
import { GiFireworkRocket } from "react-icons/gi"; // Alternative for Fireworks
import { useNavigate } from "react-router-dom"; // For navigation
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseConfig from "./connection_db"; // Importing config from existing structure
import { initializeApp } from "firebase/app";
import Navbar from "./Navbar";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getAppreciationMessage = (score) => {
  if (score === 10) {
    return { 
      message: "Perfect Score! You're a genius!", 
      color: "text-green-600", 
      icon: <GiFireworkRocket className="text-green-500 animate-bounce text-5xl mx-auto" /> 
    };
  } else if (score >= 8) {
    return { 
      message: "Amazing job! You're so close!", 
      color: "text-blue-600", 
      icon: <FaTrophy className="text-blue-500 animate-pulse text-5xl mx-auto" /> 
    };
  } else if (score >= 5) {
    return { 
      message: "Good effort! Keep going, you're improving!", 
      color: "text-yellow-600", 
      icon: <FaThumbsUp className="text-yellow-500 animate-wiggle text-5xl mx-auto" /> 
    };
  } else {
    return { 
      message: "Every step counts! Keep trying and you'll get there!", 
      color: "text-purple-600", 
      icon: <FaRocket className="text-purple-500 animate-bounce text-5xl mx-auto" /> 
    };
  }
};

const Scoreboard = ({ score, onRestart }) => {
  const { message, color, icon } = getAppreciationMessage(score);
  const [hasSaved, setHasSaved] = useState(false); // Track if score is saved
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    if (hasSaved) return; // Prevent multiple saves

    const email = localStorage.getItem("userEmail");
    if (!email) return; // Don't save if no email is found

    const saveScore = async () => {
      try {
        await addDoc(collection(db, "quiz_scores"), {
          email: email,
          score: score,
          timestamp: new Date().toISOString(),
        });
        console.log("Score saved successfully!");
        setHasSaved(true); // Mark as saved
      } catch (error) {
        console.error("Error saving score:", error);
      }
    };

    saveScore();
  }, [score, hasSaved]); // Depend on score & hasSaved

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Full-width Navbar */}
      <div className="w-full fixed top-0 left-0 right-0 z-50 shadow-md">
        <Navbar />
      </div>

      {/* Scoreboard Content */}
      <div className="pt-16 w-full flex justify-center items-center">
        <div className="p-6 bg-white shadow-md rounded-lg text-center w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          {icon} {/* Animated Icon */}
          <p className={`text-lg mt-4 mb-2 ${color}`}>
            Your Score: <span className="font-semibold">{score} / 10</span>
          </p>
          <p className={`text-lg font-medium ${color}`}>{message}</p>

          {/* Try Again Button - Dark Theme */}
          <button
            onClick={onRestart}
            className="mt-4 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-all duration-300 w-full"
          >
            Try Again
          </button>

          {/* Results Button - Navigates to /profiles */}
          <button
            onClick={() => navigate("/Profile")}
            className="mt-3 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-all duration-300 w-full"
          >
            My Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
