import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("api/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#071a33] to-[#020b18] flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="w-14 h-14 rounded-2xl bg-[#0b2a55] mx-auto mb-4 flex items-center justify-center"
          >
            <Lock className="text-yellow-400" size={24} />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b2a55]">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Login to your Auctonix account</p>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 overflow-hidden"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-3.5 left-3.5 text-gray-400" size={17} />
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-3.5 left-3.5 text-gray-400" size={17} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="accent-yellow-400 w-4 h-4"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-yellow-500 hover:text-yellow-600 hover:underline transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <motion.button
            disabled={loading}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {loading && (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full block"
              />
            )}
            {loading ? "Logging in…" : "Login"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-7">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-yellow-500 font-semibold hover:text-yellow-600 hover:underline transition-colors"
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </main>
  );
}
