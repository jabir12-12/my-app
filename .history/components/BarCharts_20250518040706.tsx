import { BarLoader } from "react-spinners";
import React, { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface StockData {
    symbol: string;
    category: string;
    purchasePrice: number;
    quantity: number;
    cmp: number;  // current market price
}

const BASE_STOCKS = [
    { symbol: 'INFY.NS', category: 'IT', purchasePrice: 1650, quantity: 20 },
    { symbol: 'TCS.NS', category: 'IT', purchasePrice: 3800, quantity: 10 },
    { symbol: 'HCLTECH.NS', category: 'IT', purchasePrice: 1700, quantity: 25 },

    { symbol: 'HDFCBANK.NS', category: 'Finance', purchasePrice: 1500, quantity: 15 },
    { symbol: 'ICICIBANK.NS', category: 'Finance', purchasePrice: 750, quantity: 30 },
    { symbol: 'SBIN.NS', category: 'Finance', purchasePrice: 420, quantity: 40 },

    { symbol: 'SUNPHARMA.NS', category: 'Pharma', purchasePrice: 950, quantity: 18 },
    { symbol: 'DIVISLAB.NS', category: 'Pharma', purchasePrice: 4800, quantity: 10 },
    { symbol: 'CIPLA.NS', category: 'Pharma', purchasePrice: 850, quantity: 22 },

    { symbol: 'TATAMOTORS.NS', category: 'Auto', purchasePrice: 350, quantity: 50 },
    { symbol: 'BAJAJ-AUTO.NS', category: 'Auto', purchasePrice: 4200, quantity: 8 },
    { symbol: 'EICHERMOT.NS', category: 'Auto', purchasePrice: 2800, quantity: 12 },

    { symbol: 'HINDUNILVR.NS', category: 'FMCG', purchasePrice: 2500, quantity: 14 },
    { symbol: 'ITC.NS', category: 'FMCG', purchasePrice: 240, quantity: 60 },
    { symbol: 'NESTLEIND.NS', category: 'FMCG', purchasePrice: 18000, quantity: 5 },
];

// Helper to aggregate by category for chart
function aggregateByCategory(stocks: StockData[]) {
    const categoryMap: Record<string, { invested: number; current: number }> = {};

    stocks.forEach(({ category, purchasePrice, quantity, cmp }) => {
        if (!categoryMap[category]) {
            categoryMap[category] = { invested: 0, current: 0 };
        }
        categoryMap[category].invested += purchasePrice * quantity;
        categoryMap[category].current += cmp * quantity;
    });

    return Object.entries(categoryMap).map(([name, values]) => {
        const gainLoss = values.current - values.invested;
        return {
            name,
            invested: values.invested,
            current: values.current,
            gainLoss,
        };
    });

}

export default function BarChartComponent() {
    const [stocks, setStocks] = useState<StockData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/stockCall');
                const json = await res.json();

                if (json.success) {
                    // Map cmp prices by symbol
                    const pricesMap: Record<string, number> = {};
                    json.data.forEach((stock: { symbol: string; cmp: number }) => {
                        pricesMap[stock.symbol] = stock.cmp;
                    });

                    // Merge cmp prices into base stocks
                    const updatedStocks: StockData[] = BASE_STOCKS.map(stock => ({
                        ...stock,
                        cmp: pricesMap[stock.symbol] ?? stock.purchasePrice,
                    }));

                    setStocks(updatedStocks);
                } else {
                    console.error("Failed to load stock prices:", json.error);
                    // Fallback to purchasePrice if API fails
                    const fallbackStocks = BASE_STOCKS.map(stock => ({
                        ...stock,
                        cmp: stock.purchasePrice,
                    }));
                    setStocks(fallbackStocks);
                }
            } catch (err) {
                console.error("Error fetching stock prices:", err);
                // Fallback to purchasePrice on error
                const fallbackStocks = BASE_STOCKS.map(stock => ({
                    ...stock,
                    cmp: stock.purchasePrice,
                }));
                setStocks(fallbackStocks);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column',
                }}
            >
                <BarLoader
                    color="#8501FF"
                    height={4}
                    width={100}
                    speedMultiplier={1.5} // makes it feel faster
                    cssOverride={{
                        margin: "20px auto",
                        display: "block",
                        borderRadius: "4px"
                    }}
                />
            </div>
        );
    }


    const barChartData = aggregateByCategory(stocks);

    return (
        <div className="flex flex-col gap-5 border border-gray-200 rounded-lg p-4 bg-white shadow-sm max-w-full w-full sm:w-[90vw] md:w-[600px] lg:w-[700px] mx-auto">
            <h1 className="text-gray-900 font-semibold text-xl sm:text-2xl md:text-3xl">
                Invested Value by Sector
            </h1>
            <div className="text-gray-500 text-sm">
                Note: This chart shows the invested value and current value of stocks categorized by sector.
                Gain/Loss is calculated as the difference between current value and invested value.
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={barChartData}
                    barGap={5}
                    barCategoryGap="30%"
                    margin={{ right: 20, left: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                    <XAxis
                        dataKey="name"
                        fontFamily="poppins"
                        fontSize={14}
                        fontWeight={400}
                        fill="#667085"
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        domain={[0, 'dataMax']}
                        fontFamily="poppins"
                        fontSize={14}
                        fontWeight={400}
                        fill="#667085"
                    />
                    <Tooltip
                        cursor={false}
                        isAnimationActive={true}
                        content={({ active, payload, label }) => {
                            if (!active || !payload || payload.length === 0) return null;

                            const invested = Number(payload.find(p => p.dataKey === 'invested')?.value) || 0;
                            const current = Number(payload.find(p => p.dataKey === 'current')?.value) || 0;
                            const gainLoss = Math.abs(current - invested);
                            const gainLossColor = current >= invested ? "#17B26A" : "#F04438";

                            return (
                                <div style={{ backgroundColor: 'white', padding: 10, border: '1px solid #ccc' }}>
                                    <p style={{ marginBottom: 8, fontWeight: 'bold' }}>{label}</p>
                                    <p style={{ color: '#9012FF' }}>
                                        Invested: ₹{invested.toLocaleString("en-IN")}
                                    </p>
                                    <p style={{ color: '#791F89' }}>
                                        Current: ₹{current.toLocaleString("en-IN")}
                                    </p>
                                    <p style={{ color: gainLossColor }}>
                                        Gain/Loss: ₹{gainLoss.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            );
                        }}
                    />
                    <Legend wrapperStyle={{ display: 'none' }} />
                    <Bar dataKey="invested" name="Invested" fill="#9012FF" barSize={30} />
                    <Bar dataKey="current" name="Current" fill="#791F89" barSize={30} />
                    <Bar dataKey="gainLoss" name="Gain/Loss" barSize={30}>
                        {barChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.gainLoss >= 0 ? "#17B26A" : "#F04438"} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <div className='flex flex-row items-center justify-center gap-6'>
                <div className='flex flex-row gap-2 items-center'>
                    <div className='rounded-full w-3 h-3 bg-[#9012FF]'></div>
                    <span className="text-gray-500 text-md">Invested</span>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                    <div className='rounded-full w-3 h-3 bg-[#791F89]'></div>
                    <span className="text-gray-500 text-md">Current</span>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                    <div className='rounded-full w-3 h-3 bg-[#17B26A]'></div> {/* Green for Gain */}
                    <div className='rounded-full w-3 h-3 bg-[#F04438]'></div> {/* Red for Loss */}
                    <span className="text-gray-500 text-md">Gain/Loss</span>
                </div>
            </div>

        </div>
    );
}
