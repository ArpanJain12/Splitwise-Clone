import { 
  Users, 
  Plus, 
  Trash2, 
  ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function Groups() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [members, setMembers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      setError("Please enter a group name.");
      return;
    }

    if (!members.trim()) {
      setError("Please enter member emails separated by commas.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const memberEmails = members.split(',').map(email => email.trim()).filter(email => email);
      
      const groupData = {
        groupName: newGroupName,
        members: memberEmails
      };

      const response = await api.group.createGroup(groupData);
      
      // Add the new group to the local state (you might want to fetch all groups instead)
      const newGroup = {
        id: response.groupId,
        name: newGroupName,
        members: memberEmails.length + 1, // +1 for current user
        youOwe: 0,
        youAreOwed: 0,
        color: `from-${['purple', 'blue', 'green', 'orange', 'red', 'indigo'][Math.floor(Math.random() * 6)]}-500 to-${['purple', 'blue', 'green', 'orange', 'red', 'indigo'][Math.floor(Math.random() * 6)]}-600`
      };
      
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setMembers('');
      setShowModal(false);
    } catch (error) {
      console.error("Error creating group:", error);
      setError(error.message || "Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index) => {
    const updated = [...groups];
    updated.splice(index, 1);
    setGroups(updated);
  };

  const handleViewDetails = (groupName) => {
    navigate(`/groups/${encodeURIComponent(groupName)}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-600 mt-1">Manage your expense groups</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Group</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 relative">
            <div className={`h-2 bg-gradient-to-r ${group.color}`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${group.color} rounded-lg flex items-center justify-center`}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{group.name}</h3>
                    <p className="text-sm text-gray-600">{group.members} members</p>
                  </div>
                </div>
                <Trash2
                  onClick={() => handleDelete(index)}
                  className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">You owe:</span>
                  <span className="text-sm font-bold text-red-600">₹{group.youOwe.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">You are owed:</span>
                  <span className="text-sm font-bold text-green-600">₹{group.youAreOwed.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => handleViewDetails(group.name)}
                className="w-full mt-4 text-teal-600 hover:text-teal-700 hover:bg-teal-50 py-2 px-4 rounded-lg transition-colors text-sm font-medium flex justify-center items-center space-x-2"
              >
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Create New Group</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={loading}
            />
            
            <textarea
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              placeholder="Enter member emails separated by commas (e.g., john@email.com, jane@email.com)"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 h-20 resize-none"
              disabled={loading}
            />
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowModal(false);
                  setError('');
                  setNewGroupName('');
                  setMembers('');
                }} 
                className="text-sm text-gray-500 hover:underline"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateGroup} 
                className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
