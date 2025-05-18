
import { ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { PieChart, Pie, Cell } from 'recharts';
interface PieChartData {
    name: string;
    visitors: number;
    fill: string;
    percentage: string;
}

interface PieTooltipProps extends TooltipProps<number, string> {
    active?: boolean;
    payload?: {
        name: string;
        value: number;
        payload: PieChartData;
    }[];
}

const Investedvalue = [
    { name: "Tata Motors", sector: "Automobile", visitors: 100000, percentage: 10, fill: "#FF6384" },
    { name: "Reliance", sector: "Energy", visitors: 150000, percentage: 15, fill: "#36A2EB" },
    { name: "Infosys", sector: "IT", visitors: 200000, percentage: 20, fill: "#FFCE56" },
    { name: "HDFC", sector: "Finance", visitors: 80000, percentage: 8, fill: "#4BC0C0" },
    { name: "ITC", sector: "FMCG", visitors: 120000, percentage: 12, fill: "#9966FF" },
    { name: "Airtel", sector: "Telecom", visitors: 70000, percentage: 7, fill: "#FF9F40" },
    { name: "Maruti", sector: "Automobile", visitors: 130000, percentage: 13, fill: "#FFCD56" },
    { name: "ICICI", sector: "Finance", visitors: 60000, percentage: 6, fill: "#4D5360" },
    { name: "Asian Paints", sector: "Chemicals", visitors: 90000, percentage: 9, fill: "#C9CBCF" },
    { name: "SBI", sector: "Finance", visitors: 90000, percentage: 9, fill: "#B2FF66" },
];
// Calculate total invested amount
const totalInvested = Investedvalue.reduce((sum, stock) => sum + stock.visitors, 0);

// Prepare data with percentage for Pie chart
const pieChartFormattedData = Investedvalue.map((stock) => ({
    name: stock.name,
    visitors: stock.visitors,
    fill: stock.fill,
    percentage: ((stock.visitors / totalInvested) * 100).toFixed(2),
}));

const CustomPieTooltip: React.FC<PieTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const {
            name,
            value,
            payload: { fill, visitors },
        } = payload[0];

        return (
            <div
                className="flex flex-row items-center justify-between w-40"
                style={{
                    backgroundColor: 'white',
                    border: '1px solid #EAECF0',
                    borderRadius: '8px',
                    padding: '10px',
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
                }}
            >
                <div className="flex flex-row items-center">
                    <span style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: fill,
                        marginRight: '8px'
                    }} />
                    <p className="flex items-center text-sm font-semibold text-[#667085]">{name}</p>
                </div>
                <p className="text-[0.938rem] font-semibold text-[#1D2939]">
                    ₹{(visitors ?? value ?? 0).toLocaleString("en-IN")}
                </p>
            </div>
        );
    }
    return null;
};

export default function PieChartComponent() {
    return (
        <div className='flex flex-col md:flex-row w-full items-center gap-4 justify-between'>
            <div className='flex flex-col w-full md:w-1/2 gap-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm'>
                <div className='flex flex-col gap-1'>
                    <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Invested Value</h1>
                    <span className="text-gray-500 text-sm">
                        Note: This analysis shows each stock you have invested in, categorized by different sectors of your invested value.
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={300} className="flex">
                    <PieChart>
                        <Tooltip content={<CustomPieTooltip />} cursor={false} />
                        <Pie
                            data={pieChartFormattedData}
                            dataKey="visitors"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={120}
                            stroke="#FFFFFF"
                        >
                            {pieChartFormattedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className='flex flex-col w-full md:w-1/2 gap-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm'>
                <div className='flex flex-col gap-1'>
                    <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Current Value</h1>
                    <span className="text-gray-500 text-sm">
                        Note: This analysis shows the current value of each stock you have invested in, categorized by different sectors of your current value.
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={300} className="flex">
                    <PieChart>
                        <Tooltip content={<CustomPieTooltip />} cursor={false} />
                        <Pie
                            data={pieChartFormattedData}
                            dataKey="visitors"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={120}
                            stroke="#FFFFFF"
                        >
                            {pieChartFormattedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}