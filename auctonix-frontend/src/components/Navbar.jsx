import logo from "../assets/auctonix-logo1.png";
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";

function getUserFromStorage() {
  try {
    const raw = localStorage.getItem("user");
    return raw && raw !== "undefined" ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function Navbar() {
  const loggedIn = isLoggedIn();
  const navigate = useNavigate();
  const user = loggedIn ? getUserFromStorage() : null;
  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-yellow-400 font-semibold relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-yellow-400 after:rounded"
      : "hover:text-yellow-400 transition-colors duration-200 relative";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/auctions", label: "Auctions" },
    { to: "/create-auction", label: "Create Auction" },
    { to: "/my-auctions", label: "My Auctions" },
    { to: "/ai-insights", label: "AI Insights" },
    { to: "/smart-recommendations", label: "Smart Picks" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-black text-gray-300 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-2">
          <div className="flex items-center gap-4">
            <i className="fab fa-facebook-f cursor-pointer hover:text-yellow-400 transition-colors" />
            <i className="fab fa-instagram cursor-pointer hover:text-yellow-400 transition-colors" />
            <i className="fab fa-linkedin-in cursor-pointer hover:text-yellow-400 transition-colors" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 text-yellow-400">
            <span>+91 9898159666</span>
            <span>info@auctonix.com</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 bg-[#0b2a55] transition-shadow duration-300 ${
          scrolled ? "shadow-lg shadow-black/50" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMenu}>
            <motion.img
              src={logo}
              alt="Auctonix"
              className="h-10 w-10 sm:h-12 sm:w-12"
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <span className="text-white font-bold text-base sm:text-lg tracking-wide">
              Auctonix
            </span>
          </Link>

          {/* Hamburger */}
          <motion.button
            className="md:hidden text-white text-xl p-1"
            onClick={() => setMenuOpen((o) => !o)}
            whileTap={{ scale: 0.85 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {menuOpen ? <FaTimes /> : <FaBars />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-4 lg:gap-6 text-white text-sm font-medium items-center">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={navLinkClass} end={to === "/"}>
                {label}
              </NavLink>
            ))}

            {/* Not logged in */}
            {!loggedIn && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="border border-yellow-400 px-4 py-1.5 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors duration-200 font-semibold"
                >
                  Signup / Login
                </Link>
              </motion.div>
            )}

            {/* Logged in — avatar dropdown */}
            {loggedIn && (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => setDropdownOpen((o) => !o)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-yellow-400/50 px-3 py-1.5 rounded-xl transition-all duration-200"
                >
                  {/* Avatar */}
                  <span className="w-7 h-7 rounded-full bg-yellow-400 text-black font-bold text-xs flex items-center justify-center shrink-0">
                    {initials}
                  </span>
                  {/* Name */}
                  <span className="text-white text-sm font-medium max-w-[100px] truncate">
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                  {/* Chevron */}
                  <motion.span
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={14} className="text-gray-300" />
                  </motion.span>
                </motion.button>

                {/* Dropdown panel */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 top-[calc(100%+10px)] w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-[#0b2a55] to-[#0e3a75]">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-yellow-400 text-black font-bold text-sm flex items-center justify-center shrink-0">
                            {initials}
                          </span>
                          <div className="min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                            <p className="text-gray-300 text-xs truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        <Link
                          to="/my-account"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0b2a55] transition-colors group"
                        >
                          <span className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                            <LayoutDashboard size={15} className="text-blue-600" />
                          </span>
                          <span className="font-medium">My Account</span>
                        </Link>

                        <div className="my-1.5 mx-3 border-t border-gray-100" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                        >
                          <span className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                            <LogOut size={15} className="text-red-500" />
                          </span>
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile menu */}
        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden bg-[#0a2448] overflow-hidden border-t border-white/10"
            >
              <div className="px-4 sm:px-6 py-4 flex flex-col gap-1">
                {navLinks.map(({ to, label }, i) => (
                  <motion.div
                    key={to}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.18 }}
                  >
                    <NavLink
                      to={to}
                      onClick={closeMenu}
                      end={to === "/"}
                      className={({ isActive }) =>
                        `block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-yellow-400/10 text-yellow-400"
                            : "text-white hover:bg-white/5 hover:text-yellow-400"
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  </motion.div>
                ))}

                <div className="mt-2 pt-3 border-t border-white/10 flex flex-col gap-2">
                  {!loggedIn && (
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="border border-yellow-400 text-yellow-400 px-4 py-2.5 rounded-lg text-center text-sm font-semibold hover:bg-yellow-400 hover:text-black transition-colors"
                    >
                      Signup / Login
                    </Link>
                  )}

                  {loggedIn && (
                    <>
                      {/* Mobile user info */}
                      <div className="flex items-center gap-3 px-3 py-2 mb-1">
                        <span className="w-9 h-9 rounded-full bg-yellow-400 text-black font-bold text-sm flex items-center justify-center shrink-0">
                          {initials}
                        </span>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                          <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                        </div>
                      </div>

                      <NavLink
                        to="/my-account"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-yellow-400/10 text-yellow-400"
                              : "text-white hover:bg-white/5 hover:text-yellow-400"
                          }`
                        }
                      >
                        <LayoutDashboard size={15} />
                        My Account
                      </NavLink>

                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-md shadow-red-900/30 active:scale-95"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
