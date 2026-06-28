import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Flame, TrendingUp, CheckCircle } from "lucide-react";

function useCountdown(endTime, status) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (status !== "LIVE" || !endTime) return;

    const calc = () => {
      const diff = new Date(endTime) - Date.now();
      if (diff <= 0) { setLabel("Ending…"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (h > 0) setLabel(`${h}h ${m}m left`);
      else if (m > 0) setLabel(`${m}m ${s}s left`);
      else setLabel(`${s}s left`);
    };

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endTime, status]);

  return label;
}

const statusConfig = {
  LIVE: {
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-500 animate-ping",
    dotStatic: "bg-red-500",
    label: "LIVE",
    Icon: Flame,
  },
  UPCOMING: {
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
    dotStatic: "bg-blue-500",
    label: "UPCOMING",
    Icon: TrendingUp,
  },
  ENDED: {
    color: "text-gray-500",
    bg: "bg-gray-50 border-gray-200",
    dot: "bg-gray-400",
    dotStatic: "bg-gray-400",
    label: "ENDED",
    Icon: CheckCircle,
  },
};

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='240'%3E%3Crect fill='%23e8eef5' width='300' height='240'/%3E%3Ctext x='50%25' y='45%25' font-size='16' fill='%239ca3af' text-anchor='middle' dy='.3em'%3EImage Not%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='16' fill='%239ca3af' text-anchor='middle' dy='.3em'%3EAvailable%3C/text%3E%3C/svg%3E";

export default function AuctionCard({ auction, onView, onLiveView, showLiveButton = false }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const countdown = useCountdown(auction.endTime, auction.status);
  const cfg = statusConfig[auction.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="p-3 sm:p-4"
    >
      {/* Image */}
      <div className="relative h-44 sm:h-48 rounded-xl overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}
        <img
          src={imageError || !auction.imageUrl ? fallbackImage : auction.imageUrl}
          alt={auction.productName}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Status badge overlaid on image */}
        {cfg && (
          <div
            className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.color} ${cfg.bg}`}
          >
            <span className="relative flex h-2 w-2">
              {auction.status === "LIVE" && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-75`} />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dotStatic}`} />
            </span>
            {cfg.label}
          </div>
        )}

        {/* Countdown badge for LIVE */}
        {countdown && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            <Clock size={10} />
            {countdown}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-1 pt-3">
        <h3 className="font-semibold text-[#0b2a55] truncate text-base">
          {auction.productName}
        </h3>

        <div className="flex items-end justify-between mt-2">
          <div>
            <p className="text-xs text-gray-400">Current Price</p>
            <p className="text-xl font-bold text-green-600">₹{Number(auction.currentPrice).toLocaleString("en-IN")}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Bids</p>
            <p className="text-sm font-semibold text-gray-700">{auction.bidsCount}</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-1.5">
          Ends {new Date(auction.endTime).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
          <motion.button
            onClick={onView}
            whileTap={{ scale: 0.96 }}
            className="flex-1 border border-[#0b2a55] text-[#0b2a55] py-2 rounded-lg text-sm font-semibold hover:bg-[#0b2a55] hover:text-white transition-colors duration-200"
          >
            View Details
          </motion.button>

          {showLiveButton && (
            <motion.button
              onClick={onLiveView}
              disabled={auction.status !== "LIVE"}
              whileTap={{ scale: auction.status === "LIVE" ? 0.96 : 1 }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                auction.status === "LIVE"
                  ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {auction.status === "LIVE" ? "Bid Now" : "View Auction"}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
