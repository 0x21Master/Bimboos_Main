function getNumber(input: string | number | undefined): number | undefined {
  let num: number | undefined = undefined
  if (typeof input === 'number') {
    num = input
  } else if (typeof input === 'string') {
    num = Number(input)
  }
  if (typeof num === 'number') {
    if (isNaN(num) || !isFinite(num)) {
      num = undefined
    }
  }
  return num
}

export function currencyFormat(dollar: string | number | undefined, errorText?: string): string | undefined {
  const num = getNumber(dollar)
  if (errorText && typeof num === 'undefined') errorText
  return num?.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    useGrouping: true,
    maximumFractionDigits: 2,
  })
}

export function amountFormat(amount: string | number | undefined, errorText?: string): string | undefined {
  const num = getNumber(amount)
  if (errorText && typeof num === 'undefined') errorText
  return num
    ?.toLocaleString(undefined, {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    })
    .replace(/,/gi, '')
}

export function percentFormat(input: string | number | undefined, fixed = 2, errorText?: string): string | undefined {
  const num = getNumber(input)
  if (typeof num === 'undefined') {
    if (errorText) return errorText
    else return num
  }
  return (100 * num).toFixed(fixed)
}
