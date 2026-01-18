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
  Eye
} from "lucide-react";
import api from "../services/api";


export default function MyAccount(){
  const navigate=useNavigate();
  const storedUser=JSON.parse(localStorage.getItem("user"));

  const [stats,setStats]=useState({
    created:0,
    participated:0,
    won:0,
    sold:0,
    unsold:0,
    highestBid:0,
    totalBids:0,
  });

  useEffect(()=>{
    console.log("Stored User:", storedUser);

    fetchStats();
  },[]);

  const fetchStats=async()=>{
    try{
      const [bidsRes, auctionsRes] = await Promise.all([
      api.get(`api/bids/user/${storedUser.id}`),
      api.get(`api/auctions/created-by/${storedUser.id}`),
    ]);


      const myBids = bidsRes.data || [];
      const myAuctions = auctionsRes.data || [];

      let sold = 0;
      let unsold = 0;


      for (let auction of myAuctions) {
        if (auction.status !== "ENDED") continue;

        const bidsRes = await api.get(`api/bids/auction/${auction.id}`);
        const auctionBids = bidsRes.data || [];

        if (auctionBids.length > 0) {
          sold++;
        } else {
          unsold++;
        }
      }

      // // Auctions won by me
      // const wonAuctionIds = new Set(
      //   myBids.filter(b => b.isWinner).map(b => b.auctionId)
      // );

      // // Unique auctions participated (not number of bids)
      // const participatedAuctionIds = new Set(
      //   myBids.map(b => b.auctionId)
      // );

        const participatedAuctionIds = new Set(
          myBids
            .map(b => Number(b.auction?.id))
            .filter(id => !isNaN(id))
        );

        console.log(
          "Participated IDs:",
          myBids.map(b => b.auction?.id)
        );

        console.log("My Bids:", myBids);
        console.log("Participated:", [...participatedAuctionIds]);



        let won = 0;

        for (let auction of myAuctions) {
          if (auction.status !== "ENDED") continue;

          const bidsRes = await api.get(`bids/auction/${auction.id}`);
          const auctionBids = bidsRes.data || [];

          if (auctionBids.length === 0) continue;

          const highestBid = auctionBids.reduce((max, b) =>
            b.amount > max.amount ? b : max
          );


          if (highestBid.userName?.trim() === storedUser.name?.trim()) {
            won++;
          }
        }


      const highestBid = myBids.length
        ? Math.max(...myBids.map(b => b.amount))
        : 0;

      setStats({
        created: myAuctions.length,
        participated: participatedAuctionIds.size,
        won,
        sold,
        unsold,
        highestBid,
      });

    }
    catch(err){
      console.error("Dashboard load failed", err);
    }
  };


  return(
    <main className="min-h-screen bg-gradient-to-br from-[#071a33] to-[#020b18] text-white px-6 py-16">

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <h1 className="text-4xl font-bold text-yellow-400">
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
        className="max-w-6xl mx-auto bg-[#0b2a55] rounded-2xl shadow-xl p-8 grid md:grid-cols-3 gap-10"
      >

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-28 h-28 rounded-full bg-yellow-400 flex items-center justify-center text-black text-4xl font-bold">
            {storedUser?.name?.charAt(0)}
          </div>

          <h3 className="text-xl font-semibold">
            {storedUser?.name}
          </h3>

          <div className="text-sm text-gray-300 space-y-1">
            <p className="flex items-center gap-2">
              <Mail size={16} /> {storedUser?.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} /> {storedUser?.phone || "Not Added"}
            </p>
          </div>
        </div>


        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">

          <StatCard icon={Gavel} label="Auctions Created" value={stats.created} />
          <StatCard icon={Trophy} label="Auctions Won" value={stats.won} />
          <StatCard icon={BarChart3} label="Auctions Sold" value={stats.sold} />
          <StatCard icon={LayoutDashboard} label="Auctions Unsold" value={stats.unsold} />
          <StatCard icon={LayoutDashboard} label="Participated Auctions" value={stats.participated} />
          <StatCard icon={IndianRupee} label="Highest Bid" value={`₹${stats.highestBid}`} />


        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-6xl mx-auto mt-14 grid md:grid-cols-4 gap-6"
      >
        <ActionButton
          icon={Eye}
          label="View Auctions"
          onClick={() => navigate("/auctions")}
        />

        <ActionButton
          icon={PlusCircle}
          label="Create Auction"
          onClick={() => navigate("/create-auction")}
        />

        <ActionButton
          icon={LayoutDashboard}
          label="My Auctions"
          onClick={() => navigate("/my-auctions")}
        />

        <ActionButton
          icon={User}
          label="Edit Profile"
          onClick={() => alert("Profile Edit Coming Soon")}
        />
      </motion.div>
    </main>
  );
}



const StatCard=({icon:Icon, label, value })=>(
  <motion.div
    whileHover={{scale: 1.08}}
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