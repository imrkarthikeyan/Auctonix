import api from "../services/api"
import { toAbsoluteUrl } from "./fileUrl";

// Cache for bid counts to avoid repeated requests
const bidCache = new Map();

// Batch fetch bid counts for multiple auctions
const batchFetchBidCounts = async (auctionIds) => {
    const missingIds = auctionIds.filter(id => !bidCache.has(id));
    if (missingIds.length === 0) return;

    try {
        // Fetch all bid counts in parallel
        const bidCounts = await Promise.all(
            missingIds.map(id =>
                api.get(`api/bids/auction/${id}`)
                    .then(res => ({ id, bids: res.data || [] }))
                    .catch(() => ({ id, bids: [] }))
            )
        );

        // Cache results
        bidCounts.forEach(({ id, bids }) => {
            const count = bids.length;
            const highestBid = bids.length > 0
                ? Math.max(...bids.map(b => Number(b.amount)))
                : 0;
            bidCache.set(id, { count, highestBid });
        });
    } catch (err) {
        console.warn('Failed to batch fetch bid counts:', err);
    }
};

const enrichAuctions = async (auctions) => {
    if (!auctions || auctions.length === 0) return [];

    // Step 1: Batch fetch all bid counts upfront
    const auctionIds = auctions.map(a => a.id);
    await batchFetchBidCounts(auctionIds);

    // Step 2: Enrich each auction with cached data (synchronous, fast)
    return auctions.map((a) => {
        try {
            // Get cached bid info or defaults
            const bidInfo = bidCache.get(a.id) || { count: 0, highestBid: 0 };

            // Use product data from auction object (backend should include it)
            const startingPrice = Number(a.basePrice || 0) || 0;
            const imageUrl = a.imageUrl || a.productImage || '';
            const pdfUrl = a.pdfUrl || '';
            const category = a.category || 'Uncategorized';

            const currentPrice = bidInfo.highestBid > 0 ? bidInfo.highestBid : startingPrice;

            return {
                ...a,
                startingPrice,
                currentPrice,
                bidsCount: bidInfo.count,
                imageUrl: toAbsoluteUrl(imageUrl),
                pdfUrl: toAbsoluteUrl(pdfUrl),
                category
            };
        } catch (err) {
            console.error('Error enriching auction:', err);
            return {
                ...a,
                startingPrice: 0,
                currentPrice: 0,
                bidsCount: 0,
                imageUrl: toAbsoluteUrl(a.imageUrl || ''),
                category: a.category || 'Uncategorized'
            };
        }
    });
};

// Clear cache periodically to prevent stale data
setInterval(() => {
    bidCache.clear();
}, 5 * 60 * 1000); // Clear every 5 minutes

export { enrichAuctions };