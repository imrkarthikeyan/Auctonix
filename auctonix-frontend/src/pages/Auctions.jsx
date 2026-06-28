import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import AuctionCard from "../components/AuctionCard";
import { enrichAuctions } from "../utils/auctionUtils";
import { isLoggedIn } from "../utils/auth";

const AuctionCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow-lg border-l-4 border-t-4 border-yellow-400 p-4">
    <div className="bg-gray-300 rounded-xl h-48 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      <div className="flex gap-3 pt-4">
        <div className="flex-1 h-9 bg-gray-300 rounded-lg"></div>
        <div className="flex-1 h-9 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default function Auctions() {
  const [status, setStatus] = useState("ALL");
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAuctions();
  }, [status]);

  const fetchAuctions = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];

      if (status === "ALL") {
        const [live, upcoming, ended] = await Promise.all([
          api.get("api/auctions/status/LIVE"),
          api.get("api/auctions/status/UPCOMING"),
          api.get("api/auctions/status/ENDED"),
        ]);
        data = [...live.data, ...upcoming.data, ...ended.data];
      }
      else {
        const res = await api.get(`api/auctions/status/${status}`);
        data = res.data;
      }

      const enriched = await enrichAuctions(data);
      setAuctions(enriched);
    }
    catch (err) {
      console.error(err);
      setError("Unable to load auctions. The server may be starting up — please try again in a moment.");
    }
    finally {
      setLoading(false);
    }
  };


  const requireLogin = (callbackPath) => {
    if (!isLoggedIn()) {
      navigate("/login", {
        state: { from: callbackPath },
      });
      return false;
    }
    return true;
  };

  return (
    <section className="bg-gray-50 min-h-screen py-10 sm:py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">


        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0b2a55]">
            All Auctions
          </h2>
          <div className="flex justify-center mt-3">
            <span className="h-[3px] w-24 bg-yellow-400"></span>
          </div>
        </div>


        <div className="flex justify-center gap-3 sm:gap-4 mb-10 sm:mb-12 flex-wrap">
          {["ALL", "LIVE", "UPCOMING", "ENDED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition ${status === s
                  ? "bg-[#0b2a55] text-white shadow"
                  : "border border-text-[#0b2a55] text-[#0b2a55] hover:bg-[#0b2a55] hover:text-white"
                }`}
            >
              {s}
            </button>
          ))}
        </div>


        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => <AuctionCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchAuctions}
              className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
            >
              Retry
            </button>
          </div>
        ) : auctions.length === 0 ? (
          <p className="text-center text-gray-500 py-16">
            No auctions available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
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
                    if (requireLogin(`/auction/${auction.id}`)) {
                      navigate(`/auction/${auction.id}`);
                    }
                  }}
                  onLiveView={() => {
                    if (requireLogin(`/view-auction/${auction.id}`)) {
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