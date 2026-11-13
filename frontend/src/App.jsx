import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Tags, LogOut, GraduationCap } from 'lucide-react';
import api from './services/api';

function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('ChangeMe123!');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault(); setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('lms_token', data.token); navigate('/');
    } catch (err) { setError(err.response?.data?.message || 'Login failed'); }
  }
  return <div className="login-wrap"><form className="login-card" onSubmit={submit}>
    <div className="brand-icon"><GraduationCap/></div><h1>Welcome back</h1><p>Sign in to your LMS administration panel.</p>
    {error && <div className="error">{error}</div>}
    <label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required/>
    <label>Password</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
    <button className="primary full">Sign in</button>
  </form></div>;
}
function Shell({ children }) {
  const navigate = useNavigate();
  function logout(){ localStorage.removeItem('lms_token'); navigate('/login'); }
  const links = [
    ["/", "Overview", LayoutDashboard],
    ["/students", "Students", Users],
    ["/instructors", "Instructors", GraduationCap],
    ["/courses", "Courses", BookOpen],
    ["/categories", "Categories", Tags]
  ];
  return <div className="app-shell"><aside className="sidebar">
    <div className="logo"><span className="logo-mark"><GraduationCap/></span><span>Learn<span className="blue">Flow</span><small>ADMIN CONSOLE</small></span></div>
    <div className="nav-label">WORKSPACE</div>{links.map(([to,label,Icon])=><NavLink end={to==='/'} className={({isActive})=>`nav-item ${isActive?'active':''}`} to={to} key={to}><Icon size={18}/>{label}</NavLink>)}
    <button className="nav-item logout" onClick={logout}><LogOut size={18}/>Sign out</button>
    <div className="sidebar-bottom">Learning management<br/>system · Admin</div>
  </aside><main className="main"><header className="topbar"><div><span className="muted">Workspace</span><span className="slash"> / </span><b>Administration</b></div><div className="admin-chip"><span className="avatar">A</span><span>Administrator</span></div></header>{children}</main></div>;
}
function PageHeader({eyebrow,title,desc,action}) { return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{action}</div>; }
function Dashboard() {
  const [stats,setStats]=useState({students:0,instructors:0,courses:0,enrollments:0,pendingCourses:0});
  useEffect(()=>{api.get('/dashboard/stats').then(r=>setStats(r.data)).catch(()=>{});},[]);
  const cards=[['Total Students',stats.students,'Learners registered'],['Instructors',stats.instructors,'Teaching accounts'],['Total Courses',stats.courses,'Across all categories'],['Enrollments',stats.enrollments,'Student registrations']];
  return <div className="content"><PageHeader eyebrow="OVERVIEW" title="Dashboard" desc="Monitor your learning platform at a glance."/>
    <div className="stats-grid">{cards.map(([name,value,sub],i)=><div className="stat-card" key={name}><div className="stat-top"><span>{name}</span><span className="stat-dot">{['◉','◎','▤','↗'][i]}</span></div><strong>{value}</strong><small>{sub}</small></div>)}</div>
    <div className="two-col"><section className="panel"><div className="panel-head"><div><h3>Platform activity</h3><p>Your current LMS snapshot</p></div><span className="live-pill">LIVE DATA</span></div><div className="activity-row"><div className="activity-icon purple"><Users/></div><div><b>Student accounts</b><small>Registered learners</small></div><strong>{stats.students}</strong></div><div className="activity-row"><div className="activity-icon blue-bg"><BookOpen/></div><div><b>Courses created</b><small>All course statuses</small></div><strong>{stats.courses}</strong></div><div className="activity-row"><div className="activity-icon amber"><Tags/></div><div><b>Pending approvals</b><small>Courses awaiting review</small></div><strong>{stats.pendingCourses}</strong></div></section>
    <section className="panel welcome-panel"><div className="welcome-badge">✦ LMS CONTROL CENTER</div><h2>Build better<br/><span>learning experiences.</span></h2><p>Manage learners, instructors, courses and categories from one central workspace.</p><div className="welcome-footer">LEARNFLOW <span>ADMINISTRATION</span></div></section></div>
  </div>;
}
function DataPage({type}) {
  const isCourse=type==='courses', isCategory=type==='categories';
  const endpoint=isCourse?'/courses':isCategory?'/categories':'/users';
  const title=isCourse?'Courses':isCategory?'Categories':type==='instructors'?'Instructors':'Students';
  const [items,setItems]=useState([]),[name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState('');
  async function load(){try{const {data}=await api.get(endpoint, {params: !isCourse&&!isCategory?{role:type==='instructors'?'instructor':'student'}:{}});setItems(data);}catch(e){setError(e.response?.data?.message||'Could not load data');}}
  useEffect(()=>{load();},[type]);
  async function add(e){e.preventDefault();setError('');try{
    if(isCourse) await api.post(endpoint,{title:name});
    else if(isCategory) await api.post(endpoint,{name});
    else await api.post(endpoint,{name,email,password,role:type==='instructors'?'instructor':'student'});
    setName('');setEmail('');setPassword('');load();
  }catch(e){setError(e.response?.data?.message||'Could not save record');}}
  return <div className="content"><PageHeader eyebrow="MANAGEMENT" title={title} desc={`Create and manage ${title.toLowerCase()} in your LMS.`}/>
    <section className="panel"><h3>Add {isCourse?'course':isCategory?'category':type==='instructors'?'instructor':'student'}</h3>
      <form className="inline-form" onSubmit={add}><input placeholder={isCourse?'Course title':'Name'} value={name} onChange={e=>setName(e.target.value)} required/>
      {!isCourse&&!isCategory&&<><input placeholder="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><input placeholder="Temporary password" type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength="8" required/> </>}
      <button className="primary">Add new</button></form>{error&&<div className="error">{error}</div>}
    </section>
    <section className="panel table-panel"><div className="panel-head"><div><h3>All {title}</h3><p>{items.length} records found</p></div><button className="secondary" onClick={load}>Refresh</button></div>
      <div className="table-wrap"><table><thead><tr><th>{isCourse?'COURSE':isCategory?'CATEGORY':'NAME'}</th><th>{isCourse?'STATUS':isCategory?'DESCRIPTION':'EMAIL'}</th><th>{isCourse?'CREATED':isCategory?'CREATED':'ROLE'}</th></tr></thead><tbody>
      {items.map(item=><tr key={item._id}><td><b>{item.title||item.name}</b></td><td>{isCourse?item.status:isCategory?(item.description||'—'):item.email}</td><td>{isCourse||isCategory?new Date(item.createdAt).toLocaleDateString():item.role}</td></tr>)}
      {!items.length&&<tr><td colSpan="3" className="empty">No records yet. Add your first record above.</td></tr>}</tbody></table></div>
    </section>
  </div>;
}
function Protected({children}) { return localStorage.getItem('lms_token')?children:<Navigate to="/login" replace/>; }
export default function App(){
  return <Routes><Route path="/login" element={<Login/>}/><Route path="*" element={<Protected><Shell><Routes>
    <Route path="/" element={<Dashboard/>}/><Route path="/students" element={<DataPage type="students"/>}/><Route path="/instructors" element={<DataPage type="instructors"/>}/><Route path="/courses" element={<DataPage type="courses"/>}/><Route path="/categories" element={<DataPage type="categories"/>}/>
    <Route path="*" element={<Dashboard/>}/>
  </Routes></Shell></Protected>}/></Routes>;
}