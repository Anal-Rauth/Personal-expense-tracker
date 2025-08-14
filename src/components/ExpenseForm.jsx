import { useState, useEffect } from "react";

export default function ExpenseForm({ onAdd, editData, onUpdate, cancelEdit }) {
    const [form, setForm] = useState({ amount: "", category: "", date: "", description: "" });

    useEffect(() => {
        if (editData) setForm({ ...editData });
        else setForm({ amount: "", category: "", date: "", description: "" });
    }, [editData]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.amount || !form.category || !form.date) return;

        if (editData) onUpdate(form);
        else onAdd(form);

        setForm({ amount: "", category: "", date: "", description: "" });
    };

    return (
        <form className="expense-form" onSubmit={handleSubmit}>
            <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" required />
            <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
            <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="Description" />
            <button type="submit">{editData ? "Update Expense" : "+ Add Expense"}</button>
            {editData && <button type="button" onClick={cancelEdit}>Cancel</button>}
        </form>
    );
}
