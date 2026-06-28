import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("api/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: "USER",
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
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
            <User className="text-yellow-400" size={24} />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b2a55]">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join Auctonix today</p>
        </div>

        {/* Success banner */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              className="mb-5 flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3"
            >
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Account created! Redirecting to login…</span>
            </motion.div>
          )}
        </AnimatePresence>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { icon: User, name: "name", type: "text", placeholder: "Full Name", required: true },
            { icon: Mail, name: "email", type: "email", placeholder: "Email Address", required: true },
            { icon: Phone, name: "phone", type: "tel", placeholder: "Phone Number", required: true },
          ].map(({ icon: Icon, name, type, placeholder, required }) => (
            <div key={name} className="relative">
              <Icon className="absolute top-3.5 left-3.5 text-gray-400" size={17} />
              <input
                name={name}
                type={type}
                required={required}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              />
            </div>
          ))}

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-3.5 left-3.5 text-gray-400" size={17} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
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

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute top-3.5 left-3.5 text-gray-400" size={17} />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              required
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Submit */}
          <motion.button
            disabled={loading || success}
            whileTap={{ scale: loading || success ? 1 : 0.97 }}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
          >
            {loading && (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full block"
              />
            )}
            {loading ? "Creating account…" : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-7">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-yellow-500 font-semibold hover:text-yellow-600 hover:underline transition-colors"
          >
            Login
          </button>
        </p>
      </motion.div>
    </main>
  );
}
