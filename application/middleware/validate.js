import { validationResult } from 'express-validator'

const validateRequest = (req, res, next) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    const errors = result.array()
    const message = errors[errors.length - 1].msg
    return res.status(400).json({ message, isSuccess: false })
  }

  next()
}

export default validateRequest
