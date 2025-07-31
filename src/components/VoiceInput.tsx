import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFinance } from '@/contexts/FinanceContext';

interface VoiceInputProps {
  onTransactionAdded?: () => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTransactionAdded }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { addTransaction, state } = useFinance();
  const { toast } = useToast();

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const parseVoiceCommand = (transcript: string): { type: 'income' | 'expense'; amount: number; category: string; description: string } | null => {
    const lowerTranscript = transcript.toLowerCase();
    
    // Extract amount using regex for currency patterns
    const amountMatch = lowerTranscript.match(/(?:₹|rs\.?|rupees?)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:₹|rs\.?|rupees?)/i);
    const amount = amountMatch ? parseFloat(amountMatch[1] || amountMatch[2]) : null;

    if (!amount) {
      return null;
    }

    // Determine if it's income or expense
    const isIncome = /(?:add|received?|earned?|income|salary|paid|got)\s+(?:₹|rs\.?|\d)/i.test(lowerTranscript) ||
                    /(?:₹|rs\.?|\d).*(?:received?|earned?|income|salary|paid to me|got)/i.test(lowerTranscript);
    
    const isExpense = /(?:spent?|expense|buy|bought|paid for|purchase|cost)\s+(?:₹|rs\.?|\d)/i.test(lowerTranscript) ||
                     /(?:₹|rs\.?|\d).*(?:spent?|expense|on|for|bought)/i.test(lowerTranscript);

    let type: 'income' | 'expense' = 'expense'; // default to expense
    if (isIncome && !isExpense) {
      type = 'income';
    }

    // Extract category
    const categories = type === 'income' ? state.categories.income : state.categories.expense;
    let category = 'Other';
    
    for (const cat of categories) {
      if (lowerTranscript.includes(cat.toLowerCase())) {
        category = cat;
        break;
      }
    }

    // Special category matching for common terms
    const categoryMappings: Record<string, string> = {
      'food': 'Food',
      'grocery': 'Food',
      'groceries': 'Food',
      'restaurant': 'Food',
      'lunch': 'Food',
      'dinner': 'Food',
      'breakfast': 'Food',
      'transport': 'Transportation',
      'taxi': 'Transportation',
      'uber': 'Transportation',
      'bus': 'Transportation',
      'train': 'Transportation',
      'petrol': 'Transportation',
      'fuel': 'Transportation',
      'movie': 'Entertainment',
      'entertainment': 'Entertainment',
      'shopping': 'Shopping',
      'clothes': 'Shopping',
      'bill': 'Bills',
      'electricity': 'Bills',
      'phone': 'Bills',
      'internet': 'Bills',
      'salary': 'Salary',
      'freelance': 'Freelancing',
      'business': 'Business'
    };

    for (const [key, value] of Object.entries(categoryMappings)) {
      if (lowerTranscript.includes(key)) {
        if (type === 'income' && state.categories.income.includes(value)) {
          category = value;
          break;
        } else if (type === 'expense' && state.categories.expense.includes(value)) {
          category = value;
          break;
        }
      }
    }

    return {
      type,
      amount,
      category,
      description: transcript.trim()
    };
  };

  const startListening = () => {
    if (!isSupported) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input. Please use Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Indian English for better currency recognition

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Say something like 'Add ₹500 to groceries' or 'Spent ₹200 on lunch'"
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice transcript:', transcript);
      
      const parsedCommand = parseVoiceCommand(transcript);
      
      if (parsedCommand) {
        addTransaction({
          ...parsedCommand,
          date: new Date().toISOString().split('T')[0]
        });
        
        toast({
          title: "Transaction Added!",
          description: `${parsedCommand.type === 'income' ? 'Income' : 'Expense'} of ₹${parsedCommand.amount} for ${parsedCommand.category}`
        });
        
        onTransactionAdded?.();
      } else {
        toast({
          title: "Could not parse command",
          description: "Try saying something like 'Add ₹500 to groceries' or 'Spent ₹200 on lunch'",
          variant: "destructive"
        });
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast({
        title: "Voice Input Error",
        description: "Could not process voice input. Please try again.",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      onClick={startListening}
      disabled={isListening}
      variant={isListening ? "destructive" : "outline"}
      size="sm"
      className="gap-2"
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4" />
          Listening...
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          Voice Input
        </>
      )}
    </Button>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}