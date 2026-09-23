import { api } from './api'

export async function getWorkspace(token) {
  const [projects, tasks, team, dashboard] = await Promise.all([
    api('/projects', token),
    api('/tasks', token),
    api('/team', token),
    api('/dashboard', token),
  ])
  return { projects, tasks, team, dashboard }
}

export async function getSession(token) {
  const [user, workspace] = await Promise.all([api('/auth/me', token), getWorkspace(token)])
  return { user, ...workspace }
}

export function saveRecord(type, item, token) {
  const path = type === 'member' ? 'team' : `${type}s`
  return api(`/${path}${item._id ? `/${item._id}` : ''}`, token, {
    method: item._id ? 'PUT' : 'POST',
    body: JSON.stringify(item),
  })
}

export function deleteRecord(type, id, token) {
  const path = type === 'member' ? 'team' : `${type}s`
  return api(`/${path}/${id}`, token, { method: 'DELETE' })
}

export function updateTaskStatus(task, status, token) {
  return api(`/tasks/${task._id}`, token, { method: 'PUT', body: JSON.stringify({ status }) })
}
