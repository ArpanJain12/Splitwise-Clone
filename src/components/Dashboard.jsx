import { useState, useEffect } from "react";
import { 
  Home, 
  Users, 
  Activity, 
  Plus, 
  Bell, 
  Search, 
  Settings,
  User,
  DollarSign,
  TrendingUp,
  Menu,
  X,
  Calendar,
  Receipt,
  ChevronRight
} from "lucide-react";
import api from "../services/api";

export default function Dashboard({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Note: Since we don't have a specific dashboard API, we'll use budget summary
      // In a real implementation, you might want to create a dashboard endpoint
      const summary = await api.budget.getBudgetSummary(user.id);
      setBudgetSummary(summary);
      
      // For expenses, we would need group IDs. For now, showing empty state
      setExpenses([]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses = expenses.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.time?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your expenses and balances</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search expenses..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 font-medium text-sm">You are owed</p>
              <p className="text-3xl font-bold mt-1">₹1,234.56</p>
              <p className="text-green-200 text-sm mt-2">↑ +12.5% from last month</p>
            </div>
            <div className="bg-green-400/30 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-100" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 font-medium text-sm">You owe</p>
              <p className="text-3xl font-bold mt-1">₹567.89</p>
              <p className="text-red-200 text-sm mt-2">↓ -8.2% from last month</p>
            </div>
            <div className="bg-red-400/30 p-3 rounded-lg">
              <DollarSign className="w-8 h-8 text-red-100" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 font-medium text-sm">Total balance</p>
              <p className="text-3xl font-bold mt-1">₹666.67</p>
              <p className="text-blue-200 text-sm mt-2">Net positive balance</p>
            </div>
            <div className="bg-blue-400/30 p-3 rounded-lg">
              <Activity className="w-8 h-8 text-blue-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center space-x-1">
              <span>View all</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredExpenses.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-6 hover:bg-gray-50 transition-colors">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                item.type === 'expense' ? 'bg-orange-100' : 'bg-green-100'
              }`}>
                {item.type === 'expense' ? 
                  <Receipt className="w-6 h-6 text-orange-600" /> :
                  <DollarSign className="w-6 h-6 text-green-600" />
                }
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">Added by {item.user} • {item.time}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{item.amount}</p>
                {item.owed === 'settled' ? (
                  <p className="text-sm text-gray-500">Settled</p>
                ) : (
                  <p className="text-sm text-green-600">You are owed {item.owed}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
