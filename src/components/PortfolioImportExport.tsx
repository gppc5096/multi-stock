import { Portfolio } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { exportToJson } from '@/lib/portfolio-utils';
import { toast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';

interface Props {
  portfolios: Portfolio[];
  onImport: (portfolios: Portfolio[]) => void;
}

export const PortfolioImportExport = ({ portfolios, onImport }: Props) => {
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

      onImport(importedPortfolios);
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
        onImport(importedPortfolios);
        toast({
          title: "가져오기 완료",
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
    <div className="flex gap-2 mb-4">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => exportToJson(portfolios)}>
          <Download className="h-4 w-4 mr-2" />
          JSON 내보내기
        </Button>
        <Button variant="outline" onClick={exportToExcel}>
          <Download className="h-4 w-4 mr-2" />
          Excel 내보내기
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <label className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            JSON 가져오기
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </Button>
        <Button variant="outline" asChild>
          <label className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Excel 가져오기
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleImportExcel}
            />
          </label>
        </Button>
      </div>
    </div>
  );
};