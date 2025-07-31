import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useFinance } from '@/contexts/FinanceContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ExpenseChart: React.FC = () => {
  const { state } = useFinance();

  const expensesByCategory = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const categories = Object.keys(expensesByCategory);
  const amounts = Object.values(expensesByCategory);

  // Color palette for different categories
  const colors = [
    'hsl(var(--finance-expense))',
    'hsl(var(--finance-savings))',
    'hsl(var(--finance-investment))',
    'hsl(var(--primary))',
    'hsl(var(--accent))',
    'hsl(215, 85%, 35%)',
    'hsl(145, 75%, 40%)',
    'hsl(45, 90%, 45%)',
    'hsl(260, 75%, 50%)',
    'hsl(0, 75%, 45%)',
  ];

  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: colors.slice(0, categories.length),
        borderColor: colors.slice(0, categories.length).map(color => color.replace(')', ', 0.8)')),
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = amounts.reduce((sum, amount) => sum + amount, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
          },
        },
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--card-foreground))',
        bodyColor: 'hsl(var(--card-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
      },
    },
    cutout: '60%',
  };

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">No expenses yet</p>
          <p className="text-sm">Add some transactions to see your expense breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
};