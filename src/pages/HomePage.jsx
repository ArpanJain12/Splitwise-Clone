import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard.jsx";
import Groups from "../components/Groups";
import Activity from "../components/Activity";
import Budget from "../components/Budget";

export default function HomePage({ user, setUser }) {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'groups':
        return <Groups user={user} />;
      case 'activity':
        return <Activity user={user} />;
      case 'budget':
        return <Budget user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} setUser={setUser} user={user} />
      
      <main className="lg:ml-80 transition-all duration-300">
        <div className="p-6 lg:p-8">
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
}

