import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function createToken(userId) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing from server/.env')
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export async function registerUser({ name, email, password }) {
  if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
    const error = new Error('Name, email, and a password of at least 6 characters are required.')
    error.status = 400
    throw error
  }
  const user = await User.create({ name: name.trim(), email, password: await bcrypt.hash(password, 10) })
  return { token: createToken(user.id), user: { id: user.id, name: user.name, email: user.email } }
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email?.toLowerCase() })
  if (!user || !await bcrypt.compare(password || '', user.password)) {
    const error = new Error('Email or password is incorrect.')
    error.status = 401
    throw error
  }
  return { token: createToken(user.id), user: { id: user.id, name: user.name, email: user.email } }
}

export async function findPublicUser(id) {
  const user = await User.findById(id).select('name email')
  if (!user) {
    const error = new Error('Account not found.')
    error.status = 401
    throw error
  }
  return user
}
