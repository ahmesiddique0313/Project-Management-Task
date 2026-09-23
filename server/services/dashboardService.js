import Project from '../models/Project.js'
import Task from '../models/Task.js'

export async function getDashboard(userId) {
  const [projects, tasks, todo, inProgress, completed] = await Promise.all([
    Project.countDocuments({ user: userId }),
    Task.countDocuments({ user: userId }),
    Task.countDocuments({ user: userId, status: 'To Do' }),
    Task.countDocuments({ user: userId, status: 'In Progress' }),
    Task.countDocuments({ user: userId, status: 'Completed' }),
  ])
  return { projects, tasks, statuses: { 'To Do': todo, 'In Progress': inProgress, Completed: completed } }
}
