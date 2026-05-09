import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import api from "../services/api";
import { runMlPrediction } from "../services/mlApi";
import { enrichAuctions } from "../utils/auctionUtils";

export default function SmartRecommendations() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [sourceAuctions, setSourceAuctions] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState({
        budget: 50000,
        preferredCategory: "Electronics",
        riskTolerance: "MEDIUM",
    });

    useEffect(() => {
        loadAuctions();
    }, []);

    const categoryOptions = useMemo(() => {
        const unique = new Set(sourceAuctions.map((a) => a.category).filter(Boolean));
        return ["Electronics", "Art", "Fashion", "Collectibles", "Automotive", ...unique];
    }, [sourceAuctions]);

    const loadAuctions = async () => {
        try {
            const [liveRes, upcomingRes] = await Promise.all([
                api.get("api/auctions/status/LIVE"),
                api.get("api/auctions/status/UPCOMING"),
            ]);

            const merged = [...(liveRes.data || []), ...(upcomingRes.data || [])];
            const enriched = await enrichAuctions(merged);

            const now = Date.now();
            const mapped = enriched.map((a) => ({
                id: a.id,
                productName: a.productName,
                category: a.category || "Electronics",
                currentPrice: Number(a.currentPrice || a.startingPrice || 0),
                bidsCount: Number(a.bidsCount || 0),
                sellerRating: Number(a.sellerRating || 4.2),
                endHours: Math.max(1, (new Date(a.endTime).getTime() - now) / (1000 * 60 * 60)),
                imageUrl: a.imageUrl,
            }));

            setSourceAuctions(mapped);
        } catch (err) {
            setError("Failed to load auctions for recommendation");
        }
    };

    const runRecommendations = async () => {
        setLoading(true);
        setError("");

        try {
            const result = await runMlPrediction("RECOMMENDATION", {
                ...filters,
                auctions: sourceAuctions,
            });

            if (!result?.success) {
                throw new Error(result?.error || "Recommendation failed");
            }

            setRecommendations(result.rankedAuctions || []);
        } catch (err) {
            setError(err?.message || "Could not generate recommendations");
            setRecommendations([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 py-10 sm:py-14">
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#0b2a55]">Smart Recommendations</h1>
                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                        Personalize your bidding strategy with ML-ranked auction opportunities.
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#dde5f3] shadow-lg p-5 sm:p-7">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label>
                            <span className="text-sm font-medium text-[#0b2a55]">Budget (Rs.)</span>
                            <input
                                type="number"
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                value={filters.budget}
                                onChange={(e) => setFilters((s) => ({ ...s, budget: Number(e.target.value) }))}
                            />
                        </label>

                        <label>
                            <span className="text-sm font-medium text-[#0b2a55]">Preferred Category</span>
                            <select
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                value={filters.preferredCategory}
                                onChange={(e) => setFilters((s) => ({ ...s, preferredCategory: e.target.value }))}
                            >
                                {[...new Set(categoryOptions)].map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <span className="text-sm font-medium text-[#0b2a55]">Risk Tolerance</span>
                            <select
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                value={filters.riskTolerance}
                                onChange={(e) => setFilters((s) => ({ ...s, riskTolerance: e.target.value }))}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </label>
                    </div>

                    <div className="mt-5">
                        <button
                            onClick={runRecommendations}
                            disabled={loading || sourceAuctions.length === 0}
                            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
                        >
                            <Sparkles size={18} />
                            {loading ? "Ranking Auctions..." : "Generate Recommendations"}
                        </button>
                    </div>

                    {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {recommendations.map((item) => (
                        <article key={item.id} className="bg-white rounded-2xl border border-[#e3e9f5] shadow-md p-5">
                            <p className="text-xs uppercase tracking-wide text-yellow-600 font-semibold">ML Match Score</p>
                            <p className="text-2xl font-bold text-[#0b2a55] mt-1">{(Number(item.score || 0) * 100).toFixed(1)}%</p>

                            <h3 className="text-lg font-semibold text-[#0b2a55] mt-3">{item.productName}</h3>
                            <p className="text-gray-500 text-sm">{item.category}</p>
                            <p className="mt-2 text-gray-700">Current Price: Rs. {Number(item.currentPrice || 0).toLocaleString()}</p>
                            <p className="mt-2 text-sm text-gray-600">Why: {item.reason}</p>

                            <button
                                onClick={() => navigate(`/auction/${item.id}`)}
                                className="mt-4 w-full border border-[#0b2a55] text-[#0b2a55] rounded-lg py-2 font-semibold hover:bg-[#0b2a55] hover:text-white transition"
                            >
                                Open Auction
                            </button>
                        </article>
                    ))}
                </div>

                {!loading && recommendations.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">No recommendations yet. Generate to see top-ranked auctions.</p>
                )}
            </section>
        </main>
    );
}
