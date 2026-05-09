import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post("https://auctonix-backend.onrender.com/api/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: "USER",
      });

      alert("✅ Account created successfully!");
      navigate("/login");
    }
    catch (err) {
      alert(err.response?.data?.message || "❌ Signup failed");
    }
    finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-gradient-to-br from-[#071a33] to-[#020b18] flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">


      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 80 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10"
      >

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b2a55]">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Join Auctonix today
          </p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-5">


          <div className="relative">
            <User className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              name="name"
              required
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>


          <div className="relative">
            <Mail className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          <div className="relative">
            <Phone className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              type="tel"
              name="phone"
              required
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>


          <div className="relative">
            <Lock className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg pl-10 pr-10 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3.5 right-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              required
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>


          <button
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded-lg font-semibold transition flex justify-center"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>


        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-yellow-500 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </motion.div>
    </main>
  );
}
