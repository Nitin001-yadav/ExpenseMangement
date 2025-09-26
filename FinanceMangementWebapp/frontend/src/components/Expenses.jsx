import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReceiptUpload from './ReceiptUpload';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#FF0055'];

const Expenses = () => {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ amount: '', date: '', category: '', description: '', type: 'expense' });
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5009/api/transactions';

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(API_URL);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => fetchTransactions(), []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount) return setMessage('Amount is required');
    try {
      const res = await axios.post(API_URL, {
        type: form.type,
        amount: parseFloat(form.amount),
        date: form.date || new Date(),
        category: form.category || 'other',
        description: form.description || ''
      });
      setTransactions([res.data.transaction, ...transactions]);
      setForm({ amount: '', date: '', category: '', description: '', type: 'expense' });
      setMessage('Transaction added successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to add transaction');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      setMessage('Failed to delete transaction');
    }
  };

  const handleReceiptAdded = (transaction) => setTransactions([transaction, ...transactions]);

  // Prepare data for pie chart (expenses by category)
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const found = acc.find(a => a.name === t.category);
      if (found) found.value += t.amount;
      else acc.push({ name: t.category, value: t.amount });
      return acc;
    }, []);

  // Prepare data for bar chart (income/expense by date)
  const chartData = transactions.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString();
    const found = acc.find(a => a.date === date);
    if (found) {
      if (t.type === 'income') found.income += t.amount;
      else found.expense += t.amount;
    } else {
      acc.push({ date, income: t.type === 'income' ? t.amount : 0, expense: t.type === 'expense' ? t.amount : 0 });
    }
    return acc;
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Transactions</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <input type="date" name="date" value={form.date} onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <button type="submit">Add</button>
      </form>

      <ReceiptUpload onTransactionAdded={handleReceiptAdded} />

      <h3>Expense by Category (Pie Chart)</h3>
      <PieChart width={400} height={300}>
        <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {expenseData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>

      <h3>Income vs Expense by Date (Bar Chart)</h3>
      <BarChart width={700} height={300} data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="#00C49F" />
        <Bar dataKey="expense" fill="#FF8042" />
      </BarChart>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {transactions.map((t) => (
          <li key={t._id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
            <strong>{t.type.toUpperCase()}</strong> | {t.category} | ${t.amount.toFixed(2)} | {new Date(t.date).toLocaleDateString()} | {t.description}
            <button onClick={() => handleDelete(t._id)} style={{ marginLeft: '10px' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Expenses;