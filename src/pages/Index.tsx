import React, { useState } from 'react';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">FinTracker</h1>
                <p className="text-sm text-muted-foreground">Your Personal Finance Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setActiveTab('add')}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
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