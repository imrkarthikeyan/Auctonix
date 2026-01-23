import logo from "../assets/auctonix-logo1.png";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { FaBars, FaTimes } from "react-icons/fa";

export function Navbar() {
  const loggedIn = isLoggedIn();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-yellow-400 underline underline-offset-8 font-semibold"
      : "hover:text-yellow-400";

  return (
    <>
      
      <div className="bg-black text-gray-200 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2">
          <div className="flex items-center gap-4">
            <i className="fab fa-facebook-f cursor-pointer hover:text-yellow-400"></i>
            <i className="fab fa-instagram cursor-pointer hover:text-yellow-400"></i>
            <i className="fab fa-linkedin-in cursor-pointer hover:text-yellow-400"></i>
          </div>

          <div className="flex items-center gap-6 text-yellow-400">
            <span>📞 +91 9898159666</span>
            <span>✉ info@auctonix.com</span>
          </div>
        </div>
      </div>


      <header className="sticky top-0 z-50 bg-[#0b2a55]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">


          <div className="flex items-center gap-3">
            <img src={logo} alt="Auctonix" className="h-12 w-12" />
            <span className="text-white font-semibold text-lg">
              Auctonix
            </span>
          </div>

          {/* Hamburger Button (Mobile) */}
          <button
            className="md:hidden text-white text-xl"
            onClick={toggleMenu}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-8 text-white text-sm font-medium">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/auctions" className={navLinkClass}>Auctions</NavLink>
            <NavLink to="/create-auction" className={navLinkClass}>Create Auctions</NavLink>
            <NavLink to="/my-auctions" className={navLinkClass}>My Auctions</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>

            {!loggedIn && (
              <Link
                to="/login"
                className="border border-yellow-400 px-4 py-1 rounded hover:bg-yellow-400 hover:text-black transition"
              >
                Signup / Login
              </Link>
            )}

            {loggedIn && (
              <>
                <NavLink to="/my-account" className={navLinkClass}>
                  My Account
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="border border-red-400 px-4 py-1 rounded text-red-400 hover:bg-red-400 hover:text-black transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Menu*/}
        {menuOpen && (
          <div className="md:hidden bg-[#0b2a55] px-6 pb-4">
            <div className="flex flex-col gap-4 text-white text-sm font-medium">

              <NavLink to="/" onClick={closeMenu}>Home</NavLink>
              <NavLink to="/auctions" onClick={closeMenu}>Auctions</NavLink>
              <NavLink to="/create-auction" onClick={closeMenu}>Create Auctions</NavLink>
              <NavLink to="/my-auctions" onClick={closeMenu}>My Auctions</NavLink>
              <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>

              {!loggedIn && (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="border border-yellow-400 px-4 py-2 rounded text-center"
                >
                  Signup / Login
                </Link>
              )}

              {loggedIn && (
                <>
                  <NavLink to="/my-account" onClick={closeMenu}>
                    My Account
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="border border-red-400 px-4 py-2 rounded text-red-400"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
