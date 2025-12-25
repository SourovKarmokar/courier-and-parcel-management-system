import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import socket from "../socket";

const MyBookings = () => {
  const { token } = useSelector((state) => state.user);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load bookings
  useEffect(() => {
    if (!token) return;

    const loadBookings = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/v1/customer/my-parcels",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setParcels(res.data.data || []);
      setLoading(false);
    };

    loadBookings();
  }, [token]);

  // Realtime update
  useEffect(() => {
    socket.on("parcel-status-updated", (data) => {
      setParcels((prev) =>
        prev.map((p) =>
          p._id === data.parcelId
            ? { ...p, status: data.status }
            : p
        )
      );
    });

    return () => socket.off("parcel-status-updated");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">📦 My Bookings</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {parcels.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
          >
            <p className="font-semibold text-lg mb-1">
              {p.recipientName}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              {p.recipientAddress}
            </p>

            <div className="flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                  p.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : p.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {p.status.replace("_", " ")}
              </span>

              <span className="text-sm text-gray-600">
                {p.deliveryManId
                  ? p.deliveryManId.firstName
                  : "Not Assigned"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
