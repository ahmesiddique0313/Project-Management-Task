import { useState } from 'react'
import { Actions, Badge, EmptyState, SearchInput } from '../components/Common'
import { dateLabel } from '../services/format'

export default function ProjectsPage({ projects, tasks, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const visible = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  return <><div className="toolbar"><SearchInput value={search} onChange={setSearch} placeholder="Search projects" /></div>
    <div className="columns cards">{visible.map((p) => <article className="panel project" key={p._id}><Badge value={p.status} /><h3>{p.name}</h3><p className="muted">{p.description || 'No description'}</p>
      <small>Due: {p.dueDate ? dateLabel(p.dueDate) : 'Not set'} · {tasks.filter((t) => (t.project?._id || t.project) === p._id).length} tasks</small>
      <Actions onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} /></article>)}</div>
    {!visible.length && <EmptyState>No matching projects. Add a project to get started.</EmptyState>}
  </>
}
