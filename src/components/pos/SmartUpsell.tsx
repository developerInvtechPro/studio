
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUpsellAction } from '@/app/actions';
import type { OrderItem } from '@/lib/types';
import type { SmartUpsellOutput } from '@/ai/flows/smart-upsell';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Sparkles } from 'lucide-react';

interface SmartUpsellProps {
  orderItems: OrderItem[];
}

export default function SmartUpsell({ orderItems }: SmartUpsellProps) {
  const [recommendations, setRecommendations] = useState<SmartUpsellOutput['recommendations']>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderItems.length > 0) {
      setLoading(true);
      const orderData = {
        orderItems: orderItems.map(item => ({
          name: item.product.name,
          category: '', // Category not strictly needed by prompt, can be omitted
          price: item.product.price,
        })),
      };
      getUpsellAction(orderData)
        .then(result => {
          if (result.success && result.data) {
            setRecommendations(result.data.recommendations);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setRecommendations([]);
    }
  }, [orderItems]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <Sparkles className="h-5 w-5 text-secondary" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-4/5" />
          </div>
        ) : recommendations.length > 0 ? (
          <ul className="space-y-2">
            {recommendations.slice(0, 2).map((rec, index) => (
              <li key={index} className="text-sm p-2 rounded-md bg-muted/50 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                <div>
                  <span className="font-semibold">{rec.name}</span> - <span className="text-muted-foreground">{rec.reason}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Add items to see suggestions!</p>
        )}
      </CardContent>
    </Card>
  );
}
