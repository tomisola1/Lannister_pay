import { body } from 'express-validator'

function numberValidator(key, value, req) {
  if (typeof value !== 'number') throw new Error(`${key} must be a number`)
  if (value <= 0) throw new Error(`${key} must be a number greater than 0`)
  return true
}

function booleanValidator(value, req) {
  if (typeof value !== 'boolean')
    throw new Error(`Customer.BearsFee must be a boolean`)
  return true
}

export const validBody = [
  body('ID').custom((value, { req }) => numberValidator('ID', value, req)),
  body('Amount').custom((value, { req }) =>
    numberValidator('Amount', value, req)
  ),
  body('Currency').notEmpty().withMessage('Currency must be provided'),
  body('CurrencyCountry')
    .notEmpty()
    .withMessage('CurrencyCountry must be provided'),
  body('Customer.ID').custom((value, { req }) =>
    numberValidator('Customer.ID', value, req)
  ),
  body('Customer.EmailAddress')
    .isEmail()
    .withMessage('Customer.EmailAddress must be a valid email'),
  body('Customer.FullName')
    .isString()
    .withMessage('Customer.FullName must be string'),
  body('Customer.BearsFee').custom((value, { req }) =>
    booleanValidator(value, req)
  ),
  body('PaymentEntity.ID').custom((value, { req }) =>
    numberValidator('PaymentEntity.ID', value, req)
  ),
  body('PaymentEntity.Issuer')
    .isString()
    .withMessage('PaymentEntity.Issuer must be a string'),
  body('PaymentEntity.Brand')
    .isString()
    .withMessage('PaymentEntity.Brand must be a string'),
  body('PaymentEntity.Number')
    .isString()
    .withMessage('PaymentEntity.Number must be a string'),
  body('PaymentEntity.Type')
    .isString()
    .withMessage('PaymentEntity.Type must be a string'),
  body('PaymentEntity.Country')
    .isString()
    .withMessage('PaymentEntity.Country must be a string')
]
