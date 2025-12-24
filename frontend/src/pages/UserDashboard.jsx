import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../redux/userSlice";

const UserDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CourierPro</h1>
        <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">Hello, {currentUser?.firstName}</span>
            <button 
                onClick={handleLogout}
                className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition"
            >
                Logout
            </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 👇 Book Parcel Card (Link যুক্ত করা) */}
            <Link to="/book-parcel">
                <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition cursor-pointer border-l-4 border-blue-500 h-full flex flex-col justify-center items-center text-center">
                    <h3 className="text-xl font-bold text-blue-600">📦 Book a Parcel</h3>
                    <p className="text-gray-500 mt-2">Click here to send a new parcel.</p>
                </div>
            </Link>

            {/* My Orders Card */}
            <Link to="/my-parcels">
              <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition cursor-pointer border-l-4 border-green-500 h-full flex flex-col justify-center items-center text-center">
                  <h3 className="text-xl font-bold text-green-600">📋 My Bookings</h3>
                  <p className="text-gray-500 mt-2">View your order history & status.</p>
              </div>
            </Link>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;