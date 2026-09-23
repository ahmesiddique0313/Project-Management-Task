import mongoose from 'mongoose'

export default function connectDatabase() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from server/.env')
  return mongoose.connect(process.env.MONGO_URI)
}
