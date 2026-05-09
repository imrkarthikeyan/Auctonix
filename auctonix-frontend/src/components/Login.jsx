import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://auctonix-backend.onrender.com/api/auth/login", {
        email: form.email,
        password: form.password,
      });


      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      alert("Login Successful!");
      navigate("/");
    }
    catch (err) {
      alert(err.response?.data?.message || "Login failed");
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
            Auctonix
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Login to your account
          </p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-6">


          <div className="relative">
            <Mail className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>


          <div className="relative">
            <Lock className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3.5 right-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>


          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="accent-yellow-400"
              />
              Remember me
            </label>

            {/* <button
              type="button"
              className="text-yellow-500 hover:underline"
            >
              Forgot password?
            </button> */}
            <button
              type="button"
              className="text-yellow-500 hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>

          </div>


          <button
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded-lg font-semibold transition flex justify-center"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>


        <p className="text-center text-sm text-gray-500 mt-8">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-yellow-500 font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </main>
  );
}
