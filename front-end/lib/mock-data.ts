export interface PaymentTransaction {
  id: string
  date: string
  merchant: string
  amount: number
  category: string
  description: string
  status: "completed" | "pending" | "failed"
  paymentMethod: string
}

export const mockTransactions: PaymentTransaction[] = [
  
]

export function getTransactionsByMonth(year: number, month: number): PaymentTransaction[] {
  return mockTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    return transactionDate.getFullYear() === year && transactionDate.getMonth() === month - 1
  })
}

export function getMonthlySpendingSummary() {
  const summary = mockTransactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          total: 0,
          transactions: 0,
          categories: {},
        }
      }

      acc[monthKey].total += transaction.amount
      acc[monthKey].transactions += 1

      if (!acc[monthKey].categories[transaction.category]) {
        acc[monthKey].categories[transaction.category] = 0
      }
      acc[monthKey].categories[transaction.category] += transaction.amount

      return acc
    },
    {} as Record<string, any>,
  )

  return Object.values(summary)
}
