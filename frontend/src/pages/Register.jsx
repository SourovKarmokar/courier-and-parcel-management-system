import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // ১ = রেজিস্ট্রেশন, ২ = OTP ভেরিফিকেশন
  const [otp, setOtp] = useState(""); // OTP রাখার জন্য

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ১. রেজিস্ট্রেশন সাবমিট ফাংশন
  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);
    try {
      const {  ...registerData } = formData;
      const response = await axios.post("http://localhost:3000/api/v1/authentication/registration", registerData);

      if (response.data.message === "Registration Successfull") {
        toast.success("Registration Successful! Check your email for OTP.");
        setStep(2); // ✅ সফল হলে ২য় ধাপে (OTP ইনপুট) পাঠাবে
      } else {
        toast.error(response.data.error || "Registration Failed");
      }
    } catch {
      toast.error("Server Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ২. OTP ভেরিফিকেশন ফাংশন
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/v1/authentication/verifybyotp", {
        email: formData.email, // রেজিস্ট্রেশন ফর্ম থেকে ইমেইল নিচ্ছে
        otp: otp
      });

      if (response.data.success) {
        toast.success("Account Verified Successfully!");
        
        // ✅ ভেরিফিকেশন হলে ২ সেকেন্ড পর লগইন পেজে পাঠিয়ে দিবে
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error("Invalid OTP");
      }
    } catch {
      toast.error("Verification failed. Check OTP again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" />
      
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            {step === 1 ? "Create Account" : "Verify Account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 ? "Join us to book parcels" : `Enter the OTP sent to ${formData.email}`}
          </p>
        </div>

        {/* 🔄 কন্ডিশনাল রেন্ডারিং */}
        {step === 1 ? (
          // ============ FORM 1: REGISTRATION ============
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input name="firstName" type="text" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input name="lastName" type="text" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input name="email" type="email" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input name="phone" type="tel" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input name="password" type="password" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <input name="confirmPassword" type="password" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all disabled:bg-blue-300">
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>
        ) : (
          // ============ FORM 2: OTP VERIFICATION ============
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label className="text-sm font-medium text-gray-700">One Time Password (OTP)</label>
              <input 
                type="text" 
                required 
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-center text-xl tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="w-full justify-center rounded-md bg-green-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-green-500 transition-all disabled:bg-green-300">
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;