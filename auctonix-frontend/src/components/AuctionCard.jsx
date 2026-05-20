import { useState } from "react";

export default function AuctionCard({
    auction,
    onView,
    onLiveView,
    showLiveButton = false,
}) {
    const [imageError, setImageError] = useState(false);

    const statusConfig = {
        LIVE: {
            color: "text-red-600",
            dot: "bg-red-600 animate-pulse",
            label: "LIVE"
        },
        UPCOMING: {
            color: "text-blue-600",
            dot: "bg-blue-600 animate-pulse",
            label: "UPCOMING"
        },
        ENDED: {
            color: "text-gray-500",
            dot: "bg-gray-400",
            label: "ENDED"
        }
    }

    const status = statusConfig[auction.status];
    console.log("Auction Object:", auction);

    const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='240'%3E%3Crect fill='%23e8eef5' width='300' height='240'/%3E%3Ctext x='50%25' y='45%25' font-size='16' fill='%239ca3af' text-anchor='middle' dy='.3em'%3EImage Not%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='16' fill='%239ca3af' text-anchor='middle' dy='.3em'%3EAvailable%3C/text%3E%3C/svg%3E";

    return (
        <div className="p-3 sm:p-4 animate-fadeUp transition-all duration-500 
                    hover:-translate-y-2 
                    hover:shadow-2xl 
                    hover:scale-[1.02]">

            <div className="h-44 sm:h-48 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
                <img
                    src={imageError || !auction.imageUrl ? fallbackImage : auction.imageUrl}
                    alt={auction.productName}
                    onError={() => setImageError(true)}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
            </div>

            <div className="p-4">
                {status && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                        <span
                            className={`text-xs font-semibold ${status.color}`}
                        >
                            {status.label}
                        </span>
                    </div>
                )}

                <h3 className="font-semibold text-[#0b2a55] truncate">
                    {auction.productName}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                    Current Price
                </p>

                <p className="text-xl font-bold text-green-600">
                    ₹{auction.currentPrice}
                </p>

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Bids: {auction.bidsCount}</span>
                    <span>
                        Ends:{" "}
                        {new Date(auction.endTime).toLocaleDateString()}
                    </span>
                </div>


                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                    <button
                        onClick={onView}
                        className="relative overflow-hidden flex-1 border border-[#0b2a55]
                            text-[#0b2a55]
                            py-2 rounded-lg
                            hover:bg-[#0b2a55]
                            hover:text-white transition
                            group"

                    >
                        <span className="absolute inset-0 bg-white opacity-10 
                    scale-0 group-hover:scale-100 
                    transition-transform duration-500 rounded-lg" />

                        View Details
                    </button>

                    {showLiveButton && (
                        <button
                            onClick={onLiveView}
                            disabled={auction.status !== "LIVE"}
                            className={`flex-1 py-2 rounded-lg transition ${auction.status === "LIVE"
                                ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                                : "bg-gray-400 text-white cursor-not-allowed"
                                }`}
                        >
                            View Auction
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}