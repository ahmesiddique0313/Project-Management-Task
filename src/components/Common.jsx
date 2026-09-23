export function PanelTitle({ title, action, onAction }) {
  return <div className="panel-title"><h2>{title}</h2>{action && <button className="link" onClick={onAction}>{action}</button>}</div>
}
export function EmptyState({ children }) { return <p className="empty">{children}</p> }
export function Badge({ value }) {
  const tone = value === 'Completed' ? 'green' : value === 'In Progress' ? 'purple' : value === 'High' ? 'red' : value === 'Low' ? 'gray' : 'amber'
  return <span className={`badge ${tone}`}>{value}</span>
}
export function SearchInput({ value, onChange, placeholder }) {
  return <input className="search" aria-label={placeholder} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
}
export function Actions({ onEdit, onDelete }) {
  return <div className="row-actions"><button onClick={onEdit}>Edit</button><button onClick={onDelete}>Delete</button></div>
}
