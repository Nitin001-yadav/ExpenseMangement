import React, { useEffect, useState } from 'react';
import { Chart, PieController, ArcElement, BarController, CategoryScale, LinearScale, BarElement } from 'chart.js';
Chart.register(PieController, ArcElement, BarController, CategoryScale, LinearScale, BarElement);

export default function TransactionsPanel(){
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(()=> { load(1); }, []);

  async function create(){
    const res = await fetch('/api/transactions', { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type, amount: parseFloat(amount), category, note, date: new Date().toISOString() })});
    const data = await res.json();
    if(res.ok) { setAmount(''); setNote(''); load(1); }
    else alert(JSON.stringify(data));
  }

  async function load(p=1){
    const q = new URLSearchParams({ page: p, per_page: 10 });
    if(start) q.set('start', start);
    if(end) q.set('end', end);
    const res = await fetch('/api/transactions?'+q.toString(), { credentials: 'include' });
    const data = await res.json();
    if(res.ok) { setItems(data.items); setPage(data.page); setTotal(data.total); drawCharts(start, end); }
    else alert(JSON.stringify(data));
  }

  async function drawCharts(start,end){
    const qs = new URLSearchParams();
    if(start) qs.set('start', start);
    if(end) qs.set('end', end);
    const cat = await fetch('/api/transactions/summary/by-category?'+qs.toString(), { credentials: 'include' }).then(r=>r.json());
    const date = await fetch('/api/transactions/summary/by-date?'+qs.toString(), { credentials: 'include' }).then(r=>r.json());

    const catCanvas = document.getElementById('catChart');
    if(catCanvas){
      if(window.catChart) window.catChart.destroy();
      window.catChart = new Chart(catCanvas, {
        type: 'pie',
        data: { labels: cat.map(c=>c.category), datasets: [{ data: cat.map(c=>c.amount) }] }
      });
    }

    const dateCanvas = document.getElementById('dateChart');
    if(dateCanvas){
      if(window.dateChart) window.dateChart.destroy();
      window.dateChart = new Chart(dateCanvas, {
        type: 'bar',
        data: { labels: date.map(d=>d.date), datasets: [{ data: date.map(d=>d.amount) }] }
      });
    }
  }

  return (
    <div className="card">
      <h3>Transactions</h3>
      <div style={{display:'flex',gap:8,marginBottom:8}}>
        <select value={type} onChange={e=>setType(e.target.value)} className="input">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input id="add-amount" className="input" placeholder="amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <input className="input" placeholder="category" value={category} onChange={e=>setCategory(e.target.value)} />
        <input className="input" placeholder="note" value={note} onChange={e=>setNote(e.target.value)} />
        <button className="btn" onClick={create}>Add</button>
      </div>

      <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
        <label className="small">Start <input type="date" value={start} onChange={e=>setStart(e.target.value)} /></label>
        <label className="small">End <input type="date" value={end} onChange={e=>setEnd(e.target.value)} /></label>
        <button className="btn" onClick={()=>load(1)}>Load</button>
        <div style={{marginLeft:'auto'}} className="small">Total items: {total}</div>
      </div>

      <div className="transactions-list">
        {items.map(it=>(
          <div className="tx-row" key={it._id}>
            <div>
              <div><strong>{it.type}</strong> • {it.category || '—'}</div>
              <div className="small">{new Date(it.date).toLocaleString()}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div><strong>{it.amount}</strong></div>
              <div className="small">{it.note || ''}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:8,marginTop:8,alignItems:'center'}}>
        <button className="btn" onClick={()=>load(Math.max(1,page-1))}>Prev</button>
        <div>Page {page}</div>
        <button className="btn" onClick={()=>load(page+1)}>Next</button>
        <div style={{flex:1}}></div>
      </div>

      <h4 style={{marginTop:12}}>Charts</h4>
      <canvas id="catChart" width="400" height="160"></canvas>
      <canvas id="dateChart" width="400" height="160" style={{marginTop:8}}></canvas>
    </div>
  )
}
