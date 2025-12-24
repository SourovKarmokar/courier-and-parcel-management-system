import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyParcels = () => {
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/parcel/my-parcels", // ✅ EXACT backend route
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data.data || []);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Booking History</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 font-medium"
        >
          Back to Dashboard
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <p className="text-gray-500 mb-4">
            You haven't booked any parcels yet.
          </p>
          <button
            onClick={() => navigate("/book-parcel")}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Book Now
          </button>
        </div>
      ) : (
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
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="p-4 font-medium">
                    {order.recipientName}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {order.recipientAddress}
                  </td>
                  <td className="p-4 capitalize">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {order.riderName || "Not Assigned"}
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

export default MyParcels;
