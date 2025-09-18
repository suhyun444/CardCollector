"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useData } from "@/lib/data-context"
import { ArrowLeft, Upload, Download, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function DataManagementPage() {
  const { transactions, exportTransactions, importTransactions, clearAllData } = useData()
  const { toast } = useToast()

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

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/transactions/upload", { // 백엔드로 전송
        method: "POST",
        body: formData,
      });
      if(response.ok)
      {
        //transactions 업데이트
      }
    } catch (error) {
      // ... error handling
    }
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

        {/* Data Import/Export */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-accent" />
                Import & Export
              </CardTitle>
              <CardDescription>Backup and restore your payment data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="import-file">Import Data</Label>
                    <Input id="import-file" type="file" accept=".xls, .xlsx" onChange={handleImport} className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">Import transactions from a Excel file</p>
                  </div>

                  <Button onClick={handleExport} variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="font-medium text-destructive">Danger Zone</span>
                  </div>
                  <Button onClick={handleClearData} variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    This will permanently delete all your transaction data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
