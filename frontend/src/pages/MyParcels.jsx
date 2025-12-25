import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import socket from "../socket";

const MyParcels = () => {
  const { token } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load parcels
  useEffect(() => {
    if (!token) return;

    const loadOrders = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/v1/customer/my-parcels",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data.data || []);
      setLoading(false);
    };

    loadOrders();
  }, [token]);

  // Realtime update
  useEffect(() => {
    socket.on("parcel-status-updated", (data) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === data.parcelId
            ? { ...o, status: data.status }
            : o
        )
      );
    });

    return () => socket.off("parcel-status-updated");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading parcels...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">📦 My Parcels</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th className="p-4">Recipient</th>
              <th className="p-4">Address</th>
              <th className="p-4">Status</th>
              <th className="p-4">Rider</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {orders.map((o) => (
              <tr key={o._id}>
                <td className="p-4 font-medium">{o.recipientName}</td>
                <td className="p-4 text-sm text-gray-600">
                  {o.recipientAddress}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      o.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : o.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {o.status.replace("_", " ")}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  {o.deliveryManId
                    ? `${o.deliveryManId.firstName} ${
                        o.deliveryManId.lastName || ""
                      }`
                    : "Not Assigned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
