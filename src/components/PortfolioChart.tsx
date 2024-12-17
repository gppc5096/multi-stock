import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TotalInvestment, TickerData } from '@/lib/types';
import { PieChart as PieChartIcon } from 'lucide-react';

interface Props {
  totalInvestment: TotalInvestment;
  tickers: TickerData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const PortfolioChart = ({ totalInvestment, tickers }: Props) => {
  const totalInvested = tickers.reduce((sum, t) => sum + t.amount, 0);
  const remaining = totalInvestment.amount - totalInvested;

  const data = [
    ...tickers.map(t => ({
      name: t.symbol,
      value: t.amount
    })),
    {
      name: '미투자',
      value: remaining
    }
  ];

  return (
    <Card className="p-6 border-[1px] border-[#b8b8b8] border-solid rounded-[10px]">
      <h2 className="text-xl font-semibold mb-4">
        <PieChartIcon className="inline-block w-6 h-6 mr-2 text-blue-500" />
        포트폴리오 비중
      </h2>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => 
                `${totalInvestment.currency === 'KRW' ? '₩' : '$'}${value.toLocaleString()}`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};