// Login.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// import the image
import bgImage from "./kung_fu_panda_4_po___live_wallpaper_for_pc_by_favorisxp_dh4kldk-pre.jpg";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isSignUp ? "Sign Up Data:" : "Login Data:", form);
    navigate("/app"); // redirect to dashboard
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl w-[90%] max-w-md"
      >
        <h1 className="text-3xl font-extrabold text-white text-center mb-6">
          {isSignUp ? "Create Account 🐼" : "Welcome Back 🐼"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-slate-400 mb-1 text-sm">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-slate-800/60 text-white border border-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
            </div>
          )}
          <div>
            <label className="block text-slate-400 mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-800/60 text-white border border-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-800/60 text-white border border-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-2 mt-4 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-900 font-semibold shadow-lg hover:shadow-emerald-500/30 transition"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </motion.button>
        </form>

        <p className="text-sm text-slate-400 text-center mt-6">
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-emerald-400 hover:underline font-medium"
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
