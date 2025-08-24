import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaGoogle, FaGithub } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);

      if (user.role === "Superadmin") navigate("/superadmin-dashboard");
      else if (user.role === "Admin") navigate("/admin/dashboard");
      else if (user.role === "Faculty") navigate("/faculty/dashboard");
      else if (user.role === "Student") navigate("/student/dashboard");
      else navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.jpg"
            alt="EduSync Logo"
            className="w-16 h-16 rounded-full"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Sign in to your account
        </h2>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center">
              <label className="block text-gray-700 text-sm" htmlFor="password">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="mt-1 w-full px-3 py-2 border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-600"
            >
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition disabled:bg-indigo-300"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Login */}
        

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Not a member?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Contact Us
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
