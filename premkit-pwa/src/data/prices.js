const DEFAULT_ESTIMATED_PRICE = 350000

export const ESTIMATED_PRICES = {
  Arsenal: 550000,
  'Manchester City': 450000,
  'Manchester United': 600000,
  Liverpool: 500000,
  Chelsea: 450000,
  'Tottenham Hotspur': 375000,
  'Newcastle United': 480000,
  'Aston Villa': 380000,
  Everton: 350000,
  'West Ham United': 420000,
  'AFC Bournemouth': 325000,
}

export function formatRupiah(amount) {
  const numeric = Number(amount)
  if (!Number.isFinite(numeric)) return String(amount)
  const formatted = Math.round(numeric)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `Rp${formatted}`
}

export function resolveEstimatedPrice(kit, clubName) {
  const apiPrice = kit?.estimated_price ?? kit?.price
  if (apiPrice !== undefined && apiPrice !== null && apiPrice !== '') {
    return typeof apiPrice === 'number' || /^\d+$/.test(String(apiPrice).trim())
      ? formatRupiah(apiPrice)
      : String(apiPrice)
  }
  const amount = ESTIMATED_PRICES[clubName] ?? DEFAULT_ESTIMATED_PRICE
  return formatRupiah(amount)
}
