import { store as client } from '../controllers/fee-controller.js'

export const handleCalulation = (transaction) => {
  const keys = client.keys()
  const data = client.mget(keys)
  const dbRules = Object.values(data)

  const rankings = {}

  const areCurrenciesSame =
    transaction.CurrencyCountry == transaction.PaymentEntity.Country

  const store = {
    'FEE-LOCALE': areCurrenciesSame ? 'LOCL' : 'INTL'
  }
  store['FEE-CURRENCY'] = transaction['Currency']
  store['FEE-ENTITY'] = transaction['PaymentEntity']['Type']
  store['ENTITY-PROPERTY'] = [
    transaction['PaymentEntity']['Brand'],
    transaction['PaymentEntity']['ID'],
    transaction['PaymentEntity']['Issuer'],
    transaction['PaymentEntity']['SixID'],
    transaction['PaymentEntity']['Number']
  ]

  let currMatch = false
  dbRules.forEach((rule, ind) => {
    let arr = Object.keys(store)
    let i = 0

    while (i < arr.length) {
      let key = arr[i]

      if (key == 'ENTITY-PROPERTY') {
        if (store[key].includes(rule[key])) {
          rankings[rule['FEE-ID']]
            ? rankings[rule['FEE-ID']]++
            : (rankings[rule['FEE-ID']] = 1)
          i++
        } else if (rule[key] == '*') {
          rankings[rule['FEE-ID']]
            ? (rankings[rule['FEE-ID']] += 0.5)
            : (rankings[rule['FEE-ID']] = 0.5)
          i++
        } else {
          rankings[rule['FEE-ID']] = 0
          i = arr.length
        }
        continue
      }

      if (key === 'FEE-CURRENCY') {
        if (store[key] === rule[key]) {
          currMatch = true
          rankings[rule['FEE-ID']]
            ? rankings[rule['FEE-ID']]++
            : (rankings[rule['FEE-ID']] = 1)
        } else if (rule[key] == '*') {
          currMatch = true
          rankings[rule['FEE-ID']]
            ? (rankings[rule['FEE-ID']] += 0.5)
            : (rankings[rule['FEE-ID']] = 0.5)
        }
        i++
        continue
      }

      if (rule[key] == store[key]) {
        rankings[rule['FEE-ID']]
          ? rankings[rule['FEE-ID']]++
          : (rankings[rule['FEE-ID']] = 1)
        i++
      } else if (rule[key] == '*') {
        rankings[rule['FEE-ID']]
          ? (rankings[rule['FEE-ID']] += 0.5)
          : (rankings[rule['FEE-ID']] = 0.5)
        i++
      } else {
        rankings[rule['FEE-ID']] = 0
        i = arr.length
      }
    }
  })

  if (!currMatch) {
    return transaction['Currency']
  }

  let max = Math.max(...Object.values(rankings))
  if (max == 0) return null

  let result
  Object.keys(rankings).forEach((val) => {
    if (rankings[val] == max) result = val
  })

  let feeValue = data[result]['FEE-VALUE']
  let feetype = data[result]['FEE-TYPE']
  let amount = +transaction.Amount
  let pts = feeValue.split(':')
  let fee = pts.length > 1 ? +pts[0] : 0
  let perc = pts.length > 1 ? +pts[1] : +pts[0]
  let charge

  if (feetype === 'FLAT_PERC') {
    charge = fee + amount * (perc / 100)
  } else if (feetype === 'FLAT') {
    charge = pts[0]
  } else if (feetype === 'PERC') {
    charge = amount * (perc / 100)
  }

  let chargeAmount = transaction.Customer.BearsFee ? charge + amount : amount

  return {
    AppliedFeeID: result,
    AppliedFeeValue: Math.round(charge),
    ChargeAmount: chargeAmount,
    SettlementAmount: chargeAmount - charge
  }
}

export default handleCalulation
