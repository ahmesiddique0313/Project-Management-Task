import { api } from './api'

export const login = (values) => api('/auth/login', null, { method: 'POST', body: JSON.stringify(values) })
export const register = (values) => api('/auth/register', null, { method: 'POST', body: JSON.stringify(values) })
export const getCurrentUser = (token) => api('/auth/me', token)
