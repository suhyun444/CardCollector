import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, TrendingUp, Calendar, BarChart3, Settings } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Payment History Manager</h1>
              <p className="text-muted-foreground text-lg">Track, analyze, and understand your spending patterns</p>
            </div>
            <Link href="/manage">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Manage Data
              </Button>
            </Link>
          </div>
        </header>

        {/* Dashboard cards for main features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Payment History
              </CardTitle>
              <CardDescription>View your transactions sorted by date with monthly intervals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Browse through your payment history, filter by date ranges, and view detailed information for each
                transaction.
              </p>
              <Link href="/history">
                <Button className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Payment History
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                AI Spending Analysis
              </CardTitle>
              <CardDescription>Get intelligent insights about your monthly spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Let AI analyze your spending habits and provide personalized insights to help you manage your finances
                better.
              </p>
              <Link href="/analysis">
                <Button className="w-full bg-transparent" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View AI Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">$2,847.32</p>
                </div>
                <div className="h-8 w-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">127</p>
                </div>
                <div className="h-8 w-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. per Transaction</p>
                  <p className="text-2xl font-bold">$22.42</p>
                </div>
                <div className="h-8 w-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
