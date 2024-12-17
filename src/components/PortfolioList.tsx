import { Portfolio } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface Props {
  portfolios: Portfolio[];
  onEdit: (portfolio: Portfolio) => void;
  onDelete: (id: string) => void;
}

export const PortfolioList = ({ portfolios, onEdit, onDelete }: Props) => {
  return (
    <div className="space-y-4">
      {portfolios.map((portfolio) => (
        <div
          key={portfolio.id}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-md"
        >
          <div>
            <h3 className="font-medium">{portfolio.name}</h3>
            <p className="text-sm text-gray-500">
              {new Date(portfolio.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(portfolio)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(portfolio.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};