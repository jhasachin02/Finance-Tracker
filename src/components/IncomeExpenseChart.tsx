import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useFinance } from '@/contexts/FinanceContext';
import { format, subMonths, eachMonthOfInterval, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


export const IncomeExpenseChart: React.FC = () => {
  const { state } = useFinance();

  // Generate last 6 months
  const endDate = new Date();
  const startDate = subMonths(endDate, 5);
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const white = '#fff';

  const monthlyData = months.map(month => {
    const monthStr = format(month, 'yyyy-MM');
    const monthlyIncome = state.transactions
      .filter(t => t.type === 'income' && t.date.startsWith(monthStr))
      .reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpense = state.transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(monthStr))
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      month: format(month, 'MMM yyyy'),
      income: monthlyIncome,
      expense: monthlyExpense,
    };
  });

  const data = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(d => d.income),
        borderColor: isDark ? white : 'hsl(var(--finance-income))',
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'hsl(var(--finance-income) / 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: isDark ? white : 'hsl(var(--finance-income))',
        pointBorderColor: isDark ? white : 'hsl(var(--finance-income))',
        pointHoverBackgroundColor: isDark ? white : 'hsl(var(--finance-income))',
        pointHoverBorderColor: isDark ? white : 'hsl(var(--finance-income))',
      },
      {
        label: 'Expense',
        data: monthlyData.map(d => d.expense),
        borderColor: isDark ? white : 'hsl(var(--finance-expense))',
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'hsl(var(--finance-expense) / 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: isDark ? white : 'hsl(var(--finance-expense))',
        pointBorderColor: isDark ? white : 'hsl(var(--finance-expense))',
        pointHoverBackgroundColor: isDark ? white : 'hsl(var(--finance-expense))',
        pointHoverBorderColor: isDark ? white : 'hsl(var(--finance-expense))',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
          },
          color: isDark ? white : undefined,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#222' : 'hsl(var(--card))',
        titleColor: isDark ? white : 'hsl(var(--card-foreground))',
        bodyColor: isDark ? white : 'hsl(var(--card-foreground))',
        borderColor: isDark ? white : 'hsl(var(--border))',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ₹${value.toLocaleString('en-IN')}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: isDark ? 'rgba(255,255,255,0.2)' : 'hsl(var(--border))',
          drawBorder: false,
        },
        ticks: {
          color: isDark ? white : 'hsl(var(--muted-foreground))',
        },
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255,255,255,0.2)' : 'hsl(var(--border))',
          drawBorder: false,
        },
        ticks: {
          color: isDark ? white : 'hsl(var(--muted-foreground))',
          callback: function(value: any) {
            return '₹' + value.toLocaleString('en-IN');
          },
        },
      },
    },
  };

  return (
    <div className="h-32 xs:h-40 sm:h-56 md:h-64 w-full max-w-full min-w-0">
      <Line data={data} options={options} />
    </div>
  );
};