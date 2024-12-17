import { useState, FC, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { Portfolio, TotalInvestment, TickerData } from '@/lib/types';
import { validatePortfolioName, validateTickers, createPortfolio, exportToJson } from '@/lib/portfolio-utils';
import { PortfolioList } from './PortfolioList';
import { PortfolioImportExport } from './PortfolioImportExport';
import { toast } from '@/components/ui/use-toast';
import { FolderOpen } from 'lucide-react';
import { FileSpreadsheet, FileJson, Download, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Props {
  currentPortfolio: {
    totalInvestment: TotalInvestment;
    tickers: TickerData[];
  };
  onReset: () => void;
}

export const PortfolioManager: FC<Props> = ({ currentPortfolio, onReset }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    const savedPortfolios = localStorage.getItem('portfolios');
    return savedPortfolios ? JSON.parse(savedPortfolios) : [];
  });

  useEffect(() => {
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
  }, [portfolios]);

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

  const exportToExcel = () => {
    try {
      // 엑셀로 변환할 데이터 준비
      const excelData = portfolios.map(portfolio => ({
        포트폴리오명: portfolio.name,
        생성일: new Date(portfolio.createdAt).toLocaleDateString(),
        투자금액: portfolio.totalInvestment.amount,
        통화: portfolio.totalInvestment.currency,
        티커목록: portfolio.tickers.map(t => `${t.symbol}(${t.amount})`).join(', ')
      }));

      // 워크북 생성
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // 워크시트를 워크북에 추가
      XLSX.utils.book_append_sheet(wb, ws, "Portfolios");

      // 파일 저장
      XLSX.writeFile(wb, "portfolios.xlsx");

      toast({
        title: "내보내기 완료",
        description: "엑셀 파일이 생성되었습니다.",
      });
    } catch (error) {
      toast({
        title: "오류",
        description: "엑셀 파일 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // 엑셀 데이터를 포트폴리오 형식으로 변환
      const importedPortfolios: Portfolio[] = jsonData.map((row: any) => {
        const tickers = row.티커목록.split(',').map((ticker: string) => {
          const match = ticker.trim().match(/([A-Z0-9]+)\((\d+)\)/);
          if (!match) return null;
          return {
            id: Date.now().toString() + Math.random(),
            symbol: match[1],
            amount: parseInt(match[2]),
            timestamp: Date.now()
          };
        }).filter(Boolean);

        return {
          id: Date.now().toString() + Math.random(),
          name: row.포트폴리오명,
          createdAt: new Date(row.생성일).getTime(),
          updatedAt: Date.now(),
          totalInvestment: {
            amount: row.투자금액,
            currency: row.통화
          },
          tickers
        };
      });

      setPortfolios(importedPortfolios);
      toast({
        title: "가져오기 완료",
        description: "엑셀 파일에서 포트폴리오가 성공적으로 가져와졌습니다.",
      });
    } catch (error) {
      toast({
        title: "오류",
        description: "엑셀 파일 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
    event.target.value = '';
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedPortfolios = JSON.parse(e.target?.result as string);
        setPortfolios(importedPortfolios);
        toast({
          title: "��져오기 완료",
          description: "포트폴리오가 성공적으로 가져와졌습니다.",
        });
      } catch (error) {
        toast({
          title: "오류",
          description: "잘못된 JSON 파일 형식입니다.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <Card className="p-6 border-[1px] border-[#b8b8b8] border-solid rounded-[10px]">
      <h2 className="text-xl font-semibold mb-4">
        <FolderOpen className="inline-block w-6 h-6 mr-2 text-purple-500" />
        포트폴리오 관리
      </h2>
      
      <div className="flex gap-2 mb-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-4 border border-gray-200">
          <h3 className="text-sm font-semibold mb-3 flex items-center">
            <FileSpreadsheet className="h-4 w-4 mr-2 text-green-500" />
            Excel 가져오기/내보내기
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToExcel} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              내보내기
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <label className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                가져오기
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleImportExcel}
                />
              </label>
            </Button>
          </div>
        </Card>

        <Card className="p-4 border border-gray-200">
          <h3 className="text-sm font-semibold mb-3 flex items-center">
            <FileJson className="h-4 w-4 mr-2 text-blue-500" />
            JSON 가져오기/내보내기
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportToJson(portfolios)} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              내보내기
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <label className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                가져오기
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                />
              </label>
            </Button>
          </div>
        </Card>
      </div>

      <PortfolioList
        portfolios={portfolios}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Card>
  );
};