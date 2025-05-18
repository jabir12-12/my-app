import React from "react";
import { ResponsiveContainer, Tooltip, TooltipProps, PieChart, Pie, Cell } from "recharts";

interface StockData {
    symbol: string;
    category: string;
    purchasePrice: number;
    quantity: number;
    cmp: number; // current market price
}

const BASE_STOCKS: StockData[] = [
    { symbol: "INFY.NS", category: "IT", purchasePrice: 1650, quantity: 20, cmp: 1700 },
    { symbol: "TCS.NS", category: "IT", purchasePrice: 3800, quantity: 10, cmp: 3750 },
    { symbol: "HCLTECH.NS", category: "IT", purchasePrice: 1700, quantity: 25, cmp: 1800 },

    { symbol: "HDFCBANK.NS", category: "Finance", purchasePrice: 1500, quantity: 15, cmp: 1550 },
    { symbol: "ICICIBANK.NS", category: "Finance", purchasePrice: 750, quantity: 30, cmp: 800 },
    { symbol: "SBIN.NS", category: "Finance", purchasePrice: 420, quantity: 40, cmp: 430 },

    { symbol: "SUNPHARMA.NS", category: "Pharma", purchasePrice: 950, quantity: 18, cmp: 960 },
    { symbol: "DIVISLAB.NS", category: "Pharma", purchasePrice: 4800, quantity: 10, cmp: 4900 },
    { symbol: "CIPLA.NS", category: "Pharma", purchasePrice: 850, quantity: 22, cmp: 870 },

    { symbol: "TATAMOTORS.NS", category: "Auto", purchasePrice: 350, quantity: 50, cmp: 360 },
    { symbol: "BAJAJ-AUTO.NS", category: "Auto", purchasePrice: 4200, quantity: 8, cmp: 4250 },
    { symbol: "EICHERMOT.NS", category: "Auto", purchasePrice: 2800, quantity: 12, cmp: 2900 },

    { symbol: "HINDUNILVR.NS", category: "FMCG", purchasePrice: 2500, quantity: 14, cmp: 2550 },
    { symbol: "ITC.NS", category: "FMCG", purchasePrice: 240, quantity: 60, cmp: 245 },
    { symbol: "NESTLEIND.NS", category: "FMCG", purchasePrice: 18000, quantity: 5, cmp: 18100 },
];

interface SectorData {
    category: string;
    investedValue: number;
    currentValue: number;
    fill: string;
    investedPercent?: string;
    currentPercent?: string;
}

const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FFCD56",
    "#4D5360",
    "#C9CBCF",
    "#B2FF66",
];

// Group stocks by category and aggregate invested and current values
const sectorAggregatedData = (): SectorData[] => {
    const sectorMap = new Map<string, SectorData>();

    BASE_STOCKS.forEach(({ category, purchasePrice, quantity, cmp }) => {
        const invested = purchasePrice * quantity;
        const current = cmp * quantity;

        if (!sectorMap.has(category)) {
            sectorMap.set(category, {
                category,
                investedValue: invested,
                currentValue: current,
                fill: "", // fill will be assigned later
            });
        } else {
            const existing = sectorMap.get(category)!;
            existing.investedValue += invested;
            existing.currentValue += current;
        }
    });

    // Assign colors
    const sectors = Array.from(sectorMap.values());
    sectors.forEach((sector, i) => {
        sector.fill = COLORS[i % COLORS.length];
    });

    // Calculate total invested and current for percentages
    const totalInvested = sectors.reduce((acc, s) => acc + s.investedValue, 0);
    const totalCurrent = sectors.reduce((acc, s) => acc + s.currentValue, 0);

    // Add percentage strings
    sectors.forEach((sector) => {
        sector.investedPercent = ((sector.investedValue / totalInvested) * 100).toFixed(2);
        sector.currentPercent = ((sector.currentValue / totalCurrent) * 100).toFixed(2);
    });

    return sectors;
};

interface CustomPieTooltipProps extends TooltipProps<number, string> {
    active?: boolean;
    payload?: {
        payload: SectorData;
        name: string;
        value: number;
    }[];
}

const CustomPieTooltip: React.FC<CustomPieTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { category, investedPercent, currentPercent, fill } = payload[0].payload;

        return (
            <div
                style={{
                    backgroundColor: "white",
                    border: `1px solid ${fill}`,
                    borderRadius: 8,
                    padding: 10,
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                    minWidth: 150,
                }}
            >
                <strong style={{ color: fill }}>{category}</strong>
                <p>Invested: {investedPercent}%</p>
                <p>Current: {currentPercent}%</p>
            </div>
        );
    }
    return null;
};

export default function PieChartComponent() {
    const data = sectorAggregatedData();

    return (
        <div className="flex flex-col md:flex-row w-full items-center gap-4 justify-between">
            {/* Invested Value Pie */}
            <div className="flex flex-col w-full md:w-1/2 gap-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex flex-col gap-1">
                    <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Invested Value</h1>
                    <span className="text-gray-500 text-sm">
                        This analysis shows your invested value categorized by sectors.
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Tooltip content={<CustomPieTooltip />} cursor={false} />
                        <Pie
                            data={data}
                            dataKey="investedValue"
                            nameKey="category"
                            innerRadius={60}
                            outerRadius={120}
                            stroke="#fff"
                            fill="#8884d8"
                        >

                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Current Value Pie */}
            <div className="flex flex-col w-full md:w-1/2 gap-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex flex-col gap-1">
                    <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Current Value</h1>
                    <span className="text-gray-500 text-sm">
                        This analysis shows the current value of your stocks categorized by sectors.
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Tooltip content={<CustomPieTooltip />} cursor={false} />
                        <Pie
                            data={data}
                            dataKey="currentValue"
                            nameKey="category"
                            innerRadius={60}
                            outerRadius={120}
                            stroke="#fff"
                            fill="#8884d8"
                            label={({ category, currentPercent }) => `${category}: ${currentPercent}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`current-cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
