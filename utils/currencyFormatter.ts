export function formatCurrency(num:number) {
  const value = num.toFixed(2)
  return `₦ ${value}`
}
