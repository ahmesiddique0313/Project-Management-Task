import Project from '../models/Project.js'
import Task from '../models/Task.js'
import TeamMember from '../models/TeamMember.js'

const resources = {
  projects: { model: Project },
  tasks: { model: Task, populate: 'project assignee' },
  team: { model: TeamMember },
}

function getResource(type) {
  const resource = resources[type]
  if (!resource) throw new Error('Unknown resource.')
  return resource
}

export async function listRecords(type, userId, query) {
  const { model, populate = '' } = getResource(type)
  const filter = { user: userId }
  if (type === 'tasks') {
    if (query.status) filter.status = query.status
    if (query.priority) filter.priority = query.priority
  }
  if (query.search) filter.name = { $regex: query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
  return model.find(filter).populate(populate).sort({ createdAt: -1 })
}

async function validateTaskReferences(input, userId) {
  if (input.project && !await Project.exists({ _id: input.project, user: userId })) {
    const error = new Error('Choose one of your projects.')
    error.status = 400
    throw error
  }
  if (input.assignee && !await TeamMember.exists({ _id: input.assignee, user: userId })) {
    const error = new Error('Choose a team member from your workspace.')
    error.status = 400
    throw error
  }
}

export async function createRecord(type, userId, input) {
  const { model } = getResource(type)
  if (type === 'tasks') await validateTaskReferences(input, userId)
  return model.create({ ...input, user: userId })
}

export async function updateRecord(type, userId, id, input) {
  const { model, populate = '' } = getResource(type)
  if (type === 'tasks') await validateTaskReferences(input, userId)
  const updates = { ...input }
  delete updates.user
  delete updates._id
  const item = await model.findOneAndUpdate({ _id: id, user: userId }, updates, { new: true, runValidators: true }).populate(populate)
  if (!item) {
    const error = new Error('Item not found.')
    error.status = 404
    throw error
  }
  return item
}

export async function deleteRecord(type, userId, id) {
  const { model } = getResource(type)
  const item = await model.findOneAndDelete({ _id: id, user: userId })
  if (!item) {
    const error = new Error('Item not found.')
    error.status = 404
    throw error
  }
  if (type === 'projects') await Task.deleteMany({ project: item.id, user: userId })
  if (type === 'team') await Task.updateMany({ assignee: item.id, user: userId }, { assignee: null })
  return { message: 'Deleted.' }
}
