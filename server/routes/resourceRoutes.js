import { Router } from 'express'
import { resourceController } from '../controllers/resourceController.js'
import requireAuth from '../middleware/requireAuth.js'

export function createResourceRoutes(type) {
  const router = Router()
  const controller = resourceController(type)
  router.use(requireAuth)
  router.get('/', controller.list)
  router.post('/', controller.create)
  router.put('/:id', controller.update)
  router.delete('/:id', controller.remove)
  return router
}
