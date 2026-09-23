import { createRecord, deleteRecord, listRecords, updateRecord } from '../services/resourceService.js'

export function resourceController(type) {
  return {
    list: async (req, res, next) => {
      try { res.json(await listRecords(type, req.userId, req.query)) } catch (error) { next(error) }
    },
    create: async (req, res, next) => {
      try { res.status(201).json(await createRecord(type, req.userId, req.body)) } catch (error) { next(error) }
    },
    update: async (req, res, next) => {
      try { res.json(await updateRecord(type, req.userId, req.params.id, req.body)) } catch (error) { next(error) }
    },
    remove: async (req, res, next) => {
      try { res.json(await deleteRecord(type, req.userId, req.params.id)) } catch (error) { next(error) }
    },
  }
}
