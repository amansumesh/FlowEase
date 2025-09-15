import React from "react";
import { FcGoogle } from "react-icons/fc";

const LandingPage = () => {
  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/api/auth/login";
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8">FlowEase</h1>
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition mx-auto"
        >
          <FcGoogle className="text-2xl" />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
