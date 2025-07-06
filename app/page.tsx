"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import Link from "next/link"
import { ExpenseChart } from "@/components/expense-chart"

// Mock data - in real app, this would come from API
const mockData = {
  totalIncome: 5420.0,
  totalExpenses: 3280.5,
  currentBalance: 2139.5,
  expensesByCategory: [
    { name: "Food", value: 1200, fill: "hsl(var(--chart-1))" },
    { name: "Transport", value: 800, fill: "hsl(var(--chart-2))" },
    { name: "Shopping", value: 600, fill: "hsl(var(--chart-3))" },
    { name: "Bills", value: 480, fill: "hsl(var(--chart-4))" },
    { name: "Other", value: 200.5, fill: "hsl(var(--chart-5))" },
  ],
}

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your financial activity</p>
        </div>
        <Link href="/add-transaction">
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500 dark:border-l-green-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${mockData.totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 dark:border-l-red-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${mockData.totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${mockData.currentBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Available balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Expense Breakdown by Category</CardTitle>
          <p className="text-sm text-muted-foreground">Your spending distribution this month</p>
        </CardHeader>
        <CardContent>
          <ExpenseChart data={mockData.expensesByCategory} />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/add-transaction">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 bg-transparent">
                <Plus className="w-6 h-6" />
                <span>Add New Transaction</span>
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 bg-transparent">
                <TrendingUp className="w-6 h-6" />
                <span>View All Transactions</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
