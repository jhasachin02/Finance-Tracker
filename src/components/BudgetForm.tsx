import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Plus } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';

export const BudgetForm: React.FC = () => {
  const { setBudget, state, getCategorySpending } = useFinance();
  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.limit) {
      return;
    }

    const spent = getCategorySpending(formData.category);
    
    setBudget({
      category: formData.category,
      limit: parseFloat(formData.limit),
      spent
    });

    setFormData({ category: '', limit: '' });
  };

  const expenseCategories = state.categories.expense;
  const existingBudgetCategories = state.budgets.map(b => b.category);
  const availableCategories = expenseCategories.filter(cat => 
    !existingBudgetCategories.includes(cat)
  );

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-finance-savings" />
          Set Budget Limit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category to budget" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.length === 0 ? (
                  <SelectItem value="" disabled>
                    All categories have budgets set
                  </SelectItem>
                ) : (
                  availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Budget Limit (₹)</Label>
            <Input
              id="limit"
              type="number"
              placeholder="Enter monthly budget limit"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={availableCategories.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Set Budget
          </Button>
        </form>

        {availableCategories.length === 0 && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            You've set budgets for all expense categories. Great job planning ahead!
          </p>
        )}
      </CardContent>
    </Card>
  );
};