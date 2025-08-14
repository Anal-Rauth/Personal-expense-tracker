import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

export default function ExpenseList({ expenses, onEdit, onDelete }) {
    const userId = auth.currentUser?.uid;
    const userDocRef = userId ? doc(db, "users", userId) : null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };

    const handleDelete = async (index) => {
        const newExpenses = expenses.filter((_, i) => i !== index);

        // Update Firestore immediately
        if (userDocRef) {
            await setDoc(userDocRef, { expenses: newExpenses }, { merge: true });
        }

        onDelete(index);
    };

    return (
        <div className="expense-list">
            <h2>All Expenses</h2>
            <ul>
                {expenses.map((expense, index) => (
                    <li key={index} className="expense-item">
                        <div className="expense-details">
                            <span className="amount">₹{expense.amount}</span>
                            <span className="category">{expense.category}</span>
                            <span className="date">{formatDate(expense.date)}</span>
                            {expense.description && (
                                <span className="description">{expense.description}</span>
                            )}
                        </div>
                        <div className="expense-actions">
                            <button className="edit-btn" onClick={() => onEdit(index)}>
                                Edit
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(index)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
