import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../redux/userSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  const [parcels, setParcels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchAdminData = async () => {
    try {
      const [parcelRes, agentRes] = await Promise.all([
        axios.get("http://localhost:3000/api/v1/admin/all-parcels", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/v1/admin/all-agents", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      console.log("Parcels:", parcelRes.data);
      console.log("Agents:", agentRes.data);

      setParcels(Array.isArray(parcelRes.data) ? parcelRes.data : []);
      setAgents(Array.isArray(agentRes.data) ? agentRes.data : []);

    } catch (err) {
      console.error("Admin data load failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (token) fetchAdminData();
}, [token]);

  const handleAssignAgent = async (parcelId, agentId) => {
    if (!agentId) return;

    try {
      await axios.put(
        "http://localhost:3000/api/v1/admin/assign",
        { parcelId, agentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // UI update
      setParcels((prev) =>
        prev.map((p) =>
          p._id === parcelId ? { ...p, status: "assigned" } : p
        )
      );
    } catch (err) {
      console.error("Assign failed", err);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 font-bold">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-slate-800 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-4 text-gray-300">
          <li className="font-bold text-white">All Parcels</li>
          <li>Manage Users</li>
        </ul>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Parcel Requests</h1>
          <button
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded shadow">
            <p>Total Bookings</p>
            <p className="text-2xl font-bold">{parcels.length}</p>
          </div>
          <div className="bg-white p-5 rounded shadow">
            <p>Pending</p>
            <p className="text-2xl font-bold">
              {parcels.filter((p) => p.status === "pending").length}
            </p>
          </div>
          <div className="bg-white p-5 rounded shadow">
            <p>Assigned</p>
            <p className="text-2xl font-bold">
              {parcels.filter((p) => p.status !== "pending").length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Recipient</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assign Agent</th>
              </tr>
            </thead>
            <tbody>
              {parcels.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No parcels found
                  </td>
                </tr>
              ) : (
                parcels.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="p-4">{p.senderName}</td>
                    <td className="p-4">{p.recipientAddress}</td>
                    <td className="p-4 capitalize">{p.status}</td>
                    <td className="p-4">
                      {p.status === "pending" ? (
                        <select
                          onChange={(e) =>
                            handleAssignAgent(p._id, e.target.value)
                          }
                          className="border p-1 rounded"
                        >
                          <option value="">Select Agent</option>
                          {agents.map((a) => (
                            <option key={a._id} value={a._id}>
                              {a.firstName} {a.lastName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        "Assigned"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
