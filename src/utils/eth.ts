
const ETH_DECIMALS = 18

export function ethToWei(value: string): bigint {
  const [whole, fraction = ''] = value.split('.')

  if (
    !/^\d+$/.test(whole) ||
    !/^\d*$/.test(fraction) ||
    fraction.length > ETH_DECIMALS
  ) {
    throw new Error('Valor ETH inválido')
  }

  const paddedFraction = fraction.padEnd(ETH_DECIMALS, '0')

  return (
    BigInt(whole) * 10n ** 18n +
    BigInt(paddedFraction)
  )
}

export function weiToEth(value: bigint): string {
  const whole = value / 10n ** 18n
  const fraction = value % 10n ** 18n

  const fractionText = fraction
    .toString()
    .padStart(ETH_DECIMALS, '0')
    .replace(/0+$/, '')

  return fractionText
    ? `${whole}.${fractionText}`
    : whole.toString()
}
