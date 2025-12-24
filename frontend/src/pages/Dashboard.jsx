import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// তিনটি ড্যাশবোর্ড ইম্পোর্ট
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import AgentDashboard from "./AgentDashboard"; // 👈 নতুন ফাইল ইম্পোর্ট

const Dashboard = () => {
  const navigate = useNavigate();
  // Redux থেকে ডাটা আনছি
  const { currentUser, role } = useSelector((state) => state.user);

  // সেফটি চেক: currentUser বা role না থাকলে role currentUser এর ভেতর খুঁজবে
  const userRole = role || currentUser?.role;

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // 👑 Admin
  if (userRole === "admin") {
    return <AdminDashboard />;
  }

  // 📦 Customer
  if (userRole === "customer") {
    return <UserDashboard />;
  }

  // 🚚 Agent (এখন আর মেসেজ দেখাবে না, আসল ড্যাশবোর্ড দেখাবে)
  if (userRole === "agent") {
    return <AgentDashboard />;
  }

  return <div className="text-center mt-20 text-red-500">Access Denied</div>;
};

export default Dashboard;