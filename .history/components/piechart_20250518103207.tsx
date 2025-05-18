import React, { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";
import { ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { PieChart, Pie, Cell } from "recharts";

interface Stock {
    symbol: string;
    category: string;
    purchasePrice: number;
    quantity: number;
}

interface StockData {
    symbol: string;
    cmp: number; // current market price
}



// Original stock purchase data
const BASE_STOCKS: Stock[] = [
    { symbol: "INFY.NS", category: "IT", purchasePrice: 1650, quantity: 20 },
    { symbol: "TCS.NS", category: "IT", purchasePrice: 3800, quantity: 10 },
    { symbol: "HCLTECH.NS", category: "IT", purchasePrice: 1700, quantity: 25 },
    { symbol: "HDFCBANK.NS", category: "Finance", purchasePrice: 1500, quantity: 15 },
    { symbol: "ICICIBANK.NS", category: "Finance", purchasePrice: 750, quantity: 30 },
    { symbol: "SBIN.NS", category: "Finance", purchasePrice: 420, quantity: 40 },
    { symbol: "SUNPHARMA.NS", category: "Pharma", purchasePrice: 950, quantity: 18 },
    { symbol: "DIVISLAB.NS", category: "Pharma", purchasePrice: 4800, quantity: 10 },
    { symbol: "CIPLA.NS", category: "Pharma", purchasePrice: 850, quantity: 22 },
    { symbol: "TATAMOTORS.NS", category: "Auto", purchasePrice: 350, quantity: 50 },
    { symbol: "BAJAJ-AUTO.NS", category: "Auto", purchasePrice: 4200, quantity: 8 },
    { symbol: "EICHERMOT.NS", category: "Auto", purchasePrice: 2800, quantity: 12 },
    { symbol: "HINDUNILVR.NS", category: "FMCG", purchasePrice: 2500, quantity: 14 },
    { symbol: "ITC.NS", category: "FMCG", purchasePrice: 240, quantity: 60 },
    { symbol: "NESTLEIND.NS", category: "FMCG", purchasePrice: 18000, quantity: 5 },
];

// Color palette for each stock
const getStockColor = (index: number, total: number) => {
    // Generate colors across a spectrum
    const hue = Math.floor((index / total) * 360);
    return `hsl(${hue}, 70%, 60%)`;
};

export default function PieChartComponent() {
    const [stockPrices, setStockPrices] = useState<StockData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/stockCall');
                const result = await response.json();

                if (result.success) {
                    setStockPrices(result.data);
                } else {
                    setError("Failed to fetch stock data");
                }
            } catch (err) {
                setError("Error fetching stock data: " + (err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, []);

    // Prepare invested and current value data for pie charts
    const prepareChartData = () => {
        // Calculate total invested first
        const totalInvested = BASE_STOCKS.reduce(
            (sum, stock) => sum + stock.purchasePrice * stock.quantity,
            0
        );

        // Get current market prices from API data
        const currentPriceMap = stockPrices.reduce((map, stock) => {
            map[stock.symbol] = stock.cmp;
            return map;
        }, {} as Record<string, number>);

        // Calculate total current value
        const totalCurrent = BASE_STOCKS.reduce(
            (sum, stock) => {
                // Use API price if available, otherwise fallback to purchase price
                const cmp = currentPriceMap[stock.symbol] || stock.purchasePrice;
                return sum + cmp * stock.quantity;
            },
            0
        );

        // Prepare data for each stock
        const investedData = BASE_STOCKS.map((stock, index) => {
            const investedValue = stock.purchasePrice * stock.quantity;
            const percentage = ((investedValue / totalInvested) * 100).toFixed(2);
            return {
                name: stock.symbol,
                value: investedValue,
                fill: getStockColor(index, BASE_STOCKS.length),
                percentage,
            };
        });

        const currentData = BASE_STOCKS.map((stock, index) => {
            const cmp = currentPriceMap[stock.symbol] || stock.purchasePrice;
            const currentValue = cmp * stock.quantity;
            const investedValue = stock.purchasePrice * stock.quantity;
            const change = ((currentValue - investedValue) / investedValue) * 100;
            const percentage = ((currentValue / totalCurrent) * 100).toFixed(2);
            return {
                name: stock.symbol,
                value: currentValue,
                fill: getStockColor(index, BASE_STOCKS.length),
                percentage,
                change,
            };
        });

        // Sort by value (largest first) for better visualization
        investedData.sort((a, b) => b.value - a.value);
        currentData.sort((a, b) => b.value - a.value);

        return { investedData, currentData, totalInvested, totalCurrent };
    };

    const chartData = prepareChartData();

    // Custom Tooltip showing name, value and percentage + change if available
    const CustomPieTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const name = data.name;
            const value = data.value;
            const fill = data.payload?.fill;
            const percentage = data.payload?.percentage;
            const change = data.payload?.change;

            return (
                <div
                    className="flex flex-col gap-1 p-3 rounded shadow-lg"
                    style={{
                        backgroundColor: "white",
                        border: "1px solid #EAECF0",
                        minWidth: "180px",
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span
                            style={{
                                display: "inline-block",
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                backgroundColor: fill,
                            }}
                        />
                        <p className="font-semibold text-gray-700">{name}</p>
                    </div>
                    <p className="text-gray-900 font-semibold">
                        ₹{value?.toLocaleString("en-IN") ?? '0'}
                    </p>
                    <p className="text-gray-500 text-sm">{percentage}% of total</p>
                    {change !== undefined && (
                        <p
                            style={{ color: change >= 0 ? "green" : "red" }}
                            className="font-semibold"
                        >
                            {change >= 0 ? "+" : ""}
                            {change.toFixed(2)}% change
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

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

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">Oops, sorry! We couldn't fetch the data.</p>
            </div>

        );
    }

    return (
        <div className="flex flex-col md:flex-row w-full items-center gap-4 justify-between">
            {/* Invested Value Chart */}
            <div className="flex flex-col w-full md:w-1/2 gap-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex flex-col gap-1">
                    <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">
                        Invested Value
                    </h1>
                    <span className="text-gray-500 text-sm">
                        Total Invested: ₹{chartData.totalInvested.toLocaleString("en-IN")}
                    </span>
                    <span className="text-gray-500 text-sm">
                        Each slice represents an individual stock's portion of your total investment.
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={300} className="flex">
                    <PieChart>
                        <Tooltip content={<CustomPieTooltip />} cursor={false} />
                        <Pie
                            data={chartData.investedData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={120}
                            stroke="#FFFFFF"
                        >
                            {chartData.investedData.map((entry, index) => (
                                <Cell key={`cell-invested-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Current Value Chart */}
            <div className="flex flex-col w-full md:w-1/2 gap-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex flex-col gap-1">
                    <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">
                        Current Value
                    </h1>
                    <span className="text-gray-500 text-sm">
                        Total Current Value: ₹{chartData.totalCurrent.toLocaleString("en-IN")}
                    </span>
                    <span className="text-gray-500 text-sm">
                        Each slice represents an individual stock's current value as a portion of your total portfolio.
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={300} className="flex">
                    <PieChart>
                        <Tooltip content={<CustomPieTooltip />} cursor={false} />
                        <Pie
                            data={chartData.currentData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={120}
                            stroke="#FFFFFF"
                        >
                            {chartData.currentData.map((entry, index) => (
                                <Cell key={`cell-current-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}