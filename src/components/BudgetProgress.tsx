import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useFinance } from '@/contexts/FinanceContext';

export const BudgetProgress: React.FC = () => {
  const { state, getCategorySpending } = useFinance();

  const budgetsWithSpending = state.budgets.map(budget => {
    const spent = getCategorySpending(budget.category);
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    const remaining = budget.limit - spent;

    return {
      ...budget,
      spent,
      percentage: Math.min(percentage, 100),
      remaining,
      status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good'
    };
  });

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeded':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-finance-expense';
    if (percentage >= 80) return 'bg-finance-savings';
    return 'bg-finance-income';
  };

  if (budgetsWithSpending.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-lg font-medium">No budgets set</p>
        <p className="text-sm">Create budgets to track your spending limits</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {budgetsWithSpending.map((budget) => (
        <div key={budget.category} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">{budget.category}</h4>
              <Badge variant={getStatusColor(budget.status)}>
                {budget.status === 'exceeded' ? 'Over Budget' : 
                 budget.status === 'warning' ? 'Near Limit' : 'On Track'}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
              </p>
              <p className="text-xs text-muted-foreground">
                {budget.remaining >= 0 ? 
                  `${formatCurrency(budget.remaining)} remaining` : 
                  `${formatCurrency(Math.abs(budget.remaining))} over budget`}
              </p>
            </div>
          </div>
          
          <div className="relative">
            <Progress 
              value={budget.percentage} 
              className="h-3"
            />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(budget.percentage)}`}
              style={{ width: `${Math.min(budget.percentage, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>{budget.percentage.toFixed(1)}%</span>
            <span>100%</span>
          </div>
        </div>
      ))}
    </div>
  );
};