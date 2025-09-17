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
  {
    id: "1",
    date: "2024-01-15",
    merchant: "Amazon",
    amount: 89.99,
    category: "Shopping",
    description: "Electronics purchase",
    status: "completed",
    paymentMethod: "Credit Card ****1234",
  },
  {
    id: "2",
    date: "2024-01-14",
    merchant: "Starbucks",
    amount: 5.47,
    category: "Food & Dining",
    description: "Coffee and pastry",
    status: "completed",
    paymentMethod: "Debit Card ****5678",
  },
  {
    id: "3",
    date: "2024-01-13",
    merchant: "Netflix",
    amount: 15.99,
    category: "Entertainment",
    description: "Monthly subscription",
    status: "completed",
    paymentMethod: "Credit Card ****1234",
  },
  {
    id: "4",
    date: "2024-01-12",
    merchant: "Uber",
    amount: 23.45,
    category: "Transportation",
    description: "Ride to downtown",
    status: "completed",
    paymentMethod: "Credit Card ****1234",
  },
  {
    id: "5",
    date: "2024-01-11",
    merchant: "Whole Foods",
    amount: 127.83,
    category: "Groceries",
    description: "Weekly grocery shopping",
    status: "completed",
    paymentMethod: "Debit Card ****5678",
  },
  {
    id: "6",
    date: "2024-01-10",
    merchant: "Shell Gas Station",
    amount: 45.2,
    category: "Gas & Fuel",
    description: "Fuel purchase",
    status: "completed",
    paymentMethod: "Credit Card ****1234",
  },
  {
    id: "7",
    date: "2024-01-09",
    merchant: "Apple Store",
    amount: 299.99,
    category: "Electronics",
    description: "AirPods Pro purchase",
    status: "completed",
    paymentMethod: "Credit Card ****1234",
  },
  {
    id: "8",
    date: "2024-01-08",
    merchant: "Target",
    amount: 67.42,
    category: "Shopping",
    description: "Household items",
    status: "completed",
    paymentMethod: "Debit Card ****5678",
  },
  {
    id: "9",
    date: "2024-01-07",
    merchant: "McDonald's",
    amount: 12.34,
    category: "Food & Dining",
    description: "Lunch meal",
    status: "completed",
    paymentMethod: "Credit Card ****1234",
  },
  {
    id: "10",
    date: "2024-01-06",
    merchant: "Spotify",
    amount: 9.99,
    category: "Entertainment",
    description: "Monthly subscription",
    status: "completed",
    paymentMethod: "Credit Card ****1234",
  },
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
