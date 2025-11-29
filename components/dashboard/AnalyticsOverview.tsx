import { AnalyticsData } from '@/lib/types';

interface AnalyticsOverviewProps {
  analytics: AnalyticsData;
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  );
}

export default function AnalyticsOverview({ analytics }: AnalyticsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Avg Engagement Rate"
        value={`${analytics.avgEngagementRate.toFixed(2)}%`}
        icon="📈"
      />
      <StatCard
        label="Total Likes"
        value={analytics.totalLikes.toLocaleString()}
        icon="❤️"
      />
      <StatCard
        label="Total Comments"
        value={analytics.totalComments.toLocaleString()}
        icon="💬"
      />
      <StatCard
        label="Best Type"
        value={analytics.bestPerformingType}
        icon="🏆"
      />
    </div>
  );
}
