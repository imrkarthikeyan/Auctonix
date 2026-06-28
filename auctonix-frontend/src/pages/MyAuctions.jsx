import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import AuctionCard from "../components/AuctionCard";
import { enrichAuctions } from "../utils/auctionUtils";

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

export function MyAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  let user = null;
  try {
    const raw = localStorage.getItem("user");
    user = raw && raw !== "undefined" ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchMyAuctions();
  }, []);

  const fetchMyAuctions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`api/auctions/created-by/${userId}`);
      const enriched = await enrichAuctions(res.data);
      setAuctions(enriched);
    } catch (err) {
      console.error(err);
      setError("Failed to load your auctions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen py-10 sm:py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0b2a55]">
            My Auctions
          </h2>
          <div className="flex justify-center mt-3">
            <span className="h-[3px] w-24 bg-yellow-400"></span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {[1, 2, 3].map(i => <AuctionCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchMyAuctions}
              className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
            >
              Retry
            </button>
          </div>
        ) : auctions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 sm:p-12 text-center text-gray-500 shadow">
            You haven't created any auctions yet.
          </div>
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
                  onView={() => navigate(`/auction/${auction.id}`)}
                  onLiveView={() => navigate(`/view-auction/${auction.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
