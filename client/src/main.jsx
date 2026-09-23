import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const authHeaders = () => ({ 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('token')}` });

function Auth({ onLogin }) {
  const [register, setRegister] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setError('');
    const res = await fetch(`${API}/auth/${register?'register':'login'}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    const data = await res.json(); if (!res.ok) return setError(data.message || 'Request failed');
    localStorage.setItem('token', data.token); onLogin(data.user);
  }
  return <div className="auth"><div className="card auth-card"><h1>TaskFlow</h1><p className="muted">MERN team task management</p><form onSubmit={submit}>
    {register && <input placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>}
    <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
    <input type="password" placeholder="Password" minLength="6" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
    {error && <div className="error">{error}</div>}<button>{register?'Create account':'Login'}</button>
  </form><button className="link" onClick={()=>setRegister(!register)}>{register?'Already have an account? Login':'Create an account'}</button></div></div>
}

function Dashboard({ user, logout }) {
  const [tasks,setTasks]=useState([]), [status,setStatus]=useState('All'), [form,setForm]=useState({title:'',description:'',priority:'Medium',status:'Todo',dueDate:''});
  const [error,setError]=useState('');
  async function load(){ const r=await fetch(`${API}/tasks?status=${encodeURIComponent(status)}`,{headers:authHeaders()}); if(r.status===401)return logout(); setTasks(await r.json()); }
  useEffect(()=>{load()},[status]);
  async function add(e){e.preventDefault();setError(''); const r=await fetch(`${API}/tasks`,{method:'POST',headers:authHeaders(),body:JSON.stringify(form)}); const d=await r.json(); if(!r.ok)return setError(d.message); setForm({title:'',description:'',priority:'Medium',status:'Todo',dueDate:''});load();}
  async function update(id,patch){await fetch(`${API}/tasks/${id}`,{method:'PUT',headers:authHeaders(),body:JSON.stringify(patch)});load()}
  async function remove(id){await fetch(`${API}/tasks/${id}`,{method:'DELETE',headers:authHeaders()});load()}
  const stats=useMemo(()=>({total:tasks.length,done:tasks.filter(t=>t.status==='Done').length,progress:tasks.filter(t=>t.status==='In Progress').length,high:tasks.filter(t=>t.priority==='High').length}),[tasks]);
  return <div className="app"><header><div><strong>TaskFlow</strong><span className="muted"> Management Dashboard</span></div><div>{user?.name} <button className="small" onClick={logout}>Logout</button></div></header>
    <main><section className="stats">{[['Total',stats.total],['In Progress',stats.progress],['Completed',stats.done],['High Priority',stats.high]].map(x=><div className="card stat" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></div>)}</section>
    <div className="grid"><section className="card"><h2>Create Task</h2><form onSubmit={add} className="task-form"><input placeholder="Task title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/><textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><div className="row"><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select><input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></div>{error&&<div className="error">{error}</div>}<button>Add Task</button></form></section>
    <section><div className="toolbar"><h2>Tasks</h2><select value={status} onChange={e=>setStatus(e.target.value)}><option>All</option><option>Todo</option><option>In Progress</option><option>Done</option></select></div>{tasks.map(t=><article className="card task" key={t._id}><div><h3>{t.title}</h3><p>{t.description}</p><span className={`pill ${t.priority.toLowerCase()}`}>{t.priority}</span>{t.dueDate&&<small> Due {new Date(t.dueDate).toLocaleDateString()}</small>}</div><div className="actions"><select value={t.status} onChange={e=>update(t._id,{status:e.target.value})}><option>Todo</option><option>In Progress</option><option>Done</option></select><button className="danger" onClick={()=>remove(t._id)}>Delete</button></div></article>)}{!tasks.length&&<div className="card empty">No tasks in this view.</div>}</section></div></main></div>
}

function App(){const [user,setUser]=useState(null); function logout(){localStorage.removeItem('token');setUser(null)} useEffect(()=>{if(localStorage.getItem('token'))setUser({name:'User'})},[]); return user?<Dashboard user={user} logout={logout}/>:<Auth onLogin={setUser}/>}
createRoot(document.getElementById('root')).render(<App/>);
