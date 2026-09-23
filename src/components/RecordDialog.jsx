export default function RecordDialog({ type, item, form, setForm, projects, team, error, onClose, onSubmit }) {
  const field = (key, label, options) => <label>{label}<select value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })}>{options}</select></label>
  return <div className="shade" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
    <form className="dialog" onSubmit={onSubmit}><h2>{item?._id ? 'Edit ' : 'Add '}{type}</h2>
      <label>{type === 'member' ? 'Name' : `${type[0].toUpperCase() + type.slice(1)} name`}<input autoFocus required value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      {type === 'project' && <>
        <label>Description<textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        {field('status', 'Status', <><option>Planning</option><option>In Progress</option><option>Completed</option></>)}
        <div className="form-row"><label>Start date<input type="date" value={form.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></label><label>Due date<input type="date" value={form.dueDate || ''} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label></div>
      </>}
      {type === 'task' && <>
        {field('project', 'Project', <><option value="">Choose project</option>{projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}</>)}
        <div className="form-row">
          {field('status', 'Status', <><option>To Do</option><option>In Progress</option><option>Completed</option></>)}
          {field('priority', 'Priority', <><option>Low</option><option>Medium</option><option>High</option></>)}
        </div>
        <div className="form-row"><label>Due date<input type="date" value={form.dueDate || ''} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label>
          {field('assignee', 'Assignee', <><option value="">Unassigned</option>{team.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}</>)}</div>
        <label>Notes<textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
      </>}
      {type === 'member' && <><label>Email<input type="email" required value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label>Role<input required value={form.role || ''} onChange={(e) => setForm({ ...form, role: e.target.value })} /></label></>}
      {error && <p className="error">{error}</p>}
      <div className="row-actions"><button type="button" onClick={onClose}>Cancel</button><button className="btn primary">{item?._id ? 'Save changes' : `Add ${type}`}</button></div>
    </form>
  </div>
}
