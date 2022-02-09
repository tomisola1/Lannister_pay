import NodeCache from 'node-cache'
import handleCalulation from '../helpers/helper.js'

export const store = new NodeCache()

export const setFeesConfig = (req, res) => {
  const input = req.body.FeeConfigurationSpec
  const rules = input.split('\n')

  rules.forEach((rule) => {
    const structure = {
      'FEE-ID': rule.split(' ')[0],
      'FEE-CURRENCY': rule.split(' ')[1],
      'FEE-LOCALE': rule.split(' ')[2],
      'FEE-ENTITY': rule.split(' ')[3].split('(')[0],
      'ENTITY-PROPERTY': rule.split(' ')[3].split('(')[1].split(')')[0],
      'FEE-TYPE': rule.split(' ')[6],
      'FEE-VALUE': rule.split(' ')[7]
    }

    store.set(structure['FEE-ID'], structure)
  })

  return res.status(200).json({ status: 'ok' })
}

export const getFeesConfig = (_req, res) => {
  const keys = store.keys()
  const config = store.mget(keys)
  return res.status(200).json({ config })
}

export const computeTransaction = (req, res) => {
  const transaction = req.body
  const result = handleCalulation(transaction)

  if (typeof result == 'string')
    return res
      .status(400)
      .json({ Error: `No fee configuration for ${result} transactions.` })

  return res.status(200).json(result)
}
