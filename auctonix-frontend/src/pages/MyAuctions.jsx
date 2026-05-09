import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import AuctionCard from "../components/AuctionCard";
import { enrichAuctions } from "../utils/auctionUtils";

export function MyAuctions() {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;

  useEffect(() => {
    fetchMyAuctions();
  }, []);

  const fetchMyAuctions = async () => {
    try {
      const res = await api.get(`api/auctions/created-by/${userId}`);
      const enriched = await enrichAuctions(res.data);
      setAuctions(enriched);
    }
    catch (err) {
      console.error(err);
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


        {auctions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 sm:p-12 text-center text-gray-500 shadow">
            You haven’t created any auctions yet.
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
                  onView={() =>
                    navigate(`/auction/${auction.id}`)
                  }
                  onLiveView={() =>
                    navigate(`/view-auction/${auction.id}`)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}