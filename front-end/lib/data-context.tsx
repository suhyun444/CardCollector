"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { mockTransactions, type PaymentTransaction } from "./mock-data"

interface DataContextType {
  transactions: PaymentTransaction[]
  categories: string[]
  addTransaction: (transaction: Omit<PaymentTransaction, "id">) => void
  updateTransaction: (id: string, updates: Partial<PaymentTransaction>) => void
  deleteTransaction: (id: string) => void
  addCategory: (category: string) => void
  deleteCategory: (category: string) => void
  importTransactions: (transactions: PaymentTransaction[]) => void
  exportTransactions: () => string
  clearAllData: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const savedData = localStorage.getItem("payment-history-data")
    const savedCategories = localStorage.getItem("payment-categories")

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setTransactions(parsed)
      } catch (error) {
        console.error("Failed to load saved data:", error)
        setTransactions(mockTransactions)
      }
    } else {
      setTransactions(mockTransactions)
    }

    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories)
        setCategories(parsedCategories)
      } catch (error) {
        console.error("Failed to load saved categories:", error)
        extractCategoriesFromTransactions(mockTransactions)
      }
    } else {
      extractCategoriesFromTransactions(mockTransactions)
    }
  }, [])

  const extractCategoriesFromTransactions = (transactionList: PaymentTransaction[]) => {
    const uniqueCategories = Array.from(new Set(transactionList.map((t) => t.category))).sort()
    setCategories(uniqueCategories)
  }

  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("payment-history-data", JSON.stringify(transactions))
    }
  }, [transactions])

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("payment-categories", JSON.stringify(categories))
    }
  }, [categories])

  const addTransaction = (transaction: Omit<PaymentTransaction, "id">) => {
    const newTransaction: PaymentTransaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }
    setTransactions((prev) => [newTransaction, ...prev])

    if (!categories.includes(transaction.category)) {
      setCategories((prev) => [...prev, transaction.category].sort())
    }
  }
  const updateTransaction = (id: string, updates: Partial<PaymentTransaction>) => {
  setTransactions((prev) =>
    prev.map((transaction) => (transaction.id === id ? { ...transaction, ...updates } : transaction)),
  )

  // 1. 변수에 category 값을 먼저 할당합니다.
  const newCategory = updates.category;

  // 2. 해당 변수가 string 타입인지 명확하게 확인합니다.
  if (newCategory && typeof newCategory === 'string' && !categories.includes(newCategory)) {
    // if 블록 안에서 newCategory는 이제 확실한 string 타입입니다.
    setCategories((prev) => [...prev, newCategory].sort())
  }
}


  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
  }

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories((prev) => [...prev, category].sort())
    }
  }

  const deleteCategory = (category: string) => {
    setCategories((prev) => prev.filter((cat) => cat !== category))
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.category === category ? { ...transaction, category: "Uncategorized" } : transaction,
      ),
    )
  }

  const importTransactions = (newTransactions: PaymentTransaction[]) => {
    setTransactions(newTransactions)
    extractCategoriesFromTransactions(newTransactions)
  }

  const exportTransactions = () => {
    return JSON.stringify(transactions, null, 2)
  }

  const clearAllData = () => {
    setTransactions([])
    setCategories([])
    localStorage.removeItem("payment-history-data")
    localStorage.removeItem("payment-categories")
  }

  return (
    <DataContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        deleteCategory,
        importTransactions,
        exportTransactions,
        clearAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
