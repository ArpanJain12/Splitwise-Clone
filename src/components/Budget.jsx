import { useState, useEffect } from "react";
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Calendar,
  Trash2,
  Edit
} from "lucide-react";
import api from "../services/api";

export default function Budget({ user }) {
  const [budgets, setBudgets] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [exceededBudgets, setExceededBudgets] = useState([]);
  const [nearingLimitBudgets, setNearingLimitBudgets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [newBudget, setNewBudget] = useState({
    category: "",
    budgetLimit: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    if (user?.id) {
      fetchBudgetData();
    }
  }, [user]);

  const fetchBudgetData = async () => {
    setLoading(true);
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      // Fetch all budget-related data
      const [budgetsRes, summaryRes, exceededRes, nearingRes] = await Promise.all([
        api.budget.getUserBudgets(user.id, currentMonth, currentYear),
        api.budget.getBudgetSummary(user.id, currentMonth, currentYear),
        api.budget.getExceededBudgets(user.id, currentMonth, currentYear),
        api.budget.getNearingLimitBudgets(user.id, currentMonth, currentYear)
      ]);

      setBudgets(budgetsRes);
      setBudgetSummary(summaryRes);
      setExceededBudgets(exceededRes);
      setNearingLimitBudgets(nearingRes);
    } catch (error) {
      console.error("Error fetching budget data:", error);
      setError("Failed to load budget data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async () => {
    if (!newBudget.category || !newBudget.budgetLimit) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const budgetData = {
        userId: user.id,
        category: newBudget.category,
        budgetLimit: parseFloat(newBudget.budgetLimit),
        month: newBudget.month,
        year: newBudget.year
      };

      await api.budget.createOrUpdateBudget(budgetData);
      await fetchBudgetData(); // Refresh data
      
      setShowModal(false);
      setNewBudget({
        category: "",
        budgetLimit: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
      setError("");
    } catch (error) {
      console.error("Error creating budget:", error);
      setError(error.message || "Failed to create budget");
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      await api.budget.deleteBudget(budgetId);
      await fetchBudgetData(); // Refresh data
    } catch (error) {
      console.error("Error deleting budget:", error);
      setError("Failed to delete budget");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getProgressColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-orange-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading budget data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your spending budgets</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Budget</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Budget Summary Cards */}
      {budgetSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(budgetSummary.totalBudget || 0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(budgetSummary.totalSpent || 0)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency((budgetSummary.totalBudget || 0) - (budgetSummary.totalSpent || 0))}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Alerts for exceeded and nearing budgets */}
      {(exceededBudgets.length > 0 || nearingLimitBudgets.length > 0) && (
        <div className="space-y-4">
          {exceededBudgets.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-red-800">Exceeded Budgets</h3>
              </div>
              <div className="space-y-2">
                {exceededBudgets.map((budget) => (
                  <div key={budget.id} className="text-sm text-red-700">
                    {budget.category}: {formatCurrency(budget.currentSpent)} / {formatCurrency(budget.budgetLimit)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {nearingLimitBudgets.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-orange-800">Nearing Budget Limit</h3>
              </div>
              <div className="space-y-2">
                {nearingLimitBudgets.map((budget) => (
                  <div key={budget.id} className="text-sm text-orange-700">
                    {budget.category}: {formatCurrency(budget.currentSpent)} / {formatCurrency(budget.budgetLimit)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Budget List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Your Budgets</h2>
        </div>
        <div className="p-6">
          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No budgets created yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
              >
                Create your first budget
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget) => (
                <div key={budget.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                      <p className="text-sm text-gray-600">
                        {budget.month}/{budget.year}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spent: {formatCurrency(budget.currentSpent || 0)}</span>
                      <span>Budget: {formatCurrency(budget.budgetLimit)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(budget.currentSpent || 0, budget.budgetLimit)}`}
                        style={{
                          width: `${Math.min(((budget.currentSpent || 0) / budget.budgetLimit) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {(((budget.currentSpent || 0) / budget.budgetLimit) * 100).toFixed(1)}% used
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Budget Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Create New Budget</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  placeholder="e.g., Food, Transportation, Entertainment"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Limit (₹)
                </label>
                <input
                  type="number"
                  value={newBudget.budgetLimit}
                  onChange={(e) => setNewBudget({ ...newBudget, budgetLimit: e.target.value })}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <select
                    value={newBudget.month}
                    onChange={(e) => setNewBudget({ ...newBudget, month: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2024, i, 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    value={newBudget.year}
                    onChange={(e) => setNewBudget({ ...newBudget, year: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowModal(false);
                  setError('');
                  setNewBudget({
                    category: "",
                    budgetLimit: "",
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear()
                  });
                }} 
                className="text-sm text-gray-500 hover:underline"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateBudget} 
                className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700"
              >
                Create Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}