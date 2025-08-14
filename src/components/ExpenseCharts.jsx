import { useMemo } from "react";
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function ExpenseCharts({ expenses, selectedMonth }) {
    // Convert all dates to JS Date objects consistently
    const normalizedExpenses = useMemo(
        () =>
            expenses.map((e) => {
                let dateObj;
                // Handle Firestore Timestamp or string
                if (e.date?.toDate) dateObj = e.date.toDate();
                else dateObj = new Date(e.date);
                return { ...e, date: dateObj, amount: Number(e.amount) || 0 };
            }),
        [expenses]
    );

    // Filter expenses for the selected month
    const monthFilteredExpenses = useMemo(
        () => normalizedExpenses.filter((e) => e.date.getMonth() === selectedMonth),
        [normalizedExpenses, selectedMonth]
    );

    // Prepare Pie chart data
    const categoryData = useMemo(() => {
        const map = {};
        monthFilteredExpenses.forEach((e) => {
            const category = e.category || "Others";
            map[category] = (map[category] || 0) + e.amount;
        });
        return Object.keys(map).map((k) => ({ name: k, value: map[k] }));
    }, [monthFilteredExpenses]);

    const COLORS = ["#00d4ff", "#00ff88", "#ff4d6d", "#ffcc00", "#ff1f4b", "#aa00ff"];

    // Prepare Line chart data
    const lineData = useMemo(() => {
        const monthData = Array(12).fill(0);
        normalizedExpenses.forEach((e) => {
            monthData[e.date.getMonth()] += e.amount;
        });
        return monthData.map((amt, idx) => ({
            month: new Date(0, idx).toLocaleString("default", { month: "short" }),
            amount: amt,
        }));
    }, [normalizedExpenses]);

    return (
        <div className="expense-charts">
            <h3>Spending Analytics</h3>
            <div className="chart-container">
                <div className="chart-box">
                    <h4>
                        Spending by Category (
                        {new Date(0, selectedMonth).toLocaleString("default", { month: "long" })})
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            >
                                {categoryData.map((entry, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-box">
                    <h4>Monthly Spending Trend</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="month" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="amount" stroke="#00ff88" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
