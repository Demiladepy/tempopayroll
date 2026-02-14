/**
 * Rule-based local fallback when Claude API is offline, rate-limited, or key invalid.
 * Generates actionable payroll recommendations from business context.
 */
export interface PayrollContext {
  total_payroll_usdc: number
  employee_count: number
  employee_currencies: string[]
  last_payroll_date: string | null
  recent_batches: Array<{ total: number; date: string }>
  demo_brl_rate: number
}

export function getLocalRecommendations(context: PayrollContext): string[] {
  const tips: string[] = []
  const { total_payroll_usdc, employee_count, last_payroll_date, employee_currencies } = context

  if (employee_count === 0) {
    tips.push('Add employees to run your first payroll.')
    return tips
  }

  tips.push(`You have ${employee_count} active employee${employee_count > 1 ? 's' : ''}. Total monthly payroll is $${total_payroll_usdc.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC.`)

  if (total_payroll_usdc > 0) {
    tips.push('Ensure your wallet holds at least this amount in USDC before running payroll.')
  }

  if (last_payroll_date) {
    const last = new Date(last_payroll_date)
    const daysSince = Math.floor((Date.now() - last.getTime()) / 86400000)
    if (daysSince > 14) {
      tips.push(`Last payroll was ${daysSince} days ago. Consider running payroll soon.`)
    } else if (daysSince > 7) {
      tips.push('Payroll typically runs every 1–2 weeks. Schedule the next run when convenient.')
    }
  } else {
    tips.push('No payroll runs yet. Run payroll when your wallet is funded with USDC.')
  }

  if (employee_currencies.some((c) => c && c !== 'USDC')) {
    tips.push('Some employees use local currency conversion. Rates are applied at payment time.')
  }

  tips.push('Run payroll during low-activity hours to minimize gas; Tempo testnet fees are low.')

  return tips
}
