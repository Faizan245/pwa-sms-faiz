"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnalogClock from "./clock/clock";

const Login = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  let timeout;

  const resetToClock = () => {
    setShowLogin(false);
  };

  const handleActivity = () => {
    clearTimeout(timeout);
    timeout = setTimeout(resetToClock, 50000);
  };

  const generateStars = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100 + "%",
      y: Math.random() * 100 + "%",
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }));
  };
  const stars = generateStars(150);

  useEffect(() => {
    if (showLogin) {
      timeout = setTimeout(resetToClock, 50000);
      return () => clearTimeout(timeout);
    }
  }, [showLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    handleActivity();

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem("isLoggedIn", "true");
        onLogin();
        router.push("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-white overflow-hidden"
      style={{
        backgroundImage: 'url("/feeRecieptBG1.jpg")',
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <h1 className="text-[60px] mb-10 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 drop-shadow-xl tracking-wide font-serif">
        Budana Public School
      </h1>
      {!showLogin && (
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: showLogin ? 0 : 1, opacity: showLogin ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >


          <AnalogClock />

          <button
            onClick={() => setShowLogin(true)}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Proceed to Login
          </button>
        </motion.div>
      )}



      {showLogin && (

        <motion.div
          initial={{ opacity: 0, scale: 0.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 bg-gray-900 bg-opacity-95 p-8 rounded-xl shadow-xl w-full max-w-md mt-6"
          onMouseMove={handleActivity}
          onKeyPress={handleActivity}
        >
          {stars.map((star) => (
            <motion.div
              key={star.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: star.delay }}
              className="absolute bg-white rounded-full"
              style={{
                width: star.size + "px",
                height: star.size + "px",
                top: star.y,
                left: star.x,
              }}
            />
          ))}
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); handleActivity(); }}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); handleActivity(); }}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="w-full text-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`py-2 px-5 rounded-lg font-semibold transition-colors ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
          {isLoading && <p className="text-blue-600 mt-4 text-center animate-pulse">Please wait...</p>}
        </motion.div>
      )}
    </div>
  );
};

export default Login;