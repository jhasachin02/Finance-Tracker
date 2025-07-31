import React, { useState, useEffect } from 'react';
// Theme toggle button component
const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      aria-label="Toggle Dark Mode"
      className="rounded-full p-2 border bg-card hover:bg-muted transition-colors"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
      )}
    </button>
  );
};
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Plus, 
  List, 
  Target, 
  BarChart3, 
  Wallet,
  TrendingUp
} from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { BudgetForm } from '@/components/BudgetForm';
import { MonthlyReport } from '@/components/MonthlyReport';
import { Transaction } from '@/contexts/FinanceContext';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('add');
  };

  const handleTransactionSubmit = () => {
    setEditingTransaction(undefined);
    setActiveTab('transactions');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 transition-colors">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-foreground leading-tight">Finance Tracker</h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-tight">Your Personal Finance Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-end">
              <ThemeToggle />
              <Button
                variant="default"
                size="sm"
                onClick={() => setActiveTab('add')}
                className="gap-2 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden xs:inline">Add Transaction</span>
                <span className="inline xs:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-0 lg:w-auto">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="add" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="budget" className="gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Budget</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="add">
            <TransactionForm
              transaction={editingTransaction}
              onSubmit={handleTransactionSubmit}
              onCancel={() => {
                setEditingTransaction(undefined);
                setActiveTab('dashboard');
              }}
            />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionList onEditTransaction={handleEditTransaction} />
          </TabsContent>

          <TabsContent value="budget">
            <div className="grid gap-6 md:grid-cols-2">
              <BudgetForm />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Budget Tips</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3 p-3 bg-card rounded-lg border">
                    <TrendingUp className="h-4 w-4 mt-0.5 text-finance-income" />
                    <div>
                      <p className="font-medium text-foreground">Set Realistic Goals</p>
                      <p>Start with higher limits and gradually reduce them as you build better spending habits.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-card rounded-lg border">
                    <Target className="h-4 w-4 mt-0.5 text-finance-savings" />
                    <div>
                      <p className="font-medium text-foreground">Track Progress</p>
                      <p>Review your budget progress weekly to stay on track and make adjustments.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-card rounded-lg border">
                    <BarChart3 className="h-4 w-4 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Use Voice Input</p>
                      <p>Try saying "Add ₹500 to groceries" or "Spent ₹200 on lunch" for quick entries.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <MonthlyReport />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;