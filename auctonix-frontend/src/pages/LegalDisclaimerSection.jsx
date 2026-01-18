import React, { useState } from "react";
import disclaimerImg from "../assets/auctonix-disclaimer.png";

export default function LegalDisclaimerSection(){
  const [open,setOpen]=useState(null);

  const toggle=(idx)=>{
    setOpen(open === idx ? null : idx);
  };

  return(
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0b2a55]">
            Legal & <span className="text-yellow-400">Disclaimer</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Transparency, responsibility, and compliance are at the core of our platform
          </p>
          <div className="flex justify-center mt-6">
            <span className="h-[2px] w-20 bg-yellow-400"></span>
          </div>
        </div>


        <div className="grid md:grid-cols-2 gap-16 items-center">


          <div className="space-y-6">

            <p className="text-gray-700 leading-relaxed">
              This Online Auction Platform acts only as a
              <span className="font-semibold text-[#0b2a55]"> facilitator </span>
              between buyers and sellers. We do not own, verify, or guarantee
              the items listed on the platform.
            </p>


            {[
              {
                title: "User Responsibility",
                content: (
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Users must ensure the authenticity of items before bidding.</li>
                    <li>All transactions are the responsibility of buyers and sellers.</li>
                    <li>Any disputes must be resolved between the involved parties.</li>
                  </ul>
                )
              },
              {
                title: "Platform Limitation",
                content: (
                  <p className="text-gray-700">
                    We are not responsible for product quality, delivery delays,
                    payment failures, or false representations made by sellers.
                  </p>
                )
              },
              {
                title: "Legal Compliance",
                content: (
                  <p className="text-gray-700">
                    By using this platform, you agree to comply with all applicable
                    laws, regulations, and auction policies in your jurisdiction.
                  </p>
                )
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex justify-between items-center
                             px-5 py-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <span className="font-semibold text-[#0b2a55]">
                    {item.title}
                  </span>
                  <span className="text-yellow-400 text-xl">
                    {open === idx ? "−" : "+"}
                  </span>
                </button>

                {open === idx && (
                  <div className="px-5 py-4 bg-white">
                    {item.content}
                  </div>
                )}
              </div>
            ))}


            <div className="border-l-4 border-yellow-400 pl-4 text-gray-700 bg-yellow-50 p-4 rounded">
              Continued use of this platform indicates your acceptance of
              these terms and conditions.
            </div>
          </div>


          <div className="flex justify-center">
            <div className="relative p-3 border-2 border-yellow-400/40 rounded-xl w-[85%]">
              <img
                src={disclaimerImg}
                alt="Legal Disclaimer"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}