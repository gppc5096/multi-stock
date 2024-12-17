import { Portfolio, TotalInvestment, TickerData } from './types';
import { toast } from '@/components/ui/use-toast';

export const validatePortfolioName = (name: string) => {
  if (!name.trim()) {
    toast({
      title: "오류",
      description: "포트폴리오 이름을 입력해주세요.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

export const validateTickers = (tickers: TickerData[]) => {
  if (tickers.length === 0) {
    toast({
      title: "오류",
      description: "최소 하나의 티커를 추가해주세요.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

export const createPortfolio = (
  name: string,
  totalInvestment: TotalInvestment,
  tickers: TickerData[]
): Portfolio => ({
  id: Date.now().toString(),
  name,
  totalInvestment,
  tickers,
  createdAt: Date.now(),
});

export const exportToJson = (portfolios: Portfolio[]) => {
  const dataStr = JSON.stringify(portfolios, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'portfolios.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast({
    title: "내보내기 완료",
    description: "portfolios.json 파일이 다운로드되었습니다.",
  });
};