"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/lib/data-context"
import { ArrowLeft, Plus, Upload, Download, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function DataManagementPage() {
  const { transactions, addTransaction, exportTransactions, importTransactions, clearAllData } = useData()
  const { toast } = useToast()

  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split("T")[0],
    merchant: "",
    amount: "",
    category: "",
    description: "",
    status: "completed" as const,
    paymentMethod: "",
  })

  const categories = [
    "Shopping",
    "Food & Dining",
    "Entertainment",
    "Transportation",
    "Groceries",
    "Gas & Fuel",
    "Electronics",
    "Healthcare",
    "Utilities",
  ]

  const paymentMethods = ["Credit Card ****1234", "Debit Card ****5678", "PayPal", "Bank Transfer", "Cash"]

  const handleAddTransaction = () => {
    if (!newTransaction.merchant || !newTransaction.amount || !newTransaction.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    addTransaction({
      ...newTransaction,
      amount: Number.parseFloat(newTransaction.amount),
    })

    setNewTransaction({
      date: new Date().toISOString().split("T")[0],
      merchant: "",
      amount: "",
      category: "",
      description: "",
      status: "completed",
      paymentMethod: "",
    })
    setIsAddingTransaction(false)

    toast({
      title: "Transaction Added",
      description: "New transaction has been successfully added.",
    })
  }

  const handleExport = () => {
    const dataStr = exportTransactions()
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `payment-history-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Data Exported",
      description: "Your payment history has been exported successfully.",
    })
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        if (Array.isArray(importedData)) {
          importTransactions(importedData)
          toast({
            title: "Data Imported",
            description: `Successfully imported ${importedData.length} transactions.`,
          })
        } else {
          throw new Error("Invalid file format")
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import data. Please check the file format.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete all transaction data? This action cannot be undone.")) {
      clearAllData()
      toast({
        title: "Data Cleared",
        description: "All transaction data has been deleted.",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Management</h1>
            <p className="text-muted-foreground">Manage your payment history data</p>
          </div>
        </div>

        {/* Data Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Transaction</p>
                  <p className="text-2xl font-bold">
                    {transactions.length > 0 ? formatCurrency(totalAmount / transactions.length) : "$0.00"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add New Transaction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-accent" />
                Add New Transaction
              </CardTitle>
              <CardDescription>Manually add a new payment transaction</CardDescription>
            </CardHeader>
            <CardContent>
              {!isAddingTransaction ? (
                <Button onClick={() => setIsAddingTransaction(true)} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="merchant">Merchant *</Label>
                      <Input
                        id="merchant"
                        value={newTransaction.merchant}
                        onChange={(e) => setNewTransaction((prev) => ({ ...prev, merchant: e.target.value }))}
                        placeholder="e.g., Amazon"
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction((prev) => ({ ...prev, amount: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={newTransaction.category}
                        onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction((prev) => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Transaction description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newTransaction.status}
                        onValueChange={(value: any) => setNewTransaction((prev) => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select
                        value={newTransaction.paymentMethod}
                        onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, paymentMethod: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddTransaction} className="flex-1">
                      Add Transaction
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingTransaction(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Import/Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-accent" />
                Import & Export
              </CardTitle>
              <CardDescription>Backup and restore your payment data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="import-file">Import Data</Label>
                <Input id="import-file" type="file" accept=".json" onChange={handleImport} className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1">Import transactions from a JSON file</p>
              </div>

              <Button onClick={handleExport} variant="outline" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">Danger Zone</span>
                </div>
                <Button onClick={handleClearData} variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  This will permanently delete all your transaction data
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
