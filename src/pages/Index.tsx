import { useState, useEffect } from 'react';
import { TotalInvestment, TickerData, Currency } from '@/lib/types';
import { TotalInvestmentComponent } from '@/components/TotalInvestment';
import { TickerInput } from '@/components/TickerInput';
import { PortfolioTable } from '@/components/PortfolioTable';
import { PortfolioChart } from '@/components/PortfolioChart';
import { PortfolioManager } from '@/components/PortfolioManager';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [totalInvestment, setTotalInvestment] = useState<TotalInvestment>(() => {
    const saved = localStorage.getItem('totalInvestment');
    return saved ? JSON.parse(saved) : {
      amount: 0,
      currency: 'KRW'
    };
  });

  const [tickers, setTickers] = useState<TickerData[]>(() => {
    const saved = localStorage.getItem('tickers');
    return saved ? JSON.parse(saved) : [];
  });

  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('totalInvestment', JSON.stringify(totalInvestment));
  }, [totalInvestment]);

  useEffect(() => {
    localStorage.setItem('tickers', JSON.stringify(tickers));
  }, [tickers]);

  // 포트폴리오 수정 이벤트 리스너 추가
  useEffect(() => {
    const handlePortfolioEdit = (event: CustomEvent) => {
      const { totalInvestment: newTotalInvestment, tickers: newTickers } = event.detail;
      setTotalInvestment(newTotalInvestment);
      setTickers(newTickers);
    };

    window.addEventListener('portfolio-edit' as any, handlePortfolioEdit);

    return () => {
      window.removeEventListener('portfolio-edit' as any, handlePortfolioEdit);
    };
  }, []);

  const handleEdit = (updatedTicker: TickerData) => {
    setTickers(tickers.map(ticker => 
      ticker.id === updatedTicker.id ? updatedTicker : ticker
    ));
    toast({
      title: "수정 완료",
      description: `${updatedTicker.symbol} 티커가 수정되었습니다.`,
    });
  };

  const handleDelete = (ticker: TickerData) => {
    setTickers(tickers.filter(t => t.id !== ticker.id));
    toast({
      title: "삭제 완료",
      description: `${ticker.symbol} 티커가 삭제되었습니다.`,
    });
  };

  const handleReset = () => {
    setTotalInvestment({
      amount: 0,
      currency: 'KRW'
    });
    setTickers([]);
    localStorage.removeItem('totalInvestment');
    localStorage.removeItem('tickers');
    toast({
      title: "초기화 완료",
      description: "모든 데이터가 초기화되었습니다.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-12">
          주식 포트폴리오 관리
        </h1>

        {/* 상단 영역: 총 투자금액 설정 & 티커 추가 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TotalInvestmentComponent
            value={totalInvestment}
            onChange={setTotalInvestment}
            onReset={handleReset}
          />
          <TickerInput
            totalInvestment={totalInvestment}
            tickers={tickers}
            onAddTicker={(ticker) => setTickers([...tickers, ticker])}
          />
        </div>

        {/* 중앙 영역: 포트폴리오 현황 */}
        <div className="mb-6">
          <PortfolioTable 
            tickers={tickers} 
            currency={totalInvestment.currency}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* 하단 영역: 포트폴리오 비중 & 포트폴리오 관리 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PortfolioChart
            totalInvestment={totalInvestment}
            tickers={tickers}
          />
          <PortfolioManager
            currentPortfolio={{ totalInvestment, tickers }}
            onReset={handleReset}
          />
        </div>
      </div>

      {/* Footer 추가 */}
      <footer className="bg-[#0942bd] text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 All Rights Reserved. Made by 나종춘</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;