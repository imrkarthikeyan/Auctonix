import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Gavel } from "lucide-react";

import { toAbsoluteUrl } from "../utils/fileUrl";


function getSockJsEndpoint() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  const url = new URL(apiBaseUrl);
  url.pathname = "/ws";
  url.search = "";
  url.hash = "";
  return url.toString();
}



function LiveBidItem({ bid, isTop }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`px-4 py-3 flex justify-between items-center ${isTop
        ? "bg-green-50 border-l-4 border-green-500"
        : "hover:bg-gray-50"
        }`}
    >
      <span className="font-medium">{bid.userName}</span>
      <span className="font-bold text-orange-600">₹{bid.amount}</span>
    </motion.div>
  );
}


export default function ViewAuction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const stompRef = useRef(null);
  const connectedRef = useRef(false);

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [winner, setWinner] = useState(null);

  const [showAgreement, setShowAgreement] = useState(false);
  // const [agreed, setAgreed] = useState(
  //   localStorage.getItem("bid_agreed") === "yes"
  // );
  //const [agreed, setAgreed] = useState(false);
  const [pendingBid, setPendingBid] = useState(null);

  const [selectedIncrement, setSelectedIncrement] = useState(null);



  const user = JSON.parse(localStorage.getItem("user"));


  useEffect(() => {
    fetchAuction();
    fetchBids();
    connectWebSocket();
    return () => disconnectWebSocket();
  }, [id]);

  useEffect(() => {
    if (location.state?.bidAmount) {
      setBidAmount(location.state.bidAmount);
    }
  }, []);

  const fetchAuction = async () => {
    const a = await api.get(`api/auctions/${id}`);
    const p = await api.get(`api/products/${a.data.productId}`);

    setAuction({
      ...a.data,
      imageUrl: p.data.imageUrl ? toAbsoluteUrl(p.data.imageUrl) : null,
      productName: p.data.name || a.data.productName,
      startingPrice: p.data.basePrice || a.data.startingPrice,
    });

    if (a.data.status === "ENDED") {
      setWinner({
        name: res.data.winnerName,
        amount: res.data.winningAmount,
      });
    }
  };

  const fetchBids = async () => {
    const res = await api.get(`api/bids/auction/${id}`);
    setBids(res.data);
  };


  const connectWebSocket = () => {
    if (connectedRef.current) return;

    const socket = new SockJS(getSockJsEndpoint());
    const stomp = over(socket);

    stomp.connect({}, () => {
      connectedRef.current = true;
      stompRef.current = stomp;

      stomp.subscribe(`/topic/auction/${id}`, (msg) => {
        const bid = JSON.parse(msg.body);

        if (bid.auctionEnded) {
          setWinner({ name: bid.winnerName, amount: bid.amount });
          setAuction((p) => ({ ...p, status: "ENDED" }));
          return;
        }

        setBids((prev) => {
          const exists = prev.some(
            (b) => b.amount === bid.amount && b.userName === bid.userName
          );
          if (exists) return prev;
          return [bid, ...prev];
        });
      });
    });
  };

  const disconnectWebSocket = () => {
    if (stompRef.current && connectedRef.current) {
      stompRef.current.disconnect();
      connectedRef.current = false;
    }
  };


  // const minBid=bids[0]?.amount
  //   ? bids[0].amount+1
  //   : auction?.startingPrice || 1;

  const currentPrice = bids[0]?.amount || auction?.startingPrice || 0;

  const calculatedBidAmount = selectedIncrement
    ? currentPrice + selectedIncrement
    : null;


  // const placeBid=async()=>{
  //   if(!agreed){
  //     setShowAgreement(true);
  //     return;
  //   }

  //   if(!bidAmount || bidAmount<minBid) {
  //     alert(`Minimum bid is ₹${minBid}`);
  //     return;
  //   }

  //   await api.post("/bids/place", {
  //     auctionId: Number(id),
  //     userId: user.id,
  //     amount: Number(bidAmount),
  //   });

  //   setBidAmount("");
  // };
  const placeBid = () => {
    if (!selectedIncrement) {
      alert("Please select a bid increment");
      return;
    }

    const finalAmount = currentPrice + selectedIncrement;

    setPendingBid({
      auctionId: Number(id),
      userId: user.id,
      amount: finalAmount,
    });

    setShowAgreement(true);
  };



  if (!auction) {
    return <p className="text-center py-20">Loading...</p>;
  }


  return (
    <main className="min-h-screen bg-gray-50 pb-16 sm:pb-24 md:pb-32">


      <div className="text-center py-8 sm:py-10 px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0b2a55]">
          Live <span className="text-yellow-400">Bidding</span>
        </h1>

        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          Place your bids in real time. Highest bid wins when the auction ends.
          All bids are securely recorded instantly.
        </p>

        <div className="flex justify-center mt-3">
          <span className="h-[3px] w-24 bg-yellow-400"></span>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        <motion.section
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-xl 
                    border-l-4 border-yellow-400 
                    flex flex-col min-h-[480px] lg:h-[560px]"
        >

          <div className="px-4 sm:px-6 py-4 border-b flex items-center gap-2">
            <Gavel className="text-yellow-500" />
            <h2 className="text-lg sm:text-xl font-semibold text-[#0b2a55]">
              Live Bids
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y scrollbar-thin scrollbar-thumb-yellow-400">
            {bids.length === 0 ? (
              <p className="p-6 text-center text-gray-500">
                No bids yet. Be the first!
              </p>
            ) : (
              bids.map((bid, i) => (
                <LiveBidItem key={i} bid={bid} isTop={i === 0} />
              ))
            )}
          </div>


          {auction.status === "LIVE" && (
            <div className="p-4 border-t flex flex-col gap-3">
              {/* <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Minimum bid ₹${minBid}`}
                className="flex-1 border rounded-lg px-4 py-2"
              /> */}
              <div className="flex flex-wrap gap-3">
                {[100, 500, 1000].map((inc) => (
                  <button
                    key={inc}
                    onClick={() => setSelectedIncrement(inc)}
                    className={`px-4 py-2 rounded-lg border font-semibold transition ${selectedIncrement === inc
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    +₹{inc}
                  </button>
                ))}
              </div>

              {calculatedBidAmount && (
                <p className="text-sm text-gray-600">
                  Your Bid Amount: <b>₹{calculatedBidAmount}</b>
                </p>
              )}


              <button
                onClick={placeBid}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold w-full sm:w-auto"
              >
                Place Bid
              </button>
            </div>
          )}
        </motion.section>


        <motion.aside
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 border-t-4 border-[#0b2a55] flex flex-col min-h-[420px] lg:h-[560px]"
        >
          <img
            src={
              auction.imageUrl
                ? toAbsoluteUrl(auction.imageUrl)
                : "/placeholder.png"
            }
            className="h-[220px] sm:h-[260px] w-full object-cover rounded-lg mb-4"
          />


          <h3 className="font-semibold text-lg mb-1">
            {auction.productName}
          </h3>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 
                rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600">Current Price</p>
            <p className="text-2xl font-bold text-[#0b2a55]">
              ₹{bids[0]?.amount || auction.startingPrice}
            </p>
          </div>


          <p className="text-sm text-gray-500 mb-4">
            Auction ID: {auction.id}
          </p>

          <button
            onClick={() => navigate(`/auction/${auction.id}`)}
            className="w-full flex items-center justify-center gap-2
                       border border-[#0b2a55] text-[#0b2a55]
                       py-2 rounded-lg hover:bg-[#0b2a55] hover:text-white transition"
          >
            <Eye size={16} /> View Details
          </button>
        </motion.aside>
      </div>


      <AnimatePresence>
        {showAgreement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-5 sm:p-8 max-w-md w-[92vw] text-center shadow-xl"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-[#0b2a55] mb-4">
                Bidder Agreement
              </h3>
              <p className="text-gray-600 mb-6">
                By bidding, you agree to complete the purchase if you win
                the auction.
              </p>
              <button
                // onClick={() => {
                //   localStorage.setItem("bid_agreed", "yes");
                //   setAgreed(true);
                //   setShowAgreement(false);
                // }}
                onClick={async () => {
                  if (!pendingBid) return;

                  await api.post("api/bids/place", pendingBid);

                  setBids((prev) => {
                    const optimisticBid = {
                      userName: user?.name || "You",
                      amount: pendingBid.amount,
                    };

                    const exists = prev.some(
                      (b) => b.amount === optimisticBid.amount && b.userName === optimisticBid.userName
                    );

                    if (exists) return prev;
                    return [optimisticBid, ...prev];
                  });

                  setSelectedIncrement(null);
                  //setBidAmount("");
                  setPendingBid(null);
                  setShowAgreement(false);
                }}

                className="bg-yellow-400 px-6 py-2 rounded-lg font-semibold"
              >
                I Agree
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}