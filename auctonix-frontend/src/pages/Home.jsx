import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hero3 from "../assets/hero3.jpg";
import api from "../services/api";
import AnimatedCounter from "../components/AnimatedCounter";
import AboutUsSection from "./AboutUsSection";
import LiveAuctionsSection from "./LiveAuctionsSection";
import LegalDisclaimerSection from "./LegalDisclaimerSection";

export function Home() {

    const navigate = useNavigate();

    const [totalCount, setTotalCount] = useState(0);
    const [liveCount, setLiveCount] = useState(0);
    const [upcomingCount, setUpcomingCount] = useState(0);

    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        try {
            const [liveRes, upcomingRes, endedRes] = await Promise.all([
                api.get("api/auctions/status/LIVE"),
                api.get("api/auctions/status/UPCOMING"),
                api.get("api/auctions/status/ENDED")
            ]);

            setLiveCount(liveRes.data.length);
            setUpcomingCount(upcomingRes.data.length);
            setTotalCount(liveRes.data.length + upcomingRes.data.length + endedRes.data.length);
        }
        catch (err) {
            console.error("Failed to fetch home counts", err);
        }
    };

    return (
        <main>
            <section className="bg-gradient-to-r from-[#0b2a55] to-[#0e3a75] text-white min-h-[95vh] md:min-h-[110vh] flex flex-center pt-8 md:pt-10 lg:pt-0">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-20 px-4 sm:px-6 items-stretch pb-14 md:pb-20">
                    <div className="flex flex-col justify-center space-y-6 md:space-y-8 order-2 lg:order-1 text-center lg:text-left">
                        <p className="text-lg sm:text-xl md:text-2xl mb-1 md:mb-2 tracking-wide">
                            Welcome to Auctonix
                        </p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                            <span className="block bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-[length:200%_200%] bg-clip-text text-transparent animate-textGlow">
                                AUCTONIX - ONLINE AUCTION PLATFORM
                            </span>
                        </h1>

                        <p className="text-gray-300 mb-5 md:mb-8 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed">
                            India’s trusted digital platform for buying and selling valuable assets through online auctions.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 lg:gap-6 pt-2 md:pt-4 w-full sm:w-auto">
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 sm:px-8 py-3 rounded font-semibold transition"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate("/signup")}
                                className="border border-yellow-500 hover:bg-yellow-400 hover:text-black px-6 sm:px-8 py-3 rounded font-semibold transition"
                            >
                                Sign Up
                            </button>
                        </div>

                    </div>

                    <div className="flex pb-2 md:pb-5 items-center justify-center order-1 lg:order-2">
                        <img src={hero3} alt="Auction" className="animate-float rounded-lg shadow-2xl w-full max-w-[560px] h-[260px] sm:h-[340px] lg:h-[460px] object-cover " />
                    </div>
                </div>
            </section>

            {/* Stats box */}
            <section className="-mt-10 sm:-mt-12 md:-mt-16 mb-10 relative z-10 px-4 sm:px-6">
                <div className="max-w-6xl p-2 mx-auto bg-white rounded-xl shadow-2xl px-5 sm:px-8 md:px-10 py-10 sm:py-14 md:py-20">
                    <h2 className="text-center text-2xl md:text-3xl font-bold 
                        text-yellow-500 mb-12 tracking-wide">
                        STATS
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-gray-500 mb-5 text-xl">
                                Total Auctions
                            </p>
                            <AnimatedCounter value={totalCount} />
                        </div>

                        <div className="text-center">
                            <p className="text-gray-500 mb-5 text-xl">
                                Live Auctions
                            </p>
                            <AnimatedCounter value={liveCount} />
                        </div>

                        <div className="text-center">
                            <p className="text-gray-500 mb-5 text-xl">
                                Upcoming Auctions
                            </p>
                            <AnimatedCounter value={upcomingCount} />
                        </div>
                    </div>
                </div>
            </section>
            <LiveAuctionsSection />
            <AboutUsSection />
            <LegalDisclaimerSection />

        </main>
    )
}