import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../redux/userSlice";

/* ================= MAIN COMPONENT ================= */
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("parcels");
  const [parcels, setParcels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD PARCELS + AGENTS =================
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      try {
        const [parcelRes, agentRes] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/admin/parcels", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/v1/admin/agents", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setParcels(parcelRes.data || []);
        setAgents(agentRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  // ================= LOAD USERS =================
  useEffect(() => {
    if (!token) return;

    const loadUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/admin/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadUsers();
  }, [token]);

  // ================= ASSIGN AGENT =================
  const handleAssignAgent = async (parcelId, agentId) => {
    if (!agentId) return;

    await axios.put(
      "http://localhost:3000/api/v1/admin/assign-agent",
      { parcelId, agentId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setParcels((prev) =>
      prev.map((p) =>
        p._id === parcelId
          ? {
              ...p,
              status: "assigned",
              deliveryManId: agents.find((a) => a._id === agentId),
            }
          : p
      )
    );
  };

  // ================= DELETE USER =================
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await axios.delete(
      `http://localhost:3000/api/v1/admin/users/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">🚚 Admin Panel</h2>

        <ul className="space-y-3">
          <SidebarItem label="📦 Parcels" active={activeTab === "parcels"} onClick={() => setActiveTab("parcels")} />
          <SidebarItem label="👥 Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
          <SidebarItem label="📊 Reports" active={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
        </ul>

        <button
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
          className="mt-10 w-full bg-red-500 text-white py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8">
        {activeTab === "parcels" && (
          <ParcelsTab parcels={parcels} agents={agents} onAssign={handleAssignAgent} />
        )}

        {activeTab === "users" && (
          <UsersTab users={users} onDelete={handleDeleteUser} />
        )}

        {activeTab === "reports" && <ReportsTab parcels={parcels} />}
      </main>
    </div>
  );
};

export default AdminDashboard;

/* ================= SUB COMPONENTS ================= */

const SidebarItem = ({ label, active, onClick }) => (
  <li
    onClick={onClick}
    className={`cursor-pointer px-3 py-2 rounded ${
      active ? "bg-slate-700 text-white" : "text-gray-300 hover:bg-slate-800"
    }`}
  >
    {label}
  </li>
);

/* ================= PARCELS TAB ================= */
const ParcelsTab = ({ parcels, agents, onAssign }) => (
  <>
    <h1 className="text-3xl font-bold mb-6">📦 Parcels</h1>

    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs uppercase">
          <tr>
            <th className="p-4">Customer</th>
            <th className="p-4">Address</th>
            <th className="p-4">Status</th>
            <th className="p-4">Rider</th>
            <th className="p-4">Assign</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {parcels.map((p) => (
            <tr key={p._id}>
              <td className="p-4">{p.senderName}</td>
              <td className="p-4">{p.recipientAddress}</td>
              <td className="p-4 capitalize">{p.status}</td>
              <td className="p-4">{p.deliveryManId?.firstName || "—"}</td>
              <td className="p-4">
                {p.status === "pending" && (
                  <select onChange={(e) => onAssign(p._id, e.target.value)} className="border px-2 py-1">
                    <option value="">Select</option>
                    {agents.map((a) => (
                      <option key={a._id} value={a._id}>{a.firstName}</option>
                    ))}
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

/* ================= USERS TAB ================= */
const UsersTab = ({ users, onDelete }) => (
  <>
    <h1 className="text-3xl font-bold mb-6">👥 Users</h1>

    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs uppercase">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {users.map((u) => (
            <tr key={u._id}>
              <td className="p-4">{u.firstName} {u.lastName}</td>
              <td className="p-4">{u.email}</td>
              <td className="p-4 capitalize">{u.role}</td>
              <td className="p-4">
                {u.role === "admin" ? (
                  <span className="text-gray-400">Protected</span>
                ) : (
                  <button onClick={() => onDelete(u._id)} className="text-red-600">
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

/* ================= REPORTS TAB ================= */
const ReportsTab = ({ parcels }) => (
  <>
    <h1 className="text-3xl font-bold mb-6">📊 Reports</h1>

    <div className="grid grid-cols-3 gap-6">
      <ReportCard title="Total" value={parcels.length} />
      <ReportCard title="Delivered" value={parcels.filter(p => p.status === "delivered").length} />
      <ReportCard title="Pending" value={parcels.filter(p => p.status === "pending").length} />
    </div>
  </>
);

const ReportCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded shadow">
    <p className="text-gray-500">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);
