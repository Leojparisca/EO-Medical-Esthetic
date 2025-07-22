
'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { loyaltyData } from '@/lib/constants';
import { useEffect, useState } from 'react';

interface LoyaltyCardProps {
  points: number;
}

export function LoyaltyCard({ points }: LoyaltyCardProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const progressPercentage =
    (points / loyaltyData.nextRewardTier) * 100;
  
  const pointsNeeded = Math.max(0, loyaltyData.nextRewardTier - points);

  return (
    <Card className="bg-card shadow-lg rounded-2xl">
      <CardContent className="p-4">
        <Link href="/loyalty" className="block">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">Club de Lealtad</p>
            <div className="flex items-center gap-1 text-primary">
              <Star className="w-4 h-4" />
              <span className="font-bold">
                {isClient ? points.toLocaleString('es-ES') : '...'}
              </span>
            </div>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2 [&>div]:bg-gradient-gold"
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Te faltan {isClient ? pointsNeeded.toLocaleString('es-ES') : '...'} puntos
            para tu próxima recompensa.
          </p>
        </Link>
      </CardContent>
    </Card>
  );
}
