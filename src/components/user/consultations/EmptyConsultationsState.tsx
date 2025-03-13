
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileClock } from 'lucide-react';

const EmptyConsultationsState: React.FC = () => {
  return (
    <Card className="p-6 text-center">
      <div className="py-10 space-y-4">
        <div className="flex justify-center">
          <FileClock className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">Keine Beratungen gefunden</h3>
        <p className="text-muted-foreground">
          Sie haben noch keine Beratungen angefordert.
        </p>
        <Button>Beratung anfordern</Button>
      </div>
    </Card>
  );
};

export default EmptyConsultationsState;
