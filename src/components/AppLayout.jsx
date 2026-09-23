const pages = ['Overview', 'Projects', 'Task board', 'Team']

export default function AppLayout({ user, page, onNavigate, onLogout, children }) {
  return <div className="layout">
    <aside className="sidebar"><div className="brand"><span className="logo">P</span> Planwise</div><small className="caption">WORKSPACE</small>
      <nav>{pages.map((item, index) => <button key={item} className={`nav ${page === item ? 'active' : ''}`} onClick={() => onNavigate(item)}><span>{['⌂', '▤', '▦', '♙'][index]}</span>{item}{item === 'Projects' && <small />}</button>)}</nav>
      <div className="profile"><span className="avatar">{user?.name?.[0]?.toUpperCase()}</span><div><b>{user?.name}</b><small>{user?.email}</small></div><button onClick={onLogout} title="Log out">↪</button></div>
    </aside>
    <main className="main"><header>Workspace / <b>{page}</b><span>{new Date().toLocaleDateString()}</span></header>{children}</main>
  </div>
}
