import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Register, 2 = OTP
  const [otp, setOtp] = useState("");

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

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/authentication/registration",
        formData
      );

      if (res.data.message === "Registration Successfull") {
        toast.success("Registration successful! Check email for OTP");
        setStep(2);
      } else {
        toast.error(res.data.error || "Registration failed");
      }
    } catch  {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/authentication/verifybyotp",
        {
          email: formData.email,
          otp: otp,
        }
      );

      if (res.data.success) {
        toast.success("Account verified successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error("Invalid OTP");
      }
    } catch  {
      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESEND OTP =================
  const handleResendOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/authentication/resendotp",
        { email: formData.email }
      );

      toast.success(res.data.message || "OTP resent successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to resend OTP"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {step === 1 ? "Create Account" : "Verify Account"}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {step === 1
              ? "Join us to book parcels"
              : `Enter the OTP sent to ${formData.email}`}
          </p>
        </div>

        {/* ================= STEP 1: REGISTER ================= */}
        {step === 1 && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First Name"
                required
                onChange={handleChange}
                className="input"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                required
                onChange={handleChange}
                className="input"
              />
            </div>

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              onChange={handleChange}
              className="input"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              required
              onChange={handleChange}
              className="input"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="input"
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              className="input"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>
        )}

        {/* ================= STEP 2: OTP ================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input text-center text-xl tracking-widest"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn bg-green-600 hover:bg-green-500"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              className="w-full text-sm text-blue-600 hover:underline"
            >
              Resend OTP
            </button>
          </form>
        )}

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
