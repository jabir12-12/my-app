import type { NextApiRequest, NextApiResponse } from 'next';
import yahooFinance from 'yahoo-finance2';

// ✅ Diversified Stocks: 5 Categories × 3 Stocks Each
const SYMBOLS = [
    // 🖥️ Information Technology
    'INFY.NS',     // Infosys Ltd.
    'TCS.NS',      // Tata Consultancy Services Ltd.
    'HCLTECH.NS',  // HCL Technologies Ltd.

    // 🏦 Banking
    'HDFCBANK.NS',   // HDFC Bank Ltd.
    'ICICIBANK.NS',  // ICICI Bank Ltd.
    'SBIN.NS',       // State Bank of India

    // 💊 Pharmaceuticals
    'SUNPHARMA.NS',   // Sun Pharmaceutical Industries Ltd.
    'DIVISLAB.NS',    // Divi’s Laboratories Ltd.
    'CIPLA.NS',       // Cipla Ltd.

    // 🚗 Automobile
    'TATAMOTORS.NS',  // Tata Motors Ltd.
    'BAJAJ-AUTO.NS',  // Bajaj Auto Ltd.
    'EICHERMOT.NS',   // Eicher Motors Ltd.

    // 🛍️ FMCG
    'HINDUNILVR.NS',  // Hindustan Unilever Ltd.
    'ITC.NS',         // ITC Ltd.
    'NESTLEIND.NS'    // Nestle India Ltd.
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const quotes = await yahooFinance.quote(SYMBOLS);

        const data = (Array.isArray(quotes) ? quotes : [quotes]).map((quote) => ({
            symbol: quote.symbol,
            cmp: quote.regularMarketPrice ?? 0,
            peRatio: quote.trailingPE ?? 0,
            earnings: quote.epsTrailingTwelveMonths ?? 0,
        }));

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
    }
}
