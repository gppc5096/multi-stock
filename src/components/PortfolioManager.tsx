import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { Portfolio, TotalInvestment, TickerData } from '@/lib/types';
import { validatePortfolioName, validateTickers, createPortfolio } from '@/lib/portfolio-utils';
import { PortfolioList } from './PortfolioList';
import { PortfolioImportExport } from './PortfolioImportExport';
import { toast } from '@/components/ui/use-toast';
import { FolderOpen } from 'lucide-react';

interface Props {
  currentPortfolio: {
    totalInvestment: TotalInvestment;
    tickers: TickerData[];
  };
  onReset: () => void;
}

export const PortfolioManager = ({ currentPortfolio, onReset }: Props) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [portfolioName, setPortfolioName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const savePortfolio = () => {
    if (!validatePortfolioName(portfolioName)) return;
    if (!validateTickers(currentPortfolio.tickers)) return;

    const newPortfolio = createPortfolio(
      portfolioName,
      currentPortfolio.totalInvestment,
      currentPortfolio.tickers
    );

    setPortfolios([...portfolios, newPortfolio]);
    setPortfolioName('');
    onReset();

    toast({
      title: "저장 완료",
      description: `${portfolioName} 포트폴리오가 저장되었습니다.`,
    });
  };

  const updatePortfolio = (portfolio: Portfolio) => {
    if (!validatePortfolioName(portfolioName)) return;

    const updatedPortfolio = {
      ...portfolio,
      name: portfolioName,
      totalInvestment: currentPortfolio.totalInvestment,
      tickers: currentPortfolio.tickers,
      updatedAt: Date.now(),
    };

    setPortfolios(portfolios.map(p => 
      p.id === portfolio.id ? updatedPortfolio : p
    ));
    setPortfolioName('');
    setEditingId(null);
    onReset();

    toast({
      title: "수정 완료",
      description: `${portfolioName} 포트폴리오가 수정되었습니다.`,
    });
  };

  const handleEdit = (portfolio: Portfolio) => {
    setEditingId(portfolio.id);
    setPortfolioName(portfolio.name);
    // 수정할 포트폴리오의 데이터를 현재 상태로 설정
    onReset(); // 기존 데이터 초기화
    setTimeout(() => {
      // 포트폴리오의 투자금액과 티커 데이터를 현재 상태로 설정
      const event = new CustomEvent('portfolio-edit', {
        detail: {
          totalInvestment: portfolio.totalInvestment,
          tickers: portfolio.tickers,
        },
      });
      window.dispatchEvent(event);
    }, 0);
  };

  const handleDelete = (id: string) => {
    setPortfolios(portfolios.filter(p => p.id !== id));
    toast({
      title: "삭제 완료",
      description: "포트폴리오가 삭제되었습니다.",
    });
  };

  return (
    <Card className="p-6 border-[1px] border-[#b8b8b8] border-solid rounded-[10px]">
      <h2 className="text-xl font-semibold mb-4">
        <FolderOpen className="inline-block w-6 h-6 mr-2 text-purple-500" />
        포트폴리오 관리
      </h2>
      
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="포트폴리오 이름"
          value={portfolioName}
          onChange={(e) => setPortfolioName(e.target.value)}
        />
        <Button onClick={editingId ? () => {
          const portfolio = portfolios.find(p => p.id === editingId);
          if (portfolio) updatePortfolio(portfolio);
        } : savePortfolio}>
          <Save className="h-4 w-4 mr-2" />
          {editingId ? '수정' : '저장'}
        </Button>
      </div>

      <PortfolioImportExport 
        portfolios={portfolios}
        onImport={setPortfolios}
      />

      <PortfolioList
        portfolios={portfolios}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Card>
  );
};