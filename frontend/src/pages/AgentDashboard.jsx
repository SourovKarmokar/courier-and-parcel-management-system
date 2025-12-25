import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import socket from "../socket";
import "react-toastify/dist/ReactToastify.css";

const AgentDashboard = () => {
  const { token, currentUser } = useSelector((state) => state.user);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // 1️⃣ LOAD ASSIGNED PARCELS (API)
  // ===============================
  useEffect(() => {
    if (!token) return;

    const fetchMyJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/agent/my-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobs(res.data.data || []);
      } catch {
        toast.error("Failed to load assigned parcels");
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, [token]);

  // ===============================
  // 2️⃣ JOIN AGENT SOCKET ROOM
  // ===============================
  useEffect(() => {
    if (!currentUser?._id) return;

    socket.emit("join-room", `agent_${currentUser._id}`);

    return () => {
      socket.off("new-job-assigned");
    };
  }, [currentUser]);

  // ===============================
  // 3️⃣ REALTIME JOB RECEIVE
  // ===============================
  useEffect(() => {
    socket.on("new-job-assigned", (data) => {
      toast.info("📦 New parcel assigned!");

      setJobs((prev) => [data.parcel, ...prev]);
    });

    return () => socket.off("new-job-assigned");
  }, []);




  useEffect(() => {
  if (!navigator.geolocation) return;

  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      socket.emit("agent-location", {
        parcelId: jobs[0]?._id, // current parcel
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    },
    (err) => console.error(err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}, [jobs])

  // ===============================
  // 4️⃣ UPDATE DELIVERY STATUS
  // ===============================
  const handleStatusChange = async (parcelId, status) => {
    try {
      await axios.put(
        "http://localhost:3000/api/v1/agent/update-status",
        { parcelId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Status updated successfully");

      // UI update without reload
      setJobs((prev) =>
        prev.map((job) =>
          job._id === parcelId ? { ...job, status } : job
        )
      );
    } catch {
      toast.error("Status update failed");
    }
  };

  // ===============================
  // UI
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        Loading Agent Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer position="top-center" />

      <h1 className="text-3xl font-bold mb-6">🚚 Agent Dashboard</h1>

      {jobs.length === 0 ? (
        <div className="bg-white p-10 rounded shadow text-center text-gray-500">
          No assigned parcels yet
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Delivery Address</th>
                <th className="p-4">Current Status</th>
                <th className="p-4">Update Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="p-4">
                    <p className="font-medium">
                      {job.senderId?.firstName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {job.senderId?.phone}
                    </p>
                  </td>

                  <td className="p-4 text-sm">
                    {job.recipientAddress}
                  </td>

                  <td className="p-4 capitalize font-semibold">
                    {job.status.replace("_", " ")}
                  </td>

                  <td className="p-4">
                    <select
                      value={job.status}
                      onChange={(e) =>
                        handleStatusChange(job._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="picked_up">Picked Up</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
