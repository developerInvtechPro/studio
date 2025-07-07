
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getBudgetAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, Bot } from 'lucide-react';

export default function BudgetTracker() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const dailyBudget = 500;
  const currentSales = 280;
  const progress = (currentSales / dailyBudget) * 100;

  const handleGetTip = async () => {
    setLoading(true);
    const input = {
      cashierId: 'CASHIER-001',
      dailySales: currentSales,
      dailyBudget: dailyBudget,
      timeOfDay: new Date().getHours() < 12 ? 'morning' : 'afternoon',
    };
    const result = await getBudgetAction(input);
    if (result.success && result.data) {
      toast({
        title: result.data.reminder,
        description: result.data.recommendation,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Could not fetch AI tip.',
      });
    }
    setLoading(false);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <Target className="h-5 w-5 text-secondary" />
          Daily Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-baseline">
          <p className="text-2xl font-bold font-headline text-primary">${currentSales.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">of ${dailyBudget.toFixed(2)}</p>
        </div>
        <Progress value={progress} aria-label={`${progress.toFixed(0)}% of daily goal`} />
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetTip} disabled={loading} className="w-full bg-secondary hover:bg-accent text-secondary-foreground">
          <Bot className="mr-2 h-4 w-4" />
          {loading ? 'Thinking...' : 'Get AI Tip'}
        </Button>
      </CardFooter>
    </Card>
  );
}
