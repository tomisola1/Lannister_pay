import { body } from 'express-validator'

export const validConfig = [
  body('FeeConfigurationSpec')
    .notEmpty()
    .withMessage('Fee Configuration Spec must be provided')
]
