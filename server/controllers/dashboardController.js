import { getDashboard } from '../services/dashboardService.js'

export async function dashboard(req, res, next) {
  try { res.json(await getDashboard(req.userId)) } catch (error) { next(error) }
}
