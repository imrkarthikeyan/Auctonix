import React, { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/auth/reset-password", {
        email,
        newPassword,
      });

      alert("✅ Password updated successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "❌ Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#071a33] to-[#020b18] flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10">

        <h2 className="text-xl sm:text-2xl font-bold text-center text-[#0b2a55] mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleReset} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          {/* new password */}
          <input
            type="password"
            required
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded-lg font-semibold"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
