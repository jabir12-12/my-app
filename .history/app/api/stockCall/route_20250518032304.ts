
import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

const SYMBOLS = [
    'INFY.NS', 'TCS.NS', 'HCLTECH.NS',
    'HDFCBANK.NS', 'ICICIBANK.NS', 'SBIN.NS',
    'SUNPHARMA.NS', 'DIVISLAB.NS', 'CIPLA.NS',
    'TATAMOTORS.NS', 'BAJAJ-AUTO.NS', 'EICHERMOT.NS',
    'HINDUNILVR.NS', 'ITC.NS', 'NESTLEIND.NS'
];

export async function GET() {
    try {
        const quotes = await yahooFinance.quote(SYMBOLS);
        const data = (Array.isArray(quotes) ? quotes : [quotes]).map((quote) => ({
            symbol: quote.symbol,
            cmp: quote.regularMarketPrice ?? 0,
            peRatio: quote.trailingPE ?? 0,
            earnings: quote.epsTrailingTwelveMonths ?? 0,
        }));

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}
