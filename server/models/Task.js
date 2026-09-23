import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: Date,
  notes: { type: String, default: '' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember', default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

export default mongoose.model('Task', taskSchema)
