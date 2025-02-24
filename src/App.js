import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Profile from "./components/Profile";
import Scoreboard from "./components/Scoreboard";

const App = () => {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/quiz"
          element={
            <div className="min-h-screen flex items-center justify-center">
              {!quizCompleted ? (
                <Quiz
                  onComplete={(finalScore) => {
                    setScore(finalScore);
                    setQuizCompleted(true);
                  }}
                />
              ) : (
                <Scoreboard score={score} onRestart={() => setQuizCompleted(false)} />
              )}
            </div>
          }
        />
                <Route path='/profile' element={<Profile/>} />

      </Routes>
    </Router>
  );
};

export default App;
