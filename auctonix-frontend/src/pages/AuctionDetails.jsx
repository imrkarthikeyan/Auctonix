import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toAbsoluteUrl } from "../utils/fileUrl";
import { FileText, Trophy } from "lucide-react";
import OrderTimeline from "../components/OrderTimeline";
import { motion } from "framer-motion";



export function AuctionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;
  }
  catch {
    user = null;
  }



  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [order, setOrder] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loadError, setLoadError] = useState(null);


  const fetchOrder = async () => {
    try {
      const res = await api.get(`api/orders/auction/${id}`);
      setOrder(res.data);
    }
    catch { }
  };

  useEffect(() => {
    fetchOrder();
    const timer = setInterval(fetchOrder, 5000); //every 5 seconds
    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    fetchAuction();
    fetchBids();

    const timer = setInterval(fetchBids, 30000); // auto refresh
    return () => clearInterval(timer);
  }, []);

  const confirmOrder = async () => {
    await api.post(`api/orders/${order.id}/confirm`);
    setShowConfirm(false);
    fetchOrder();
  };

  const pay = async (mode) => {
    await api.post(`api/orders/${order.id}/pay?mode=${mode}`);
    fetchOrder();
  };


  const fetchAuction = async () => {
    try {
      const a = await api.get(`api/auctions/${id}`);
      const p = await api.get(`api/products/${a.data.productId}`);

      setAuction({
        ...a.data,
        productDescription: p.data.description,
        category: p.data.category,
        startingPrice: p.data.basePrice,
        sellerName: p.data.ownerName,
        sellerEmail: p.data.ownerEmail,
        sellerPhone: p.data.ownerPhone,
        imageUrl: p.data.imageUrl ? toAbsoluteUrl(p.data.imageUrl) : null,
        pdfUrl: p.data.pdfUrl ? toAbsoluteUrl(p.data.pdfUrl) : null,
      });
      setLoadError(null);
    } catch (error) {
      setLoadError("Failed to load auction details.");
    }
  };

  const fetchBids = async () => {
    try {
      const res = await api.get(`api/bids/auction/${id}`);
      setBids(res.data);
    } catch {
      setBids([]);
    }
  };

  if (loadError) {
    return <div className="py-20 text-center text-red-600">{loadError}</div>;
  }

  if (!auction) {
    return <div className="py-20 text-center text-gray-500">Loading auction...</div>;
  }


  const currentPrice =
    bids.length > 0
      ? Math.max(...bids.map((b) => b.amount))
      : auction.startingPrice;

  const minBid = currentPrice + 1;

  const isEnded = new Date(auction.endTime) <= new Date();

  const winner =
    isEnded && bids.length > 0
      ? bids.reduce((max, b) => (b.amount > max.amount ? b : max))
      : null;

  const previewBids =
    bids.length <= 5
      ? bids
      : [bids[0], bids[1], { isEllipsis: true }, ...bids.slice(-3)];


  const handlePlaceBid = () => {
    if (!bidAmount || bidAmount < minBid) {
      alert(`Minimum bid is ₹${minBid}`);
      return;
    }

    navigate(`/view-auction/${auction.id}`, {
      state: { bidAmount },
    });
  };

  console.log("LOGGED USER:", user);
  console.log("ORDER DATA:", order);



  return (
    <main className="min-h-screen bg-gray-50 py-10">

      <div className="max-w-7xl mx-auto px-6">


        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#0b2a55]">
            Auction Details
          </h1>
          <div className="flex justify-center mt-2">
            <span className="h-[3px] w-24 bg-yellow-400"></span>
          </div>
        </div>


        <div className="grid md:grid-cols-2 gap-10 items-stretch">


          <div className="bg-white rounded-xl shadow p-6 flex flex-col">
            {auction.imageUrl && (
              <img
                src={auction.imageUrl}
                alt="Product"
                className="h-[360px] w-full object-cover rounded-lg mb-4"
              />
            )}

            {auction.pdfUrl && (
              <a
                href={auction.pdfUrl}
                target="_blank"
                className="inline-flex items-center gap-2 text-blue-600 text-sm mb-6"
              >
                <FileText size={16} /> View Documents
              </a>
            )}

            <div className="mt-auto border-t pt-4">
              <h3 className="font-semibold mb-2">Seller Information</h3>
              <p><b>Name:</b> {auction.sellerName}</p>
              <p><b>Email:</b> {auction.sellerEmail || "N/A"}</p>
              <p><b>Contact:</b> {auction.sellerPhone || "N/A"}</p>
            </div>
          </div>


          <div className="bg-white rounded-xl shadow p-6 flex flex-col">
            <div className="flex gap-2 mb-3">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {auction.category}
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                {auction.status}
              </span>
            </div>

            <h2 className="text-2xl font-semibold mb-2">
              {auction.productName}
            </h2>
            <p className="text-gray-600 mb-6">
              {auction.productDescription}
            </p>


            <div className="grid grid-cols-2 gap-4 mb-6">
              <Info label="Starting Price" value={`₹${auction.startingPrice}`} />
              <Info label="Current Price" value={`₹${currentPrice}`} highlight />
              <Info label="Total Bids" value={bids.length} />
              <Info label="Status" value={isEnded ? "Ended" : "Live"} />
            </div>

            {/* {order && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
                <h4 className="font-semibold">🏆 Winner</h4>
                <p>Name: {order.buyerName}</p>
                <p>Phone: {order.buyerPhone}</p>
              </div>
            )} */}



            {isEnded && bids.length === 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
                <h4 className="font-semibold">❌ Auction Unsold</h4>
                <p className="text-sm text-gray-600">
                  No bids were placed for this auction.
                </p>
              </div>
            )}


            {order && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-4">
                <h4 className="font-semibold">🏆 Winner</h4>
                <p>Name: {order.buyerName}</p>
                <p>Phone: {order.buyerPhone}</p>
              </div>
            )}


            {order?.status === "PENDING_CONFIRMATION" && user?.name === order?.buyerName && (

              <button
                onClick={() => setShowConfirm(true)}
                className="bg-yellow-400 px-4 py-2 rounded font-semibold"
              >
                Confirm Order
              </button>
            )}


            {showConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 40 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 120 }}
                  className="bg-white rounded-2xl w-[520px] p-8 shadow-2xl"
                >
                  <h3 className="text-2xl font-bold text-[#0b2a55] mb-3">
                    📝 Order Confirmation
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    This confirmation is currently for **demo purpose only**.
                    Payments are not real at this stage.
                    We will enhance this module later with **real-time secure payment gateway**.
                  </p>

                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-sm mb-4">
                    ✔ Auction Winner Verification
                    ✔ Sample Order Flow
                    ✔ Payment Simulation
                  </div>

                  <label className="flex gap-2 items-center mb-5 text-sm">
                    <input
                      type="checkbox"
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    I understand this is a demo process.
                  </label>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 border border-gray-300 rounded-lg py-2"
                    >
                      Cancel
                    </button>

                    <button
                      disabled={!agreed}
                      onClick={confirmOrder}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 rounded-lg py-2 font-semibold disabled:opacity-40"
                    >
                      Confirm Order
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}



            {order?.status === "CONFIRMED" && user?.name === order?.buyerName && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <h4 className="font-semibold mb-4 text-[#0b2a55]">
                  💳 Choose Payment Method
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  {/* ONLINE */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer bg-gradient-to-br from-[#0b2a55] to-[#123d7a] 
                                text-white rounded-xl p-5 shadow-lg"
                    onClick={() => pay("ONLINE")}
                  >
                    <h5 className="font-semibold text-lg">Online Payment</h5>
                    <p className="text-sm opacity-80 mt-2">
                      Pay using UPI / Card / Netbanking
                    </p>
                  </motion.div>

                  {/* COD */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer bg-yellow-400 text-black rounded-xl p-5 shadow-lg"
                    onClick={() => pay("COD")}
                  >
                    <h5 className="font-semibold text-lg">Cash On Delivery</h5>
                    <p className="text-sm mt-2">
                      Pay when product is delivered
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}


            {order && <OrderTimeline status={order.status} />}



            {!isEnded && auction.status === "LIVE" && (
              <div className="mt-auto">
                <p className="text-sm mb-2">Minimum Bid ₹{minBid}</p>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full border rounded px-3 py-2 mb-3"
                />
                <button
                  onClick={handlePlaceBid}
                  className="w-full bg-[#0b2a55] text-white py-2 rounded hover:bg-[#09305f]"
                >
                  Place Bid
                </button>
              </div>
            )}
          </div>
        </div>


        <div className="mt-12 bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Bid History</h3>

          {bids.length === 0 ? (
            <p className="text-gray-500">No bids yet</p>
          ) : (
            <div className="divide-y">
              {previewBids.map((b, i) =>
                b.isEllipsis ? (
                  <div key={i} className="py-2 text-center text-gray-400">...</div>
                ) : (
                  <div key={i} className="py-2 flex justify-between">
                    <span>{b.userName}</span>
                    <span className="font-medium">₹{b.amount}</span>
                  </div>
                )
              )}
            </div>
          )}

          {bids.length > 5 && (
            <button
              onClick={() => setShowHistory(true)}
              className="mt-4 px-4 py-2 bg-yellow-400 rounded font-semibold"
            >
              View Full History
            </button>
          )}
        </div>
      </div>


      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-lg rounded-xl p-6"
          >
            <h3 className="font-semibold mb-4">Full Bid History</h3>

            <div className="divide-y max-h-[400px] overflow-y-auto">
              {bids.map((b, i) => (
                <div key={i} className="py-2 flex justify-between">
                  <span>{b.userName}</span>
                  <span className="font-medium">₹{b.amount}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowHistory(false)}
              className="mt-4 w-full bg-[#0b2a55] text-white py-2 rounded"
            >
              Back to Details
            </button>
          </motion.div>
        </div>
      )}
    </main>
  );
}


const Info = ({ label, value, highlight }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`font-semibold ${highlight ? "text-green-600" : ""}`}>
      {value}
    </p>
  </div>
);