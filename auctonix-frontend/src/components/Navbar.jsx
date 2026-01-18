
import logo from "../assets/auctonix-logo1.png";
import React from "react";
import {Link, NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

export function Navbar() {
  const loggedIn=isLoggedIn();
  const navigate=useNavigate();

  const handleLogout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkClass=({isActive})=>
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
            <img
              src={logo}
              alt="Auctonix"
              className="h-12 w-12"
            />
            <span className="text-white font-semibold text-lg">
              Auctonix
            </span>
          </div>

          <nav className="hidden md:flex gap-8 text-white text-sm font-medium">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/auctions" className={navLinkClass}>
              Auctions
            </NavLink>
            <NavLink to="/create-auction" className={navLinkClass}>
              Create Auctions
            </NavLink>
            <NavLink to="/my-auctions" className={navLinkClass}>
              My Auctions
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>


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
      </header>
    </>
  );
}