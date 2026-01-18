import api from "../services/api"
import { toAbsoluteUrl } from "./fileUrl";

const enrichAuctions=async(auctions)=>{
    return Promise.all(
        auctions.map(async(a)=>{
            try{
                const [bidsRes,productRes]=await Promise.all([
                    api.get(`api/bids/auction/${a.id}`),
                    api.get(`api/products/${a.productId}`)
                ])

                const bids=bidsRes.data || [];
                const product=productRes.data;

                const startingPrice=Number(product.basePrice) || 0;
                const currentPrice=
                    bids.length>0
                    ? Math.max(...bids.map(b=>Number(b.amount)))
                    : startingPrice;

                return{
                    ...a,
                    startingPrice,
                    currentPrice,
                    bidsCount:bids.length,

                    imageUrl:toAbsoluteUrl(product.imageUrl),
                    pdfUrl:toAbsoluteUrl(product.pdfUrl),
                    category:product.category
                }
            }
            catch(err){
                console.error(err);
                return{
                    ...a,
                    currentPrice:0,
                    bidsCount:0
                }
            }
        })
    )
}

export {enrichAuctions};