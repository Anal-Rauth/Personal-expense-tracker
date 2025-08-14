export default function ExpenseFilters({ onFilter }) {
    return (
        <div className="expense-filters">
            <button onClick={() => onFilter("date")}>Sort by Date</button>
            <button onClick={() => onFilter("category")}>Sort by Category</button>
            <button onClick={() => onFilter("amount")}>Sort by Amount</button>
        </div>
    );
}
