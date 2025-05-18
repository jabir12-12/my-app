import React from "react";
import { ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { PieChart, Pie, Cell } from "recharts";

interface StockData {
    cmp: number; // current market price
}

interface Stock {
    symbol: string;
    category: string;
    purchasePrice: number;
    quantity: number;
}

interface PieChartData {
    name: string;
    value: number;
    fill: string;
    percentage: string;
    change?: number; // percent change
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

// Simulated current market prices (cmp) for each symbol (replace with your API data)
const currentMarketPrices: Record<string, number> = {
    "INFY.NS": 1700,
    "TCS.NS": 3900,
    "HCLTECH.NS": 1600,
    "HDFCBANK.NS": 1550,
    "ICICIBANK.NS": 740,
    "SBIN.NS": 430,
    "SUNPHARMA.NS": 970,
    "DIVISLAB.NS": 4700,
    "CIPLA.NS": 900,
    "TATAMOTORS.NS": 360,
    "BAJAJ-AUTO.NS": 4300,
    "EICHERMOT.NS": 2750,
    "HINDUNILVR.NS": 2550,
    "ITC.NS": 250,
    "NESTLEIND.NS": 18500,
};

// Color palette for sectors (just example colors)
const sectorColors: Record<string, string> = {
    IT: "#36A2EB",
    Finance: "#4BC0C0",
    Pharma: "#FF6384",
    Auto: "#FFCE56",
    FMCG: "#9966FF",
};

// Prepare invested and current value data for pie charts
const investedData: PieChartData[] = BASE_STOCKS.map((stock) => {
    const investedValue = stock.purchasePrice * stock.quantity;
    return {
        name: stock.symbol,
        value: investedValue,
        fill: sectorColors[stock.category] || "#8884d8",
        percentage: "", // will calculate after total
    };
});

const currentData: PieChartData[] = BASE_STOCKS.map((stock) => {
    const cmp = currentMarketPrices[stock.symbol] ?? stock.purchasePrice; // fallback to purchasePrice if no cmp
    const currentValue = cmp * stock.quantity;
    const investedValue = stock.purchasePrice * stock.quantity;
    const change = ((currentValue - investedValue) / investedValue) * 100;
    return {
        name: stock.symbol,
        value: currentValue,
        fill: sectorColors[stock.category] || "#8884d8",
        percentage: "", // calculate after total
        change,
    };
});

// Calculate totals
const totalInvested = investedData.reduce((sum, d) => sum + d.value, 0);
const totalCurrent = currentData.reduce((sum, d) => sum + d.value, 0);

// Add percentage for each slice
investedData.forEach((d) => {
    d.percentage = ((d.value / totalInvested) * 100).toFixed(2);
});
currentData.forEach((d) => {
    d.percentage = ((d.value / totalCurrent) * 100).toFixed(2);
});

// Custom Tooltip showing name, value and percentage + change if available
const CustomPieTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const {
            name,
            value,
            payload: { fill, percentage, change },
        } = payload[0];

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

export default function PieChartComponent() {
    return (
        <div className="flex flex-col md:flex-row w-full items-center gap-4 justify-between">
            {/* Invested Value Chart */}
            <div className="flex flex-col w-full md:w-1/2 gap-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex flex-col gap-1">
                    <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">
                        Invested Value
                    </h1>
                    <span className="text-gray-500 text-sm">
                        Note: This analysis shows each stock you have invested in, categorized by sectors based on the invested value.
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={300} className="flex">
                    <PieChart>
                        <Tooltip content={<CustomPieTooltip />} cursor={false} />
                        <Pie
                            data={investedData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={120}
                            stroke="#FFFFFF"
                        >
                            {investedData.map((entry, index) => (
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
                        Note: This analysis shows the current value of each stock, categorized by sectors based on the current market price.
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={300} className="flex">
                    <PieChart>
                        <Tooltip content={<CustomPieTooltip />} cursor={false} />
                        <Pie
                            data={currentData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={120}
                            stroke="#FFFFFF"
                        >
                            {currentData.map((entry, index) => (
                                <Cell key={`cell-current-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
