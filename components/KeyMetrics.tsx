import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from './Icons';

interface MetricCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  isGoodTrend: boolean; // True if 'up' is good, false if 'down' is good
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, isGoodTrend }) => {
  const trendColor = trend === 'stable' ? 'text-gray-500' : 
    (trend === 'up' && isGoodTrend) || (trend === 'down' && !isGoodTrend) ? 'text-green-500' : 'text-red-500';
  
  const TrendIcon = trend === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

  return (
    <div className="bg-brand-secondary p-4 rounded-lg shadow-md flex-1">
      <p className="text-sm font-medium text-brand-light">{title}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-3xl font-bold text-brand-text">{value}</p>
        {trend !== 'stable' && <TrendIcon className={`w-5 h-5 ${trendColor}`} />}
      </div>
    </div>
  );
};

const KeyMetrics: React.FC = () => {
  // Mock data for display
  // FIX: Explicitly type the metrics array to ensure the 'trend' property matches the expected union type in MetricCardProps.
  const metrics: MetricCardProps[] = [
    { title: 'P95 Latency', value: '180ms', trend: 'up', isGoodTrend: false },
    { title: 'Error Rate', value: '0.05%', trend: 'down', isGoodTrend: true },
    { title: 'Transactions/Sec', value: '1.2k', trend: 'up', isGoodTrend: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map(metric => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
};

export default KeyMetrics;