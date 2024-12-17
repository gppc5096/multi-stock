import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TotalInvestment, TickerData } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';

interface Props {
  totalInvestment: TotalInvestment;
  tickers: TickerData[];
  onAddTicker: (ticker: TickerData) => void;
}

export const TickerInput = ({ totalInvestment, tickers, onAddTicker }: Props) => {
  const [symbol, setSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const { toast } = useToast();
  const symbolInputRef = useRef<HTMLInputElement>(null);

  const formatNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumber(e.target.value);
    setAmount(formattedValue);
  };

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 한글, 숫자만 허용하고 영문은 대문자로 변환
    const filteredValue = value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣0-9a-zA-Z]/g, '').toUpperCase();
    setSymbol(filteredValue);
  };

  const getTotalInvested = () => tickers.reduce((sum, t) => sum + t.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/,/g, ''));

    if (!symbol || isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "오류",
        description: "올바른 심볼과 투자금액을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    const totalInvested = getTotalInvested() + numAmount;
    if (totalInvested > totalInvestment.amount) {
      toast({
        title: "오류",
        description: "총 투자금액을 초과할 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    onAddTicker({
      id: Date.now().toString(),
      symbol: symbol.toUpperCase(),
      amount: numAmount,
      timestamp: Date.now(),
    });

    setSymbol('');
    setAmount('');
    symbolInputRef.current?.focus();

    toast({
      title: "저장 완료",
      description: `${symbol.toUpperCase()} 티커가 추가되었습니다.`,
    });
  };

  const remaining = totalInvestment.amount - getTotalInvested();

  return (
    <Card className="p-6 border-[1px] border-[#b8b8b8] border-solid rounded-[10px]">
      <h2 className="text-xl font-semibold mb-4">
        <Plus className="inline-block w-6 h-6 mr-2 text-orange-500" />
        티커 추가
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="티커 심볼 (예: AAPL)"
          value={symbol}
          onChange={handleSymbolChange}
          ref={symbolInputRef}
        />
        <Input
          type="text"
          placeholder="투자금액"
          value={amount}
          onChange={handleAmountChange}
        />
        <Button type="submit" className="w-full">
          추가
        </Button>
      </form>

      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
        <p className="text-lg font-medium">
          남은 투자금액: {totalInvestment.currency === 'KRW' ? '₩' : '$'}
          {remaining.toLocaleString()}
        </p>
      </div>
    </Card>
  );
};