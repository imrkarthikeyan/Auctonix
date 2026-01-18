import React from "react";
import auctionRoom from "../assets/auction-room.jpg";
import AnimatedCounter from "../components/AnimatedCounter";


export default function AboutUsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0b2a55] to-[#071a33] text-white relative overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-yellow-400">
          About Us
        </h2>
        <p className="mt-4 text-gray-300">
          Discover the future of transparent and trusted online auctions
        </p>
        <div className="flex justify-center mt-6">
          <span className="h-[2px] w-20 bg-yellow-400"></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 px-6 mb-20">
        
        {[
          {label: "Years of Excellence", value: 2, suffix: "+"},
          {label: "Registered Users", value: 500, suffix: "+"},
          {label: "Successful Auctions", value: 98, suffix: "%"},
          {label: "Auctions Conducted", value: 1200, suffix: "+"},
        ].map((item,idx)=>(
          <div
            key={idx}
            className="bg-[#0f2f55] border border-cyan-500/20 
                       rounded-xl p-8 text-center
                       shadow-[0_15px_35px_rgba(0,0,0,0.35)]
                       hover:scale-105 transition"
          >
            <div className="relative inline-flex justify-center">

        <div className="[&_h2]:!text-white">
            <AnimatedCounter value={item.value} />
        </div>

        <span
            className="absolute 
                    right-[-1.5rem] 
                    top-1/2 
                    -translate-y-1/2
                    text-white 
                    text-3xl 
                    font-bold"
        >
            {item.suffix}
        </span>
        </div>


            <p className="mt-3 text-gray-300 text-sm">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 px-6 items-center">

        <div className="relative p-3 border-2 border-cyan-400/20">
            <img
                src={auctionRoom}
                alt="Auction Room"
                className="shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            />
        </div>

        <div className="bg-[#0f2f55]/80 border border-cyan-400/20 
                         p-8 shadow-xl">

          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            Auctonix Online Auctions
          </h3>

          <p className="text-gray-300 leading-relaxed mb-6">
            Auctonix is a next-generation online auction platform designed
            to deliver transparency, speed, and trust. We empower buyers
            and sellers through secure bidding, real-time auctions, and
            intelligent insights.
          </p>

          <ul className="space-y-4 text-gray-300 text-sm">
            <li>✔ Smart real-time auction management</li>
            <li>✔ Secure bidding & instant updates</li>
            <li>✔ Scalable platform for any auction size</li>
            <li>✔ Trusted by thousands of active users</li>
          </ul>

          <div className="mt-6 p-4 rounded-lg bg-cyan-400/10 
                          border border-cyan-400/30 text-cyan-300 text-sm">
            ⏱️ 24 × 7 Availability   • Always Live   • Always Secure
          </div>

        </div>
      </div>
    </section>
  );
}