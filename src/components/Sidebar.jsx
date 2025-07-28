import { useState } from "react";
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
import AddExpense from "./AddExpense";

// Enhanced Sidebar Component
export default function Sidebar({ currentView, setCurrentView, setUser, user }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "dashboard" },
    { icon: Users, label: "Groups", path: "groups" },
    { icon: Activity, label: "Activity", path: "activity" },
    { icon: DollarSign, label: "Budget", path: "budget" },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-teal-600 to-teal-700 text-white shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-teal-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-teal-600" />
            </div>
            {!isCollapsed && <h1 className="text-xl font-bold">Splitwise</h1>}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1 hover:bg-teal-500/30 rounded-md transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 hover:bg-teal-500/30 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="p-4">
        <button 
          onClick={() => setShowAddExpense(true)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span>Add expense</span>}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  setCurrentView(item.path);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentView === item.path 
                    ? 'bg-teal-500/40 text-white shadow-md' 
                    : 'text-teal-100 hover:bg-teal-500/20 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-teal-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-teal-400 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-teal-700" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="font-medium text-sm">{user?.name || 'User'}</p>
              <p className="text-teal-200 text-xs">{user?.email || 'user@example.com'}</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => {
              setUser(null);
              localStorage.removeItem('user');
            }}
            className="w-full mt-3 text-teal-200 hover:text-white text-sm py-2 px-3 rounded-lg hover:bg-teal-500/20 transition-colors text-center"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-80'}`}>
        <div className="fixed top-0 left-0 h-full z-30" style={{ width: isCollapsed ? '80px' : '320px' }}>
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="relative w-80 max-w-sm">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-3 bg-teal-600 text-white rounded-lg shadow-lg hover:bg-teal-700 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Add Expense Modal */}
      <AddExpense
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        user={user}
      />
    </>
  );
}