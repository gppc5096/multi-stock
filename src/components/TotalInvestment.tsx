import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TotalInvestment, Currency } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { Wallet } from 'lucide-react';

interface Props {
  value: TotalInvestment;
  onChange: (value: TotalInvestment) => void;
  onReset: () => void;
}

export const TotalInvestmentComponent = ({ value, onChange, onReset }: Props) => {
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const formatNumber = (value: string) => {
    // Remove non-numeric characters
    const number = value.replace(/[^\d]/g, '');
    // Format with thousand separators
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumber(e.target.value);
    setAmount(formattedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "오류",
        description: "올바른 투자금액을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    onChange({
      amount: numAmount,
      currency: value.currency,
    });

    toast({
      title: "저장 완료",
      description: `총 투자금액이 ${value.currency === 'KRW' ? '₩' : '$'}${numAmount.toLocaleString()}로 설정되었습니다.`,
    });
  };

  const handleReset = () => {
    setAmount('');
    onReset();
  };

  return (
    <Card className="p-6 border-[1px] border-[#b8b8b8] border-solid rounded-[10px]">
      <h2 className="text-xl font-semibold mb-4">
        <Wallet className="inline-block w-6 h-6 mr-2 text-rose-500" />
        총 투자금액 설정
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2">
          <select
            className="px-3 py-2 border rounded-md"
            value={value.currency}
            onChange={(e) => onChange({ ...value, currency: e.target.value as Currency })}
          >
            <option value="KRW">KRW</option>
            <option value="USD">USD</option>
          </select>
          <Input
            type="text"
            placeholder="투자금액 입력"
            value={amount}
            onChange={handleAmountChange}
            className="flex-1"
          />
        </div>
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">
            저장
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            className="flex-1"
          >
            초기화
          </Button>
        </div>
      </form>
      
      {value.amount > 0 && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <p className="text-lg font-medium">
            현재 총 투자금액: {value.currency === 'KRW' ? '₩' : '$'}
            {value.amount.toLocaleString()}
          </p>
        </div>
      )}
    </Card>
  );
};