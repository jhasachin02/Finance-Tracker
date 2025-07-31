import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';
import { ExpenseChart } from './ExpenseChart';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { BudgetProgress } from './BudgetProgress';

export const Dashboard: React.FC = () => {
  const { getTotalIncome, getTotalExpense, getBalance, state } = useFinance();

  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();
  const balance = getBalance();

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Calculate percentage changes (mock data for demo)
  const incomeChange = 12.5;
  const expenseChange = -8.2;
  const balanceChange = 15.3;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-finance-income" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-income">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">
              +{incomeChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expense</CardTitle>
            <TrendingDown className="h-4 w-4 text-finance-expense" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-expense">{formatCurrency(totalExpense)}</div>
            <p className="text-xs text-muted-foreground">
              {expenseChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-finance-income' : 'text-finance-expense'}`}>
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{balanceChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budgets Set</CardTitle>
            <Target className="h-4 w-4 text-finance-savings" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-savings">{state.budgets.length}</div>
            <p className="text-xs text-muted-foreground">
              Active budget categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-chart">
          <CardHeader>
            <CardTitle>Income vs Expense Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart />
          </CardContent>
        </Card>

        <Card className="shadow-chart">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseChart />
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      {state.budgets.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetProgress />
          </CardContent>
        </Card>
      )}
    </div>
  );
};