import { useState } from 'react'

export default function AuthForm({ onSubmit, error }) {
  const [mode, setMode] = useState('login')
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  function submit(event) {
    event.preventDefault()
    onSubmit(mode, values)
  }
  return <main className="auth"><form className="auth-card" onSubmit={submit}>
    <div className="logo">P</div><p className="kicker">PLANWISE WORKSPACE</p>
    <h1>{mode === 'login' ? 'Welcome back' : 'Create an account'}</h1><p className="muted">A simple place to plan and track your projects.</p>
    {mode === 'register' && <label>Name<input required value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} /></label>}
    <label>Email<input type="email" required value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} /></label>
    <label>Password<input type="password" minLength="6" required value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} /></label>
    {error && <p className="error">{error}</p>}<button className="btn primary wide">{mode === 'login' ? 'Log in' : 'Create account'}</button>
    <p className="switch">{mode === 'login' ? 'New here?' : 'Already registered?'} <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Create account' : 'Log in'}</button></p>
  </form></main>
}
