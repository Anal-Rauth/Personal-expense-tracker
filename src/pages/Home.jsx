import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import BudgetTracker from "../components/BudgetTracker";
import ExpenseFilters from "../components/ExpenseFilters";
import ExpenseCharts from "../components/ExpenseCharts";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, onSnapshot, Timestamp } from "firebase/firestore";

export default function Home() {
    const navigate = useNavigate();
    const userId = auth.currentUser?.uid;
    const userDocRef = userId ? doc(db, "users", userId) : null;

    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    // Load data and listen for real-time updates
    useEffect(() => {
        if (!userDocRef) return;

        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();

                // Only update if changed to prevent flickering
                setExpenses(prev => {
                    const newExpenses = data.expenses || [];
                    if (JSON.stringify(prev) !== JSON.stringify(newExpenses)) return newExpenses;
                    return prev;
                });

                setBudget(data.budget || null);
                setSelectedMonth(data.selectedMonth ?? new Date().getMonth());
            }
        });

        return () => unsubscribe();
    }, [userDocRef]);

    // Update Firestore
    const updateFirestore = useCallback(
        async (newData) => {
            if (!userDocRef) return;
            await setDoc(userDocRef, newData, { merge: true });
        },
        [userDocRef]
    );

    const logout = async () => {
        await signOut(auth);
        navigate("/login", { replace: true });
    };

    // Convert date to Firestore Timestamp before saving
    const prepareExpenseForSave = (expense) => ({
        ...expense,
        date: expense.date instanceof Date ? Timestamp.fromDate(expense.date) : expense.date,
        amount: Number(expense.amount) || 0,
        category: expense.category || "Others"
    });

    const addExpense = async (expense) => {
        const newExpenses = [...expenses, prepareExpenseForSave(expense)];
        setExpenses(newExpenses);
        await updateFirestore({ expenses: newExpenses });
    };

    const handleUpdate = async (updatedExpense) => {
        const newExpenses = [...expenses];
        newExpenses[editIndex] = prepareExpenseForSave(updatedExpense);
        setExpenses(newExpenses);
        setEditIndex(null);
        await updateFirestore({ expenses: newExpenses });
    };

    const handleDelete = async (index) => {
        const newExpenses = expenses.filter((_, i) => i !== index);
        setExpenses(newExpenses);
        if (editIndex === index) setEditIndex(null);
        await updateFirestore({ expenses: newExpenses });
    };

    const handleEdit = (index) => setEditIndex(index);
    const cancelEdit = () => setEditIndex(null);

    const handleBudgetChange = async (newBudget) => {
        setBudget(newBudget);
        await updateFirestore({ budget: newBudget });
    };

    const handleMonthChange = async (month) => {
        setSelectedMonth(month);
        await updateFirestore({ selectedMonth: month });
    };

    const filterExpenses = (type) => {
        const sorted = [...expenses].sort((a, b) => {
            if (type === "date") return new Date(a.date?.toDate ? a.date.toDate() : a.date) - new Date(b.date?.toDate ? b.date.toDate() : b.date);
            if (type === "amount") return Number(a.amount) - Number(b.amount);
            if (type === "category") return a.category.localeCompare(b.category);
            return 0;
        });
        setExpenses(sorted);
    };

    const totalSpentThisMonth = expenses
        .filter(e => {
            const dateObj = e.date?.toDate ? e.date.toDate() : new Date(e.date);
            return dateObj.getMonth() === selectedMonth;
        })
        .reduce((sum, e) => {
            const amount = Number(e.amount || 0);
            return sum + amount;
        }, 0);

    return (
        <div className="home-container">
            <Navbar onLogout={logout} />
            <div className="dashboard-section">
                <BudgetTracker
                    totalSpent={totalSpentThisMonth}
                    initialBudget={budget}
                    onBudgetChange={handleBudgetChange}
                    selectedMonth={selectedMonth}
                    onMonthChange={handleMonthChange}
                />
                <ExpenseForm
                    onAdd={addExpense}
                    editData={editIndex !== null ? expenses[editIndex] : null}
                    onUpdate={handleUpdate}
                    cancelEdit={cancelEdit}
                />
                <ExpenseFilters onFilter={filterExpenses} />
                <ExpenseList
                    expenses={expenses}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <ExpenseCharts
                    expenses={expenses}
                    selectedMonth={selectedMonth}
                />
            </div>
        </div>
    );
}
