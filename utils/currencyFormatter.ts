export function formatCurrency(num:number) {
  const value = num.toLocaleString()
  return `₦${value}`
}
