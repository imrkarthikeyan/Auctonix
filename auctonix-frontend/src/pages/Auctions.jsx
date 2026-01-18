import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import AuctionCard from "../components/AuctionCard";
import { enrichAuctions } from "../utils/auctionUtils";
import { isLoggedIn } from "../utils/auth";

export default function Auctions() {
  const [status,setStatus]=useState("ALL");
  const [auctions,setAuctions]=useState([]);
  const navigate=useNavigate();
  const location=useLocation();

  useEffect(()=>{
    fetchAuctions();
  },[status]);

  const fetchAuctions=async()=>{
    try{
      let data=[];

      if(status==="ALL"){
        const [live,upcoming,ended]=await Promise.all([
          api.get("api/auctions/status/LIVE"),
          api.get("api/auctions/status/UPCOMING"),
          api.get("api/auctions/status/ENDED"),
        ]);
        data=[...live.data, ...upcoming.data, ...ended.data];
      }
      else{
        const res=await api.get(`api/auctions/status/${status}`);
        data=res.data;
      }

      const enriched=await enrichAuctions(data);
      setAuctions(enriched);
    }
    catch(err){
      console.error(err);
    }
  };


  const requireLogin=(callbackPath)=>{
    if(!isLoggedIn()){
      navigate("/login",{
        state:{ from: callbackPath },
      });
      return false;
    }
    return true;
  };

  return(
    <section className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">


        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#0b2a55]">
            All Auctions
          </h2>
          <div className="flex justify-center mt-3">
            <span className="h-[3px] w-24 bg-yellow-400"></span>
          </div>
        </div>


        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {["ALL", "LIVE", "UPCOMING", "ENDED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                status === s
                  ? "bg-[#0b2a55] text-white shadow"
                  : "border border-text-[#0b2a55] text-[#0b2a55] hover:bg-[#0b2a55] hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>


        {auctions.length === 0 ? (
          <p className="text-center text-gray-500">
            No auctions available
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                className="relative bg-white rounded-2xl
                           shadow-lg hover:shadow-2xl
                           transition transform hover:-translate-y-1
                           border-l-4 border-t-4 border-yellow-400"
              >
                <AuctionCard
                  auction={auction}
                  showLiveButton
                  onView={() => {
                    if (
                      requireLogin(`/auction/${auction.id}`)
                    ) {
                      navigate(`/auction/${auction.id}`);
                    }
                  }}
                  onLiveView={() => {
                    if (
                      requireLogin(`/view-auction/${auction.id}`)
                    ) {
                      navigate(`/view-auction/${auction.id}`);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}