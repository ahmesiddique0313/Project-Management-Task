import { EmptyState, PanelTitle, Badge } from '../components/Common'
import TaskTable from '../components/TaskTable'

export default function OverviewPage({ stats, projects, tasks, onNavigate, onEditTask, onDeleteTask, onStatus }) {
  const cards = [['Projects', stats.projects], ['Tasks', stats.tasks], ['In progress', stats.statuses['In Progress'] || 0], ['Completed', stats.statuses.Completed || 0]]
  return <><div className="stats">{cards.map(([label, value]) => <article className="stat" key={label}><small>{label}</small><b>{value}</b></article>)}</div>
    <div className="columns two"><section className="panel"><PanelTitle title="Recent projects" action="View all →" onAction={() => onNavigate('Projects')} />
      {projects.slice(0, 5).map((p) => <div className="row" key={p._id}><b>{p.name}</b><Badge value={p.status} /></div>)}
      {!projects.length && <EmptyState>No projects yet.</EmptyState>}</section>
      <section className="panel"><PanelTitle title="Tasks by status" />{['To Do', 'In Progress', 'Completed'].map((s) => <div className="row" key={s}>{s}<b>{stats.statuses[s] || 0}</b></div>)}</section></div>
    <section className="panel"><PanelTitle title="Recent tasks" action="Open task board →" onAction={() => onNavigate('Task board')} />
      <TaskTable tasks={tasks.slice(0, 5)} onEdit={onEditTask} onDelete={onDeleteTask} onStatus={onStatus} /></section>
  </>
}
