import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import firebaseConfig from "./connection_db";
import { initializeApp } from "firebase/app";
import { FaUserCircle } from "react-icons/fa"; // ✅ Import Profile Icon

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to determine score color and message
const getScoreColor = (score) => {
  if (score === 10) {
    return { color: "text-green-600", message: "You're a genius! " };
  } else if (score >= 8) {
    return { color: "text-blue-600", message: "Awesome work! Almost perfect! " };
  } else if (score >= 5) {
    return { color: "text-yellow-600", message: "You're improving! Keep going! " };
  } else {
    return { color: "text-purple-600", message: "Every attempt matters! Keep learning! " };
  }
};

const Profile = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScore, setSelectedScore] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const email = localStorage.getItem("userEmail"); // Fetch email from localStorage

  useEffect(() => {
    if (!email) return;

    const fetchScores = async () => {
      try {
        const scoresRef = collection(db, "quiz_scores");
        const q = query(scoresRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        // Extract scores and format timestamps
        let userScores = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: new Date(doc.data().timestamp).toLocaleString(), // Convert timestamp
          dateOnly: new Date(doc.data().timestamp).toLocaleDateString(), // Extract only the date
          timeOnly: new Date(doc.data().timestamp).toLocaleTimeString(), // Extract only the time
        }));

        // Remove duplicate timestamps (keep only one per timestamp)
        const uniqueScores = [];
        const seenTimestamps = new Set();
        for (const score of userScores) {
          if (!seenTimestamps.has(score.timestamp)) {
            uniqueScores.push(score);
            seenTimestamps.add(score.timestamp);
          }
        }

        setScores(uniqueScores);
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [email]);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        
        {/* ✅ Profile Icon (Replaces GIF) */}
        <FaUserCircle className="w-36 h-36 text-gray-700 mb-4" />

        {/* User's Email */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-md">
          <h2 className="text-xl font-semibold text-gray-700">User Email</h2>
          <p className="text-gray-500">{email || "guest@example.com"}</p>
        </div>

        {/* Scores Section */}
        <div className="w-full max-w-4xl mt-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Quiz History
          </h2>
          {loading ? (
            <p className="text-gray-500 text-center">Loading scores...</p>
          ) : scores.length === 0 ? (
            <p className="text-gray-500 text-center">No quiz attempts found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {scores.map((scoreData) => (
                <div
                  key={scoreData.id}
                  className="bg-white p-4 rounded-lg shadow-md text-center cursor-pointer transition duration-300 hover:shadow-lg"
                  onClick={() => {
                    setSelectedScore(scoreData);
                    setDialogOpen(true);
                  }}
                >
                  <p className="text-lg font-bold text-gray-700">
                    {scoreData.dateOnly} {/* Display only date */}
                  </p>
                  <p className="text-sm text-gray-500">
                    {scoreData.timeOnly} {/* Display only time */}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dialog Box (when clicked) */}
        {dialogOpen && selectedScore && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 className="text-2xl font-bold text-gray-800">Quiz Details</h2>
              <p className={`text-lg font-bold ${getScoreColor(selectedScore.score).color}`}>
                Score: {selectedScore.score} / 10
              </p>
              <p className="text-gray-600">{getScoreColor(selectedScore.score).message}</p>
              <p className="text-gray-500 mt-2">
                Full Timestamp: {selectedScore.timestamp}
              </p>
              <button
                onClick={() => setDialogOpen(false)}
                className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
