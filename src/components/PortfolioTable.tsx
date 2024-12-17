import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TickerData, Currency } from '@/lib/types';
import { useState } from 'react';
import { Table as TableIcon } from 'lucide-react';

interface Props {
  tickers: TickerData[];
  currency: Currency;
  onEdit?: (ticker: TickerData) => void;
  onDelete?: (ticker: TickerData) => void;
}

export const PortfolioTable = ({ tickers, currency, onEdit, onDelete }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<{ symbol: string; amount: number }>({ symbol: '', amount: 0 });
  const totalAmount = tickers.reduce((sum, ticker) => sum + ticker.amount, 0);

  const handleEditStart = (ticker: TickerData) => {
    setEditingId(ticker.id);
    setEditValue({ symbol: ticker.symbol, amount: ticker.amount });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue({ symbol: '', amount: 0 });
  };

  const handleEditSave = (ticker: TickerData) => {
    if (onEdit) {
      onEdit({
        ...ticker,
        symbol: editValue.symbol.toUpperCase(),
        amount: editValue.amount,
      });
    }
    setEditingId(null);
  };

  const formatNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <Card className="p-6 border-[1px] border-[#b8b8b8] border-solid rounded-[10px]">
      <h2 className="text-xl font-semibold mb-4">
        <TableIcon className="inline-block w-6 h-6 mr-2 text-green-500" />
        포트폴리오 현황
      </h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>티커</TableHead>
              <TableHead>투자금액</TableHead>
              <TableHead>비중</TableHead>
              <TableHead>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickers.map((ticker) => (
              <TableRow key={ticker.id}>
                <TableCell className="font-medium">
                  {editingId === ticker.id ? (
                    <Input
                      value={editValue.symbol}
                      onChange={(e) => setEditValue({ ...editValue, symbol: e.target.value.toUpperCase() })}
                      className="w-24"
                    />
                  ) : (
                    ticker.symbol
                  )}
                </TableCell>
                <TableCell>
                  {editingId === ticker.id ? (
                    <Input
                      value={editValue.amount.toLocaleString()}
                      onChange={(e) => {
                        const value = formatNumber(e.target.value);
                        setEditValue({ 
                          ...editValue, 
                          amount: parseInt(value.replace(/,/g, '')) || 0 
                        });
                      }}
                      className="w-32"
                    />
                  ) : (
                    `${currency === 'KRW' ? '₩' : '$'}${ticker.amount.toLocaleString()}`
                  )}
                </TableCell>
                <TableCell>
                  {((ticker.amount / totalAmount) * 100).toFixed(2)}%
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {editingId === ticker.id ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSave(ticker)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStart(ticker)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete?.(ticker)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};