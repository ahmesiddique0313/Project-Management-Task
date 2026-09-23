import { Actions, Badge } from './Common'
import { dateLabel } from '../services/format'

export default function TaskTable({ tasks, onEdit, onDelete, onStatus }) {
  return <div className="scroll"><table><thead><tr><th>Task</th><th>Project</th><th>Priority</th><th>Due</th><th>Status</th><th /></tr></thead>
    <tbody>{tasks.map((task) => <tr key={task._id}><td>{task.name}</td><td>{task.project?.name || '—'}</td><td><Badge value={task.priority} /></td><td>{task.dueDate ? dateLabel(task.dueDate) : '—'}</td>
      <td><select value={task.status} onChange={(e) => onStatus(task, e.target.value)}><option>To Do</option><option>In Progress</option><option>Completed</option></select></td>
      <td><Actions onEdit={() => onEdit(task)} onDelete={() => onDelete(task)} /></td></tr>)}</tbody>
  </table></div>
}
