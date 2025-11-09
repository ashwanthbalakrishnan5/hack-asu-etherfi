'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Lightbulb } from 'lucide-react';

interface AnalyticsData {
  timeSeries: Array<{
    date: string;
    principal: number;
    yc: number;
  }>;
  allocation: {
    yes: number;
    no: number;
  };
  summary: {
    totalSpent: number;
    totalWon: number;
    netChange: number;
  };
  insights: string[];
}

interface PortfolioAnalyticsProps {
  address: string;
}

export function PortfolioAnalytics({ address }: PortfolioAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [address]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/${address}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-surface rounded" />
          <div className="h-64 bg-surface rounded" />
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <p className="text-center text-foreground/70">
          No analytics data available yet. Start placing bets to see your portfolio analytics!
        </p>
      </Card>
    );
  }

  const allocationData = [
    { name: 'YES Bets', value: data.allocation.yes, color: '#10b981' },
    { name: 'NO Bets', value: data.allocation.no, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-foreground">
            Portfolio Analytics
          </h3>
        </div>

        {/* Time Series Chart */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-foreground/70 mb-4">
            Principal vs YC Over Time
          </h4>
          {data.timeSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
                />
                <Line
                  type="monotone"
                  dataKey="principal"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  name="Principal (weETH)"
                  dot={{ fill: '#00d4ff', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="yc"
                  stroke="#c4b5fd"
                  strokeWidth={2}
                  name="Yield Credits (YC)"
                  dot={{ fill: '#c4b5fd', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-foreground/50">
              No time series data available yet
            </div>
          )}
        </div>

        {/* Allocation Chart */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground/70">
                YC Allocation (YES vs NO)
              </h4>
            </div>
            {data.allocation.yes + data.allocation.no > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-foreground/50">
                No allocation data yet
              </div>
            )}
          </div>

          {/* Outcomes Summary */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground/70">
                Outcomes Summary
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface/30">
                <span className="text-sm text-foreground/70">Total Spent</span>
                <span className="text-lg font-bold text-foreground">
                  {data.summary.totalSpent.toFixed(2)} YC
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface/30">
                <span className="text-sm text-foreground/70">Total Won</span>
                <span className="text-lg font-bold text-green-400">
                  {data.summary.totalWon.toFixed(2)} YC
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface/30">
                <span className="text-sm text-foreground/70">Net Change</span>
                <span
                  className={`text-lg font-bold ${
                    data.summary.netChange >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {data.summary.netChange >= 0 ? '+' : ''}
                  {data.summary.netChange.toFixed(2)} YC
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Insights */}
      {data.insights && data.insights.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-claude" />
            <h4 className="text-lg font-semibold text-foreground">
              AI Insights
            </h4>
          </div>
          <div className="space-y-3">
            {data.insights.map((insight, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-claude-bg/20 border border-claude/30"
              >
                <p className="text-sm text-foreground/90">{insight}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-foreground/50">
            * These are educational insights, not financial advice
          </p>
        </Card>
      )}
    </div>
  );
}
