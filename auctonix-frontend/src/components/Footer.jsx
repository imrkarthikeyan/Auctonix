import React from "react";
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
  Mail,
  MapPin,
  Users
} from "lucide-react";

import logo from "../assets/auctonix-logo1.png";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#071a33] to-[#020b18] text-gray-300 pt-20">


      <div className="absolute top-0 left-0 w-full h-[3px]
                      bg-gradient-to-r from-yellow-400 via-cyan-400 to-purple-500" />


      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-14">


        <div className="flex items-start gap-5">

          <img
            src={logo}
            alt="Auctonix"
            className="w-20 h-auto object-contain"
          />


          <div className="w-[2px] h-20 bg-yellow-400/40"></div>


          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Auctonix Online Auctions
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              A next-generation online auction platform delivering secure,
              transparent, and real-time auction experiences worldwide.
            </p>
          </div>
        </div>


        {/* <div>
          <h4 className="text-lg font-semibold text-yellow-400 mb-5 flex items-center gap-2">
            <Users size={18} /> Team Members
          </h4>

          <ul className="space-y-3 text-sm">
            <li>👤 Karthikeyan</li>
            <li>👤 Karthick</li>
            <li>👤 Heishenberg</li>

            <li className="flex items-center gap-2 mt-4">
              <Mail size={16} className="text-yellow-400" />
              support@auctonix.com
            </li>
          </ul>
        </div> */}
        <div>
          <h4 className="text-lg font-semibold text-yellow-400 mb-5">
            Why Auctonix?
          </h4>

          <ul className="space-y-3 text-sm text-gray-400">
            <li>⚡ Real-time Live Auctions</li>
            <li>🔒 Secure Payments</li>
            <li>📊 Transparent Bidding</li>
            <li>🌍 Global Marketplace</li>
            <li>📞 24/7 Support</li>
          </ul>
        </div>


        <div>
          <h4 className="text-lg font-semibold text-yellow-400 mb-5">
            Address
          </h4>

          <p className="flex gap-3 text-sm leading-relaxed">
            <MapPin className="text-yellow-400 mt-1" size={18} />
            Silicon Valley Campus,<br />
            Tiruchengode,<br />
            Chennai – 637405,<br />
            Tamil Nadu, India.
          </p>
        </div>


        <div>
          <h4 className="text-lg font-semibold text-yellow-400 mb-5">
            Connect With Us
          </h4>

          <div className="flex gap-4 mb-6">
            {[Instagram, Facebook, Linkedin, Youtube, Twitter].map(
              (Icon, i) => (
                <button
                  key={i}
                  className="p-3 rounded-lg bg-[#0f2f55]
                             hover:bg-yellow-400 hover:text-black
                             transition shadow-lg hover:scale-110"
                >
                  <Icon />
                </button>
              )
            )}
          </div>

          <button
            className="px-6 py-2 rounded-full border border-yellow-400
                       text-yellow-400 hover:bg-yellow-400
                       hover:text-black transition"
          >
            Give Feedback
          </button>
        </div>
      </div>


      <div className="border-t border-yellow-400/20 mt-16"></div>


      <div className="max-w-7xl mx-auto px-6 py-6
                      flex flex-col md:flex-row
                      justify-between items-center
                      text-sm text-gray-400">

        <p>© 2026 Auctonix. All rights reserved.</p>

        <p className="mt-2 md:mt-0">
          Made with ❤️ by{" "}
          <span className="text-yellow-400">Auctonix Team</span>
        </p>

        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-yellow-400">Privacy Policy</a>
          <a href="#" className="hover:text-yellow-400">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}