import React from 'react';
import { Star, Users, TrendingUp, MessageSquare, Search, Filter } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { ReviewCard } from '../components/ReviewCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const ratingData = [
  { name: '5 Stars', count: 85 },
  { name: '4 Stars', count: 32 },
  { name: '3 Stars', count: 8 },
  { name: '2 Stars', count: 2 },
  { name: '1 Star', count: 1 },
];

const categoryData = [
  { name: 'Service Quality', value: 45, color: '#00FFEF' },
  { name: 'Communication', value: 25, color: '#22C55E' },
  { name: 'Results', value: 20, color: '#8B5CF6' },
  { name: 'Pricing', value: 10, color: '#F97316' },
];

const reviews = [
  {
    company: 'TechFlow Solutions',
    date: 'Dec 12, 2024',
    rating: 5,
    text: 'The marketing strategy provided by Ascendly exceeded our expectations. Our conversion rate increased by 40% in just two months.',
    category: 'Results',
  },
  {
    company: 'GreenScape Garden',
    date: 'Dec 10, 2024',
    rating: 4,
    text: 'Great communication throughout the campaign. The team is very responsive and professional.',
    category: 'Communication',
  },
  {
    company: 'Urban Eat Co.',
    date: 'Dec 08, 2024',
    rating: 5,
    text: 'Outstanding service quality. They really took the time to understand our brand voice.',
    category: 'Service Quality',
  },
];

export default function FeedbackPage() {
  return (
    <div className="space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Average Rating" value="4.8" icon={Star} trend="+0.2" />
        <MetricCard label="Total Reviews" value="128" icon={MessageSquare} trend="+12" />
        <MetricCard label="Satisfaction Rate" value="96%" icon={Users} trend="+2%" />
        <MetricCard label="Growth" value="+12%" icon={TrendingUp} trend="+3%" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card-dark p-6 rounded-2xl border border-border-subtle">
          <h3 className="text-lg font-semibold mb-8">Rating Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ 
                    backgroundColor: '#111827', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#00FFEF" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card-dark p-6 rounded-2xl border border-border-subtle">
          <h3 className="text-lg font-semibold mb-8">Feedback Categories</h3>
          <div className="h-[300px]">
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111827', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-text">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-semibold">Recent Reviews</h3>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
              <input 
                type="text" 
                placeholder="Search reviews..." 
                className="w-full pl-10 pr-4 py-2 bg-card-dark border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <button className="p-2 bg-card-dark border border-border-subtle rounded-xl hover:border-accent transition-colors">
              <Filter className="w-5 h-5 text-muted-text" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {reviews.map((review, i) => (
            <ReviewCard key={i} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
}
