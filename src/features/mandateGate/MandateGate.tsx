import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface MandateGateProps {
  actor: string;
  leverage: string;
  mandate: string;
  onMandateCheck: (actor: string, leverage: string) => Promise<string>;
}

export const MandateGate: React.FC<MandateGateProps> = ({
  actor,
  leverage,
  mandate,
  onMandateCheck
}) => {
  const [isChecking, setIsChecking] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  const handleCheck = async () => {
    setIsChecking(true);
    try {
      const mandateResult = await onMandateCheck(actor, leverage);
      setResult(mandateResult);
    } catch (error) {
      console.error('Mandate check failed:', error);
      setResult('error');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'allowed': return 'text-green-600 bg-green-50 border-green-200';
      case 'restricted': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'forbidden': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Mandate Gate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Actor</label>
              <p className="text-sm text-gray-900">{actor}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Leverage</label>
              <p className="text-sm text-gray-900">{leverage}</p>
            </div>
          </div>
          
          {result && (
            <div className={`p-3 rounded-md border ${getStatusColor(result)}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">{result}</span>
                <Badge variant={result === 'allowed' ? 'default' : 'secondary'}>
                  {result}
                </Badge>
              </div>
            </div>
          )}

          <Button 
            onClick={handleCheck}
            disabled={isChecking}
            className="w-full"
          >
            {isChecking ? 'Checking...' : 'Check Mandate'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};