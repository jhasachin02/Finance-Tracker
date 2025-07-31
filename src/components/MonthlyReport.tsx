import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Calendar, PieChart } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

export const MonthlyReport: React.FC = () => {
  const { state, getCategorySpending } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  // Generate last 12 months for selection
  const months = eachMonthOfInterval({
    start: subMonths(new Date(), 11),
    end: new Date()
  }).map(date => ({
    value: format(date, 'yyyy-MM'),
    label: format(date, 'MMMM yyyy')
  }));

  // Filter transactions for selected month
  const monthlyTransactions = state.transactions.filter(t => 
    t.date.startsWith(selectedMonth)
  );

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyBalance = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? ((monthlyBalance / monthlyIncome) * 100) : 0;

  // Category breakdown for expenses
  const expensesByCategory = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryBreakdown = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5); // Top 5 categories

  // Compare with previous month
  const prevMonth = format(subMonths(new Date(selectedMonth + '-01'), 1), 'yyyy-MM');
  const prevMonthTransactions = state.transactions.filter(t => t.date.startsWith(prevMonth));
  const prevMonthExpense = prevMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenseChange = prevMonthExpense > 0 
    ? ((monthlyExpense - prevMonthExpense) / prevMonthExpense) * 100 
    : 0;

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Report
          </CardTitle>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-finance-income" />
              <span className="text-sm font-medium text-muted-foreground">Income</span>
            </div>
            <div className="text-2xl font-bold text-finance-income">
              {formatCurrency(monthlyIncome)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-finance-expense" />
              <span className="text-sm font-medium text-muted-foreground">Expense</span>
            </div>
            <div className="text-2xl font-bold text-finance-expense">
              {formatCurrency(monthlyExpense)}
            </div>
            {expenseChange !== 0 && (
              <p className="text-xs text-muted-foreground">
                {expenseChange > 0 ? '+' : ''}{expenseChange.toFixed(1)}% vs last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Balance</span>
            </div>
            <div className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-finance-income' : 'text-finance-expense'}`}>
              {formatCurrency(monthlyBalance)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Savings Rate</span>
            </div>
            <div className="text-2xl font-bold text-finance-savings">
              {savingsRate.toFixed(1)}%
            </div>
            <Progress value={Math.max(0, savingsRate)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Top Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map(([category, amount]) => {
                const percentage = monthlyExpense > 0 ? (amount / monthlyExpense) * 100 : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category}</span>
                      <div className="flex items-center gap-2">
                        <span>{formatCurrency(amount)}</span>
                        <Badge variant="secondary">{percentage.toFixed(1)}%</Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {monthlyTransactions.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-8">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">No transactions for this month</p>
              <p className="text-sm">Select a different month or add some transactions</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};