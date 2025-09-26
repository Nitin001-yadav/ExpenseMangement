import React, { useState } from 'react';

export default function Login({ onLogin }){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function register(){
    const res = await fetch('/api/auth/register', { method: 'POST', credentials: 'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, password })});
    const data = await res.json();
    if(res.ok) { setMsg('Registered and logged in'); onLogin(); } else setMsg(JSON.stringify(data));
  }

  async function login(){
    const res = await fetch('/api/auth/login', { method: 'POST', credentials: 'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, password })});
    const data = await res.json();
    if(res.ok) { setMsg('Logged in'); onLogin(); } else setMsg(JSON.stringify(data));
  }

  return (
    <div className="card" style={{maxWidth:440, margin:'0 auto'}}>
      <h2>Welcome</h2>
      <p className="small">Register or login to manage your finances</p>
      <div style={{display:'flex',gap:8,flexDirection:'column',marginTop:8}}>
        <input className="input" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="input" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{display:'flex',gap:8}}>
          <button className="btn" onClick={login}>Login</button>
          <button className="btn" onClick={register}>Register</button>
        </div>
        <div style={{marginTop:8,color:'#dc2626'}}>{msg}</div>
      </div>
    </div>
  )
}
