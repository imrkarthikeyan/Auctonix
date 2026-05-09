import api from "../services/api"
import { toAbsoluteUrl } from "./fileUrl";

const enrichAuctions = async (auctions) => {
    return Promise.all(
        auctions.map(async (a) => {
            try {
                const bidsRes = await api.get(`api/bids/auction/${a.id}`);
                const bids = bidsRes.data || [];

                // If backend includes product fields in auction, use them to avoid extra fetch
                const productIncluded = a.basePrice !== undefined && a.basePrice !== null;

                let startingPrice = 0;
                let imageUrl = null;
                let pdfUrl = null;
                let category = null;

                if (productIncluded) {
                    startingPrice = Number(a.basePrice) || 0;
                    imageUrl = a.imageUrl;
                    pdfUrl = a.pdfUrl;
                    category = a.category;
                } else {
                    try {
                        const productRes = await api.get(`api/products/${a.productId}`);
                        const product = productRes.data;
                        startingPrice = Number(product.basePrice) || 0;
                        imageUrl = product.imageUrl;
                        pdfUrl = product.pdfUrl;
                        category = product.category;
                    } catch (err) {
                        // fallback
                        startingPrice = 0;
                    }
                }

                const currentPrice =
                    bids.length > 0
                        ? Math.max(...bids.map(b => Number(b.amount)))
                        : startingPrice;

                return {
                    ...a,
                    startingPrice,
                    currentPrice,
                    bidsCount: bids.length,

                    imageUrl: toAbsoluteUrl(imageUrl),
                    pdfUrl: toAbsoluteUrl(pdfUrl),
                    category
                }
            }
            catch (err) {
                console.error(err);
                return {
                    ...a,
                    currentPrice: 0,
                    bidsCount: 0
                }
            }
        })
    )
}

export { enrichAuctions };