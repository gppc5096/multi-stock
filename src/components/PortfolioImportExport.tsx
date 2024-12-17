import { Portfolio } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { exportToJson } from '@/lib/portfolio-utils';
import { toast } from '@/components/ui/use-toast';

interface Props {
  portfolios: Portfolio[];
  onImport: (portfolios: Portfolio[]) => void;
}

export const PortfolioImportExport = ({ portfolios, onImport }: Props) => {
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
          description: "잘못된 파일 형식입니다.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button variant="outline" onClick={() => exportToJson(portfolios)}>
        <Download className="h-4 w-4 mr-2" />
        내보내기
      </Button>
      <Button variant="outline" asChild>
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
  );
};