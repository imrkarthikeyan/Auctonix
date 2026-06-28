import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Trophy,
  Gavel,
  IndianRupee,
  BarChart3,
  LayoutDashboard,
  PlusCircle,
  Eye,
  Brain,
  Sparkles
} from "lucide-react";
import api from "../services/api";

export default function MyAccount() {
  const navigate = useNavigate();

  let storedUser = null;
  try {
    const raw = localStorage.getItem("user");
    storedUser = raw && raw !== "undefined" ? JSON.parse(raw) : null;
  } catch {
    storedUser = null;
  }

  const [stats, setStats] = useState({
    created: 0,
    participated: 0,
    won: 0,
    sold: 0,
    unsold: 0,
    highestBid: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!storedUser?.id) {
      navigate("/login");
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bidsRes, myAuctionsRes] = await Promise.all([
        api.get(`api/bids/user/${storedUser.id}`),
        api.get(`api/auctions/created-by/${storedUser.id}`),
      ]);

      const myBids = bidsRes.data || [];
      const myAuctions = myAuctionsRes.data || [];

      // sold/unsold from AuctionDTOs — winnerName/winningAmount already included
      const endedCreated = myAuctions.filter(a => a.status === "ENDED");
      const sold = endedCreated.filter(a => a.winningAmount != null).length;
      const unsold = endedCreated.filter(a => a.winningAmount == null).length;

      // participated + highest bid from myBids
      const participatedAuctionIds = new Set(
        myBids.map(b => b.auction?.id).filter(Boolean)
      );
      const highestBid = myBids.length
        ? Math.max(...myBids.map(b => Number(b.amount) || 0))
        : 0;

      // won: for each ENDED auction I bid on, check if I held the highest bid
      const endedBidAuctionIds = [
        ...new Set(
          myBids
            .filter(b => b.auction?.status === "ENDED")
            .map(b => b.auction.id)
        ),
      ];

      let won = 0;
      if (endedBidAuctionIds.length > 0) {
        const highestBids = await Promise.all(
          endedBidAuctionIds.map(id =>
            api.get(`api/bids/auction/${id}/highest`)
              .then(r => r.data)
              .catch(() => null)
          )
        );
        won = highestBids.filter(
          b => b && b.userName?.trim() === storedUser.name?.trim()
        ).length;
      }

      setStats({ created: myAuctions.length, participated: participatedAuctionIds.size, won, sold, unsold, highestBid });
    } catch (err) {
      console.error("Dashboard load failed", err);
      setError("Failed to load your stats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#071a33] to-[#020b18] text-white px-4 sm:px-6 py-10 sm:py-16">

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400">
          My Account
        </h1>
        <p className="text-gray-300 mt-2">
          Manage your auctions, bids and profile
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto bg-[#0b2a55] rounded-2xl shadow-xl p-5 sm:p-8 grid lg:grid-cols-3 gap-8 sm:gap-10"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-yellow-400 flex items-center justify-center text-black text-3xl sm:text-4xl font-bold">
            {storedUser?.name?.charAt(0)}
          </div>
          <h3 className="text-xl font-semibold">{storedUser?.name}</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p className="flex items-center gap-2">
              <Mail size={16} /> {storedUser?.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} /> {storedUser?.phone || "Not Added"}
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-[#071a33] rounded-xl p-5 border border-yellow-400/20">
                  <div className="h-5 bg-gray-700 rounded w-1/2 mx-auto mb-3"></div>
                  <div className="h-7 bg-gray-600 rounded w-1/3 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
              <p className="text-red-400 text-center">{error}</p>
              <button
                onClick={fetchStats}
                className="px-5 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <StatCard icon={Gavel} label="Auctions Created" value={stats.created} />
              <StatCard icon={Trophy} label="Auctions Won" value={stats.won} />
              <StatCard icon={BarChart3} label="Auctions Sold" value={stats.sold} />
              <StatCard icon={LayoutDashboard} label="Auctions Unsold" value={stats.unsold} />
              <StatCard icon={LayoutDashboard} label="Participated" value={stats.participated} />
              <StatCard icon={IndianRupee} label="Highest Bid" value={`₹${stats.highestBid}`} />
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-6xl mx-auto mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6"
      >
        <ActionButton icon={Eye} label="View Auctions" onClick={() => navigate("/auctions")} />
        <ActionButton icon={PlusCircle} label="Create Auction" onClick={() => navigate("/create-auction")} />
        <ActionButton icon={LayoutDashboard} label="My Auctions" onClick={() => navigate("/my-auctions")} />
        <ActionButton icon={User} label="Edit Profile" onClick={() => alert("Profile Edit Coming Soon")} />
        <ActionButton icon={Brain} label="AI Insights" onClick={() => navigate("/ai-insights")} />
        <ActionButton icon={Sparkles} label="Smart Picks" onClick={() => navigate("/smart-recommendations")} />
      </motion.div>
    </main>
  );
}

const StatCard = ({ icon: Icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.08 }}
    className="bg-[#071a33] rounded-xl p-5 text-center shadow-lg border border-yellow-400/20"
  >
    <Icon className="mx-auto text-yellow-400 mb-2" />
    <p className="text-sm text-gray-400">{label}</p>
    <h3 className="text-xl font-bold mt-1">{value}</h3>
  </motion.div>
);

const ActionButton = ({ icon: Icon, label, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-yellow-400 text-black rounded-xl p-5 flex flex-col items-center gap-3 font-semibold shadow-lg hover:shadow-2xl"
  >
    <Icon size={26} />
    {label}
  </motion.button>
);
