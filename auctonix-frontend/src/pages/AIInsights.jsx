import React, { useMemo, useState } from "react";
import { Activity, ShieldAlert, TrendingUp } from "lucide-react";
import { runMlPrediction } from "../services/mlApi";

const panelClass = "bg-white rounded-2xl border border-[#d7e0ef] shadow-lg p-5 sm:p-7";

export default function AIInsights() {
    const [activeTab, setActiveTab] = useState("BASE_PRICE");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const [priceForm, setPriceForm] = useState({
        category: "Electronics",
        conditionScore: 8,
        ageMonths: 6,
        demandScore: 7,
        bidsLastHour: 3,
        watchers: 28,
        sellerRating: 4.4,
    });

    const [fraudForm, setFraudForm] = useState({
        sellerRating: 3.8,
        accountAgeDays: 120,
        imageQualityScore: 7,
        descriptionLength: 280,
        unusualPriceDropPct: 12,
        previousDisputes: 0,
    });

    const [bidForm, setBidForm] = useState({
        userWinRate: 22,
        budgetMarginPct: 18,
        responseTimeSec: 10,
        competitionLevel: 6,
    });

    const tabs = useMemo(
        () => [
            { key: "BASE_PRICE", label: "Price Estimator", icon: TrendingUp },
            { key: "FRAUD", label: "Fraud Risk", icon: ShieldAlert },
            { key: "BID_SUCCESS", label: "Bid Success", icon: Activity },
        ],
        []
    );

    const handlePredict = async () => {
        setLoading(true);
        setError("");

        try {
            const payload =
                activeTab === "BASE_PRICE"
                    ? priceForm
                    : activeTab === "FRAUD"
                        ? fraudForm
                        : bidForm;

            const data = await runMlPrediction(activeTab, payload);

            if (!data?.success) {
                throw new Error(data?.error || "Prediction failed");
            }

            setResult(data);
        } catch (err) {
            setError(err?.message || "Prediction service unavailable");
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const renderFields = () => {
        if (activeTab === "BASE_PRICE") {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Category">
                        <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={priceForm.category}
                            onChange={(e) => setPriceForm((s) => ({ ...s, category: e.target.value }))}
                        >
                            <option>Electronics</option>
                            <option>Art</option>
                            <option>Fashion</option>
                            <option>Collectibles</option>
                            <option>Automotive</option>
                        </select>
                    </Field>
                    <NumberField label="Condition Score (1-10)" value={priceForm.conditionScore} onChange={(v) => setPriceForm((s) => ({ ...s, conditionScore: v }))} />
                    <NumberField label="Age (months)" value={priceForm.ageMonths} onChange={(v) => setPriceForm((s) => ({ ...s, ageMonths: v }))} />
                    <NumberField label="Demand Score (1-10)" value={priceForm.demandScore} onChange={(v) => setPriceForm((s) => ({ ...s, demandScore: v }))} />
                    <NumberField label="Bids in last hour" value={priceForm.bidsLastHour} onChange={(v) => setPriceForm((s) => ({ ...s, bidsLastHour: v }))} />
                    <NumberField label="Watchers" value={priceForm.watchers} onChange={(v) => setPriceForm((s) => ({ ...s, watchers: v }))} />
                    <NumberField label="Seller Rating (1-5)" value={priceForm.sellerRating} onChange={(v) => setPriceForm((s) => ({ ...s, sellerRating: v }))} />
                </div>
            );
        }

        if (activeTab === "FRAUD") {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NumberField label="Seller Rating (1-5)" value={fraudForm.sellerRating} onChange={(v) => setFraudForm((s) => ({ ...s, sellerRating: v }))} />
                    <NumberField label="Account Age (days)" value={fraudForm.accountAgeDays} onChange={(v) => setFraudForm((s) => ({ ...s, accountAgeDays: v }))} />
                    <NumberField label="Image Quality (1-10)" value={fraudForm.imageQualityScore} onChange={(v) => setFraudForm((s) => ({ ...s, imageQualityScore: v }))} />
                    <NumberField label="Description Length" value={fraudForm.descriptionLength} onChange={(v) => setFraudForm((s) => ({ ...s, descriptionLength: v }))} />
                    <NumberField label="Unusual Price Drop %" value={fraudForm.unusualPriceDropPct} onChange={(v) => setFraudForm((s) => ({ ...s, unusualPriceDropPct: v }))} />
                    <NumberField label="Previous Disputes" value={fraudForm.previousDisputes} onChange={(v) => setFraudForm((s) => ({ ...s, previousDisputes: v }))} />
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberField label="Your Win Rate %" value={bidForm.userWinRate} onChange={(v) => setBidForm((s) => ({ ...s, userWinRate: v }))} />
                <NumberField label="Budget Margin %" value={bidForm.budgetMarginPct} onChange={(v) => setBidForm((s) => ({ ...s, budgetMarginPct: v }))} />
                <NumberField label="Bid Response Time (sec)" value={bidForm.responseTimeSec} onChange={(v) => setBidForm((s) => ({ ...s, responseTimeSec: v }))} />
                <NumberField label="Competition Level (1-10)" value={bidForm.competitionLevel} onChange={(v) => setBidForm((s) => ({ ...s, competitionLevel: v }))} />
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#eef4ff] via-white to-[#f6f8fc] py-10 sm:py-14">
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#0b2a55]">AI Insights Lab</h1>
                    <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                        Use machine learning to estimate fair auction pricing, detect suspicious listings, and improve bid outcomes.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`${panelClass} lg:col-span-2`}>
                        <div className="flex flex-wrap gap-3 mb-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const selected = activeTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => {
                                            setActiveTab(tab.key);
                                            setResult(null);
                                            setError("");
                                        }}
                                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${selected
                                                ? "bg-[#0b2a55] text-white"
                                                : "border border-[#0b2a55]/30 text-[#0b2a55] hover:bg-[#0b2a55] hover:text-white"
                                            }`}
                                    >
                                        <Icon size={16} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {renderFields()}

                        <div className="mt-6">
                            <button
                                onClick={handlePredict}
                                disabled={loading}
                                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
                            >
                                {loading ? "Running model..." : "Run Prediction"}
                            </button>
                        </div>
                    </div>

                    <div className={panelClass}>
                        <h2 className="text-xl font-semibold text-[#0b2a55] mb-4">Prediction Output</h2>

                        {!result && !error && (
                            <p className="text-sm text-gray-500">Run any model to see scored output and confidence details.</p>
                        )}

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        {result && (
                            <div className="space-y-3 text-sm">
                                {result.predictedPrice && (
                                    <div className="bg-[#f7fbff] border border-[#dbe9ff] rounded-lg p-3">
                                        <p className="text-gray-500">Predicted Price</p>
                                        <p className="text-2xl font-bold text-[#0b2a55]">Rs. {Number(result.predictedPrice).toLocaleString()}</p>
                                        <p className="text-gray-500 mt-1">
                                            Suggested Range: Rs. {Number(result.suggestedRange?.[0] || 0).toLocaleString()} - Rs. {Number(result.suggestedRange?.[1] || 0).toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                {result.riskLabel && (
                                    <div className="bg-[#fff7f4] border border-[#ffd9cc] rounded-lg p-3">
                                        <p className="text-gray-500">Fraud Risk</p>
                                        <p className="text-xl font-bold text-[#0b2a55]">{result.riskLabel}</p>
                                        <p className="text-gray-600">Risk score: {(Number(result.riskScore || 0) * 100).toFixed(1)}%</p>
                                        {result.signals?.length > 0 && (
                                            <ul className="mt-2 text-gray-600 list-disc pl-5">
                                                {result.signals.map((sig) => (
                                                    <li key={sig}>{sig}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}

                                {result.successProbability !== undefined && (
                                    <div className="bg-[#f5fff8] border border-[#d2f4de] rounded-lg p-3">
                                        <p className="text-gray-500">Bid Success Chance</p>
                                        <p className="text-xl font-bold text-[#0b2a55]">{(Number(result.successProbability || 0) * 100).toFixed(1)}%</p>
                                        <p className="text-gray-600">Signal: {result.chanceLabel}</p>
                                    </div>
                                )}

                                {result.message && <p className="text-gray-600">{result.message}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-[#0b2a55]">{label}</span>
            <div className="mt-1">{children}</div>
        </label>
    );
}

function NumberField({ label, value, onChange }) {
    return (
        <Field label={label}>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
        </Field>
    );
}
