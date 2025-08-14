import { useState, useEffect } from "react";

export default function BudgetTracker({
    totalSpent,
    initialBudget = null,
    onBudgetChange,
    selectedMonth,
    onMonthChange
}) {
    const [budget, setBudget] = useState(initialBudget);

    useEffect(() => {
        setBudget(initialBudget);
    }, [initialBudget]);

    const handleBudgetChange = (e) => {
        const value = e.target.value;
        const newBudget = value === "" ? null : Number(value);
        setBudget(newBudget);
        onBudgetChange(newBudget);
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const percentage = budget ? (totalSpent / budget) * 100 : 0;

    return (
        <div className="budget-tracker">
            <h3>Monthly Budget</h3>
            <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(Number(e.target.value))}
                className="month-selector"
            >
                {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                ))}
            </select>
            <input
                type="number"
                min="0"
                value={budget ?? ""}
                onChange={handleBudgetChange}
                placeholder="Enter your budget"
                className="budget-input"
            />
            <progress value={totalSpent} max={budget || 0}></progress>
            <p>{percentage.toFixed(1)}% used</p>
        </div>
    );
}
