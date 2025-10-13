"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PaymentTransaction } from "@/lib/mock-data"
import { useData } from "@/lib/data-context"
import { CreditCard, Calendar, MapPin, Receipt, Shield, Clock, Edit3, Plus, Check, X } from "lucide-react"
import { useState } from "react"

interface PaymentDetailModalProps {
  transaction: PaymentTransaction | null
  isOpen: boolean
  onClose: () => void
}

export function PaymentDetailModal({ transaction, isOpen, onClose }: PaymentDetailModalProps) {
  const { updateTransaction, categories, addCategory } = useData()
  const [isEditingCategory, setIsEditingCategory] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  if (!transaction) return null

  const handleCategoryUpdate = () => {
    if (selectedCategory && selectedCategory !== transaction.category) {
      updateTransaction(transaction.id, { category: selectedCategory })
    }
    setIsEditingCategory(false)
    setSelectedCategory("")
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim())
      setSelectedCategory(newCategoryName.trim())
      setNewCategoryName("")
      setIsAddingCategory(false)
    }
  }

  const handleModalChange = (open: boolean) => {
    if (!open) {
      setIsEditingCategory(false)
      setSelectedCategory("")
      setNewCategoryName("")
      setIsAddingCategory(false)
      onClose()
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✓"
      case "pending":
        return "⏳"
      case "failed":
        return "✗"
      default:
        return "?"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-accent" />
            Transaction Details
          </DialogTitle>
          <DialogDescription>Complete information for this payment</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getStatusIcon(transaction.status)}</span>
              <div>
                <p className="font-medium">Status</p>
                <Badge className={`${getStatusColor(transaction.status)} border`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(transaction.amount)}</p>
            </div>
          </div>

          <Separator />

          {/* Merchant Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Merchant</span>
            </div>
            <div className="pl-6">
              <p className="font-semibold text-lg">{transaction.merchant}</p>
              <p className="text-muted-foreground">{transaction.description}</p>
            </div>
          </div>

          <Separator />

          {/* Transaction Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Transaction Information</span>
            </div>

            <div className="pl-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-sm">{transaction.id}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Category</span>
                <div className="flex items-center gap-2">
                  {!isEditingCategory ? (
                    <>
                      <Badge variant="secondary">{transaction.category}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditingCategory(true)
                          setSelectedCategory(transaction.category)
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          <div className="border-t pt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsAddingCategory(true)}
                              className="w-full justify-start text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add New Category
                            </Button>
                          </div>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={handleCategoryUpdate} className="h-6 w-6 p-0">
                        <Check className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingCategory(false)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {isAddingCategory && (
                <div className="flex items-center gap-2 pl-4">
                  <Input
                    placeholder="New category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="h-8 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddCategory()
                      } else if (e.key === "Escape") {
                        setIsAddingCategory(false)
                        setNewCategoryName("")
                      }
                    }}
                  />
                  <Button variant="ghost" size="sm" onClick={handleAddCategory} className="h-6 w-6 p-0">
                    <Check className="h-3 w-3 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsAddingCategory(false)
                      setNewCategoryName("")
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date & Time</span>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-sm">{formatDate(transaction.date)}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-sm text-muted-foreground">{formatTime(transaction.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Payment Method</span>
            </div>
            <div className="pl-6">
              <p className="font-medium">{transaction.paymentMethod}</p>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">Secure payment processed</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {transaction.status === "pending" && (
            <>
              <Separator />
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Pending Transaction:</strong> This payment is currently being processed and should complete
                  within 1-2 business days.
                </p>
              </div>
            </>
          )}

          {transaction.status === "failed" && (
            <>
              <Separator />
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>Failed Transaction:</strong> This payment could not be processed. Please contact your bank or
                  try a different payment method.
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
