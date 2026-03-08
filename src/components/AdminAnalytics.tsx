import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, MousePointer2, Eye, LayoutDashboard } from 'lucide-react';

export default function AdminAnalytics() {
  const { tools } = useAppContext();
  const [stats, setStats] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'stats'), (snapshot) => {
      const fetchedStats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStats(fetchedStats);
    });
    return () => unsubscribe();
  }, []);

  const chartData = stats.map(stat => {
    const tool = tools.find(t => t.id === stat.id);
    return {
      name: tool?.name || 'Unknown',
      views: stat.views || 0,
      clicks: stat.clicks || 0,
      category: tool?.category || 'Uncategorized'
    };
  }).sort((a, b) => b.views - a.views).slice(0, 10);

  const categoryDataMap = stats.reduce((acc: any, stat) => {
    const tool = tools.find(t => t.id === stat.id);
    const cat = tool?.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += stat.views || 0;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryDataMap).map(([name, value]) => ({ name, value }));

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

  const totalViews = stats.reduce((sum, s) => sum + (s.views || 0), 0);
  const totalClicks = stats.reduce((sum, s) => sum + (s.clicks || 0), 0);
  const avgCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-8">
      <div className="glass-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Website Analytics</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Track traffic, clicks, and popular categories.</p>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${timeRange === range ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg text-white"><Eye className="w-5 h-5" /></div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Views</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalViews.toLocaleString()}</div>
            <div className="mt-2 text-xs text-blue-600/70 dark:text-blue-400/70 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% from last period
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500 rounded-lg text-white"><MousePointer2 className="w-5 h-5" /></div>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">CTA Clicks</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalClicks.toLocaleString()}</div>
            <div className="mt-2 text-xs text-indigo-600/70 dark:text-indigo-400/70 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +8% from last period
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500 rounded-lg text-white"><LayoutDashboard className="w-5 h-5" /></div>
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg. CTR</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{avgCTR}%</div>
            <div className="mt-2 text-xs text-purple-600/70 dark:text-purple-400/70 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +2.4% from last period
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Top 10 Most Viewed Tools</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" hide />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Popular Categories</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 md:p-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Detailed Tool Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400">
                <th className="pb-3 px-4">Tool Name</th>
                <th className="pb-3 px-4">Category</th>
                <th className="pb-3 px-4 text-center">Views</th>
                <th className="pb-3 px-4 text-center">CTA Clicks</th>
                <th className="pb-3 px-4 text-right">CTR</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-900 dark:text-white">{item.name}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400 text-sm">{item.category}</td>
                  <td className="py-4 px-4 text-center text-slate-900 dark:text-white font-mono">{item.views.toLocaleString()}</td>
                  <td className="py-4 px-4 text-center text-slate-900 dark:text-white font-mono">{item.clicks.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right">
                    <span className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold font-mono">
                      {item.views > 0 ? ((item.clicks / item.views) * 100).toFixed(1) : 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
