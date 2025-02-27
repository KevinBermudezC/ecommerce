import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface StatCard {
  title: string;
  value: string;
  percentage: number;
  trend: 'up' | 'down';
}

interface SalesData {
  month: string;
  sales: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface TopProduct {
  name: string;
  sales: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const mockSalesData: SalesData[] = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 2780 },
  { month: 'May', sales: 1890 },
  { month: 'Jun', sales: 2390 },
];

const mockCategoryData: CategoryData[] = [
  { name: 'Shoes', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Accessories', value: 300 },
  { name: 'Electronics', value: 200 },
];

const mockTopProducts: TopProduct[] = [
  { name: 'Classic Sneakers', sales: 120 },
  { name: 'Running Shoes', sales: 98 },
  { name: 'Sport T-Shirt', sales: 86 },
  { name: 'Smart Watch', sales: 75 },
  { name: 'Wireless Earbuds', sales: 65 },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');

  const stats: StatCard[] = [
    {
      title: 'Total Sales',
      value: '$12,345',
      percentage: 12.5,
      trend: 'up'
    },
    {
      title: 'Total Orders',
      value: '123',
      percentage: 5.2,
      trend: 'up'
    },
    {
      title: 'Total Products',
      value: '45',
      percentage: -2.1,
      trend: 'down'
    },
    {
      title: 'Active Customers',
      value: '892',
      percentage: 8.9,
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === 'today'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === 'week'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === 'month'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  stat.trend === 'up'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {stat.trend === 'up' ? '↑' : '↓'} {Math.abs(stat.percentage)}%
              </span>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Sales Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
        <div className="w-full">
          <LineChart
            width={800}
            height={300}
            data={mockSalesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>
          <div className="w-full flex items-center justify-center">
            <PieChart width={400} height={300}>
              <Pie
                data={mockCategoryData}
                cx={200}
                cy={150}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {mockCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Top Products</h2>
          <div className="w-full flex items-center justify-center">
            <BarChart
              width={400}
              height={300}
              data={mockTopProducts}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8">
                {mockTopProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
}