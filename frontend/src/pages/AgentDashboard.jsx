import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";

const AgentDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-600">CourierPro Agent</h1>
        <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">Agent: {currentUser?.firstName}</span>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Deliveries</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* My Jobs Card */}
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition cursor-pointer border-l-4 border-green-500 h-full flex flex-col justify-center items-center text-center">
                <h3 className="text-xl font-bold text-green-600">📦 My Jobs</h3>
                <p className="text-gray-500 mt-2">View parcels assigned to you.</p>
                <p className="text-3xl font-bold text-gray-800 mt-4">0</p>
            </div>

            {/* Completed Jobs */}
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition cursor-pointer border-l-4 border-blue-500 h-full flex flex-col justify-center items-center text-center">
                <h3 className="text-xl font-bold text-blue-600">✅ Completed</h3>
                <p className="text-gray-500 mt-2">Total deliveries done.</p>
                <p className="text-3xl font-bold text-gray-800 mt-4">0</p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;