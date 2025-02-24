import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiArrowRight } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import Navbar from "./Navbar";

const Home = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError("Enter a valid email!");
      return;
    }

    localStorage.setItem("userEmail", email);
    setShowInstructions(true);
  };

  const handleStartQuiz = () => {
    navigate("/quiz");
  };


  return (
    <div>
    
          <nav className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
            {/* Logo Section */}
            <div className="flex items-center space-x-2">
              {/* Logo (30% Smaller) */}
              <div className="h-5 w-auto cursor-pointer" onClick={() => navigate("/")}>
                <img
                  src="/assets/logo.jpg" // Replace with actual image URL or path
                  alt="Logo"
                  className="h-full object-contain"
                />
              </div>
            </div>
            </nav>

    <div className="h-screen flex items-center justify-center relative bg-white p-4 overflow-hidden">
      {/* Multiple Watermarks in Cross Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-25 grid grid-cols-5 grid-rows-5 gap-12">
        {Array.from({ length: 25 }).map((_, index) => (
          <h1
            key={index}
            className="text-xs sm:text-sm md:text-md lg:text-lg font-bold text-gray-300 select-none"
          >
            Dacoid Digital
          </h1>
        ))}
      </div>

      <div className="bg-transparent p-8 rounded-lg w-full max-w-md text-center relative">
  <h2 className="text-2xl font-semibold text-black mb-4">Join the Quiz!</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="relative">
      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full pl-10 p-3 bg-transparent text-black border-b border-gray-400 focus:border-black focus:outline-none transition-all duration-300"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
        }}
      />
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
    <button
      type="submit"
      className="w-full flex items-center justify-center bg-black text-white py-2 rounded-md hover:opacity-80 transition-all duration-300 font-medium"
    >
      Start Quiz <FiArrowRight className="ml-2" />
    </button>
  </form>
</div>


      {/* Instruction Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md text-center relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-transform duration-300 hover:scale-110"
              onClick={() => setShowInstructions(false)}
            >
              <AiOutlineClose size={20} />
            </button>
            <h2 className="text-xl font-semibold text-black mb-3">Quiz Instructions</h2>
            <ul className="text-gray-600 text-left list-disc list-inside mb-4 space-y-2">
              <li>No going back once the quiz starts.</li>
              <li>Time limit: <strong>30 seconds</strong> per question.</li>
              <li>Instant feedback after each answer.</li>
              <li>Final score will be displayed at the end.</li>
              <li>Stay focused and do your best!</li>
            </ul>
            <button
              onClick={handleStartQuiz}
              className="w-full bg-black text-white py-2 rounded-md hover:opacity-80 transition-all duration-300 font-medium"
            >
              Proceed to Quiz
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Home;
