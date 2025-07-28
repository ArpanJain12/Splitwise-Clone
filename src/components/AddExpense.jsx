import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import api from "../services/api";

export default function AddExpense({ isOpen, onClose, user }) {
  const [formData, setFormData] = useState({
    groupID: "",
    amount: "",
    description: "",
    paidByUserID: user?.id || "",
    splitType: "EQUAL",
    category: "",
    notes: "",
    userSplit: []
  });

  const [groups, setGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        groupID: "",
        amount: "",
        description: "",
        paidByUserID: user?.id || "",
        splitType: "EQUAL",
        category: "",
        notes: "",
        userSplit: []
      });
      setError("");
      fetchGroups();
    }
  }, [isOpen, user]);

  const fetchGroups = async () => {
    try {
      // Note: Since we don't have a direct API to get user's groups,
      // we'll use a placeholder. In a real app, you'd need this endpoint.
      setGroups([
        { id: 1, name: "Trip to Vegas", members: ["user1", "user2", "user3"] },
        { id: 2, name: "House Expenses", members: ["user1", "user4"] },
        { id: 3, name: "Office Lunch", members: ["user1", "user5", "user6"] }
      ]);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setError("Failed to load groups");
    }
  };

  const handleGroupChange = (groupId) => {
    const selectedGroup = groups.find(g => g.id === parseInt(groupId));
    setFormData({ ...formData, groupID: groupId });
    
    if (selectedGroup) {
      // Initialize user splits for equal split
      const userSplit = selectedGroup.members.map((memberId, index) => ({
        userId: index + 1, // This would be actual user IDs
        amount: 0,
        percentage: 0,
        shares: 1
      }));
      setFormData(prev => ({ ...prev, userSplit }));
      setGroupMembers(selectedGroup.members);
    }
  };

  const updateUserSplit = (index, field, value) => {
    const newUserSplit = [...formData.userSplit];
    newUserSplit[index] = { ...newUserSplit[index], [field]: parseFloat(value) || 0 };
    setFormData({ ...formData, userSplit: newUserSplit });
  };

  const calculateEqualSplit = () => {
    if (formData.amount && formData.userSplit.length > 0) {
      const amountPerPerson = parseFloat(formData.amount) / formData.userSplit.length;
      const newUserSplit = formData.userSplit.map(split => ({
        ...split,
        amount: amountPerPerson
      }));
      setFormData({ ...formData, userSplit: newUserSplit });
    }
  };

  useEffect(() => {
    if (formData.splitType === "EQUAL" && formData.amount) {
      calculateEqualSplit();
    }
  }, [formData.amount, formData.splitType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.groupID || !formData.amount || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const expenseData = {
        groupID: parseInt(formData.groupID),
        amount: parseFloat(formData.amount),
        description: formData.description,
        paidByUserID: parseInt(formData.paidByUserID),
        splitType: formData.splitType,
        category: formData.category,
        notes: formData.notes,
        userSplit: formData.userSplit
      };

      await api.group.addExpense(expenseData);
      onClose();
      // You might want to trigger a refresh of the parent component here
    } catch (error) {
      console.error("Error adding expense:", error);
      setError(error.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Add Expense</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Group Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group *
            </label>
            <select
              value={formData.groupID}
              onChange={(e) => handleGroupChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select a group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          {/* Basic Expense Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What was this expense for?"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select category</option>
                <option value="Food">Food & Dining</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills & Utilities</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Split Type
              </label>
              <select
                value={formData.splitType}
                onChange={(e) => setFormData({ ...formData, splitType: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="EQUAL">Split Equally</option>
                <option value="EXACT">Exact Amounts</option>
                <option value="PERCENTAGE">By Percentage</option>
                <option value="SHARES">By Shares</option>
              </select>
            </div>
          </div>

          {/* User Split Details */}
          {formData.groupID && formData.userSplit.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Split Details
              </label>
              <div className="space-y-2">
                {formData.userSplit.map((split, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <span className="text-sm font-medium">Member {index + 1}</span>
                    </div>
                    
                    {formData.splitType === "EQUAL" && (
                      <div className="flex-1">
                        <span className="text-sm text-gray-600">
                          ₹{split.amount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    {formData.splitType === "EXACT" && (
                      <div className="flex-1">
                        <input
                          type="number"
                          step="0.01"
                          value={split.amount}
                          onChange={(e) => updateUserSplit(index, "amount", e.target.value)}
                          placeholder="Amount"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                      </div>
                    )}
                    
                    {formData.splitType === "PERCENTAGE" && (
                      <div className="flex-1">
                        <input
                          type="number"
                          step="0.1"
                          value={split.percentage}
                          onChange={(e) => updateUserSplit(index, "percentage", e.target.value)}
                          placeholder="Percentage"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                      </div>
                    )}
                    
                    {formData.splitType === "SHARES" && (
                      <div className="flex-1">
                        <input
                          type="number"
                          value={split.shares}
                          onChange={(e) => updateUserSplit(index, "shares", e.target.value)}
                          placeholder="Shares"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}