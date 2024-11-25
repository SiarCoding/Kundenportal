import React from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { Users, DollarSign, MousePointer, Eye } from 'lucide-react';

// Test data for different chart types
const lineData = [
  { name: 'Mo', value: 150 },
  { name: 'Di', value: 230 },
  { name: 'Mi', value: 180 },
  { name: 'Do', value: 290 },
  { name: 'Fr', value: 200 },
  { name: 'Sa', value: 140 },
  { name: 'So', value: 120 },
];

const pieData = [
  { name: 'Facebook', value: 40 },
  { name: 'Google', value: 30 },
  { name: 'Instagram', value: 20 },
  { name: 'Other', value: 10 },
];

const COLORS = ['#EAB308', '#374151', '#4B5563', '#6B7280'];

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  chartType: 'line' | 'area' | 'pie';
  data: any[];
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, chartType, data }) => {
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF" 
                axisLine={false}
                tickLine={false}
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF" 
                axisLine={false}
                tickLine={false}
                fontSize={12}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#374151',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#EAB308" 
                strokeWidth={2}
                dot={{ fill: '#EAB308', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#EAB308' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF" 
                axisLine={false}
                tickLine={false}
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF" 
                axisLine={false}
                tickLine={false}
                fontSize={12}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#374151',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#EAB308"
                fill="#EAB308"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#374151',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#25262b] rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold text-yellow-400 mt-1">{value}</p>
        </div>
        <div className="p-3 bg-gray-700/50 rounded-xl">
          {icon}
        </div>
      </div>
      <div className="h-40">
        {renderChart()}
      </div>
    </div>
  );
};

interface PerformanceMetricsProps {
  timeframe: string;
}

export default function PerformanceMetrics({ timeframe }: PerformanceMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <MetricCard
        title="Leads"
        value="243,242"
        icon={<Users className="h-6 w-6 text-yellow-400" />}
        chartType="line"
        data={lineData}
      />
      <MetricCard
        title="Werbekosten"
        value="5,000 €"
        icon={<DollarSign className="h-6 w-6 text-yellow-400" />}
        chartType="area"
        data={lineData}
      />
      <MetricCard
        title="Klicks"
        value="1,233"
        icon={<MousePointer className="h-6 w-6 text-yellow-400" />}
        chartType="line"
        data={lineData}
      />
      <MetricCard
        title="Impressionen"
        value="123,123"
        icon={<Eye className="h-6 w-6 text-yellow-400" />}
        chartType="pie"
        data={pieData}
      />
    </div>
  );
}