import { Router } from 'express'
import { validConfig } from '../middleware/feeSetup.js'
import validate from '../middleware/validate.js'
import {
  getFeesConfig,
  setFeesConfig,
  computeTransaction
} from '../controllers/fee-controller.js'
import { validBody } from '../middleware/computeTransaction.js'

const router = Router()

router.post('/fees', validConfig, validate, setFeesConfig)

router.post('/compute-transaction-fee', validBody, validate, computeTransaction)

router.get('/fees', getFeesConfig)

export default router
