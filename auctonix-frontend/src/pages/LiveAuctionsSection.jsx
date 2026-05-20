import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuctionCard from "../components/AuctionCard";
import api from "../services/api";
import { enrichAuctions } from "../utils/auctionUtils";

export default function LiveAuctionsSection() {
  const navigate = useNavigate();
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLiveAuctions();
  }, []);

  const fetchLiveAuctions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("api/auctions/status/LIVE");
      const enriched = await enrichAuctions(res.data || []);
      setLiveAuctions(enriched.slice(0, 6));
    }
    catch (err) {
      console.error("Failed to load live auctions", err);
      setError("Unable to load live auctions");
      setLiveAuctions([]);
    }
    finally {
      setLoading(false);
    }
  };

  const AuctionCardSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-300 rounded-xl h-48 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="flex gap-3 pt-4">
          <div className="flex-1 h-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">

      <div className="text-center mb-10 sm:mb-12 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2a55]">
          Today Auction
        </h2>
        <div className="flex justify-center items-center mt-2">
          <span className="h-[2px] w-20 bg-red-400"></span>
          <span className="mx-2 text-red-500">🔨</span>
          <span className="h-[2px] w-20 bg-red-400"></span>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="relative bg-white rounded-2xl shadow-lg border-t-4 border-b-4 border-yellow-400 p-4">
                <AuctionCardSkeleton />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchLiveAuctions}
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition"
            >
              Retry
            </button>
          </div>
        ) : liveAuctions.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No live auctions right now.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {liveAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className="relative bg-white rounded-2xl shadow-lg 
                             border-t-4 border-b-4 border-yellow-400
                             hover:shadow-xl transition"
                >
                  {/* LIVE BADGE */}
                  {/* <div className="absolute top-4 right-4 flex items-center gap-2 
                                  bg-red-100 text-red-600 
                                  px-3 py-1 rounded-full text-xs font-semibold">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    LIVE
                  </div> */}

                  <AuctionCard
                    auction={auction}
                    onView={() =>
                      navigate(`/auction/${auction.id}`)
                    }
                  />
                </div>
              ))}
            </div>

            {/* EXPLORE MORE */}
            <div className="text-center mt-14">
              <button
                onClick={() => navigate("/auctions")}
                className="bg-yellow-400 hover:bg-yellow-500 
                           text-black font-semibold 
                           px-6 sm:px-10 py-3 rounded-lg shadow"
              >
                Explore More Auctions →
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}