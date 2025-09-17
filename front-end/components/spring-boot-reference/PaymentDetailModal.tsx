/**
 * Spring Boot Reference: Payment Detail Modal Component
 *
 * This modal shows detailed transaction information and allows category editing.
 *
 * Backend API Endpoints needed:
 * - PUT /api/transactions/{id}/category
 * - GET /api/transactions/{id}/details
 *
 * Key Features:
 * 1. Display comprehensive transaction details
 * 2. Edit transaction category with dropdown
 * 3. Add new categories inline
 * 4. Status-based conditional rendering
 */

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useData } from "@/lib/data-context"
import type { PaymentTransaction } from "@/lib/mock-data"
import {
  CreditCard,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Check,
  X,
  Edit3,
} from "lucide-react"

interface PaymentDetailModalProps {
  transaction: PaymentTransaction | null
  isOpen: boolean
  onClose: () => void
}

export function PaymentDetailModal({ transaction, isOpen, onClose }: PaymentDetailModalProps) {
  const { categories, addCategory, updateTransactionCategory } = useData()
  const [isEditingCategory, setIsEditingCategory] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  if (!transaction) return null

  const handleCategoryUpdate = () => {
    if (selectedCategory && selectedCategory !== transaction.category) {
      updateTransactionCategory(transaction.id, selectedCategory)
      setIsEditingCategory(false)
      // In Spring Boot: PUT request to /api/transactions/{id}/category with { category: selectedCategory }
    }
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim())
      setSelectedCategory(newCategoryName.trim())
      setNewCategoryName("")
      setIsAddingCategory(false)
      // In Spring Boot: POST request to /api/categories with { name: newCategoryName }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">{transaction.merchant}</h3>
              <p className="text-muted-foreground">{transaction.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{formatCurrency(transaction.amount)}</p>
              <div className="flex items-center gap-2 mt-2">
                {getStatusIcon(transaction.status)}
                <Badge className={`${getStatusColor(transaction.status)} border`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Category Section with Edit Functionality */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Category</h4>
              {!isEditingCategory && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditingCategory(true)
                    setSelectedCategory(transaction.category)
                  }}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {!isEditingCategory ? (
              <Badge variant="secondary" className="text-sm">
                {transaction.category}
              </Badge>
            ) : (
              <div className="space-y-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

                {!isAddingCategory ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingCategory(true)}
                    className="w-full bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Category
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddCategory()
                        } else if (e.key === "Escape") {
                          setIsAddingCategory(false)
                          setNewCategoryName("")
                        }
                      }}
                    />
                    <Button variant="ghost" size="sm" onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAddingCategory(false)
                        setNewCategoryName("")
                      }}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleCategoryUpdate} disabled={!selectedCategory}>
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingCategory(false)
                      setIsAddingCategory(false)
                      setNewCategoryName("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Transaction Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Date</p>
                  <p className="font-medium">{formatDate(transaction.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{transaction.paymentMethod}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Receipt className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-sm">{transaction.id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {transaction.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{transaction.location}</p>
                  </div>
                </div>
              )}

              {transaction.merchantContact && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Merchant Contact</p>
                    <p className="font-medium">{transaction.merchantContact}</p>
                  </div>
                </div>
              )}

              {transaction.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <a
                      href={transaction.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent hover:underline"
                    >
                      {transaction.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status-specific Information */}
          {transaction.status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-800">Pending Transaction</h4>
              </div>
              <p className="text-sm text-yellow-700">
                This transaction is currently being processed. It may take 1-3 business days to complete.
              </p>
            </div>
          )}

          {transaction.status === "failed" && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-red-800">Failed Transaction</h4>
              </div>
              <p className="text-sm text-red-700">
                This transaction could not be completed. Please contact your bank or try again.
              </p>
            </div>
          )}

          {transaction.status === "completed" && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Transaction Completed</h4>
              </div>
              <p className="text-sm text-green-700">This transaction has been successfully processed and completed.</p>
            </div>
          )}

          {/* Additional Notes */}
          {transaction.notes && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Additional Notes</h4>
              <p className="text-sm text-muted-foreground">{transaction.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
