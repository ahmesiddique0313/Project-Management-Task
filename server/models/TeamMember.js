import mongoose from 'mongoose'

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  role: { type: String, required: true, trim: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })
teamMemberSchema.index({ email: 1, user: 1 }, { unique: true })

export default mongoose.model('TeamMember', teamMemberSchema)
