import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import { Eye, EyeOff, RotateCcw } from "lucide-react";
import OtpInput from "../components/OtpInput";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const navigate = useNavigate();
  const { signup, verifyEmailOtp, resendOtp } = useAuth();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (!showOtp || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showOtp, timeLeft]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleResendCode() {
    if (timeLeft > 0) return;
    const result = await resendOtp(form.email);
    if (!result.success) return;
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(300);
  }

  function validate() {
    const err = {};
    if (!form.name.trim()) {
      err.name = "Full name is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = "Valid email required";
    }
    if (!form.password) {
      err.password = "Password is required";
    }
    if (
      !form.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
      )
    ) {
      err.password = "Length must be 8 or greater & include uppercase, lowercase, number & symbol";
    }
    if (form.confirmpassword !== form.password) {
      err.confirmpassword = "Passwords do not match";
    }
    return err;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);

    if (Object.keys(v).length) return;

    const result = await signup({ name: form.name, email: form.email, password: form.password, });
    if (!result.success) return;
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(300);
    setShowOtp(true);
    scrollTo(0, 0);
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter the complete OTP");
      return;
    }
    if (timeLeft <= 0) {
      toast.error("OTP has expired.");
      return;
    }

    const result = await verifyEmailOtp({ email: form.email, otp: enteredOtp, });
    if (!result.success) return;
    setShowOtp(false);
    setOtp(["", "", "", "", "", ""]);
    scrollTo(0, 0);
    navigate("/");
  }
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        {/* CARD */}
        <div className="w-full max-w-3xl rounded-2xl border bg-green-500/8 p-8 my-15 max-md:mt-3 grid grid-cols-1 md:grid-cols-2 gap-6 border-gray-500">

          {/* LEFT */}
          <div className="flex flex-col gap-5 justify-between">
            <div>
              <Link onClick={() => {
                navigate("/");
                scrollTo(0, 0);
              }} className="flex items-center gap-4">
                <img src={logo} alt="LOGO" className="w-60 h-auto" />
              </Link>

              <div className="text-l text-slate-600 pt-3 text-sm">
                After signing up, you'll be able to explore intelligent
                farming insights, monitor soil conditions, and connect with
                the S.P.I.R.E. ecosystem.
              </div>
            </div>

            {/* Bottom Left Section */}
            <div>
              <p className="text-left mb-4 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-[#f9570c] underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* FORM */}
          {!showOtp ? (
            <form
              className="space-y-4 text-sm"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="text-black">
                  User Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-3 px-3 py-3 border border-gray-500/55 rounded-lg focus:outline-none focus:ring-0"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.name}
                  </div>
                )}
              </div>

              <div>
                <label className="text-black">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mt-3 px-3 py-3 border border-gray-500/55 rounded-lg focus:outline-none focus:ring-0"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="text-black">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full mt-3 px-3 py-3 border border-gray-500/55 rounded-lg pr-10 focus:outline-none focus:ring-0"
                  placeholder="Enter your password"
                />
                <span
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-11 cursor-pointer text-gray-500 py-0.5"
                >
                  {showPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </span>
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="relative pt-1">
                <label className="text-black">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmpassword"
                  value={form.confirmpassword}
                  onChange={handleChange}
                  className="w-full mt-3 px-3 py-3 border border-gray-500/55 rounded-lg pr-10 focus:outline-none focus:ring-0"
                  placeholder="Confirm your password"
                />
                <span
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-12 cursor-pointer text-gray-500 py-0.5"
                >
                  {showConfirmPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </span>
                {errors.confirmpassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmpassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-green-400 to-green-500 text-black py-3 mt-4 rounded-lg hover:bg-linear-to-r hover:from-green-500 hover:to-green-400 transition-all duration-500 cursor-pointer"
              >
                Get Verification Code
              </button>
            </form>
          ) : (
            <form
              className="space-y-6 text-sm"
              onSubmit={handleVerifyOtp}
            >
              <div>
                <label className="text-black text-lg font-medium">
                  Verify your email
                </label>

                <p className="text-slate-600 mt-2">
                  Enter the 6-digit verification code sent to <span className="text-black font-medium">
                    {form.email}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  {timeLeft > 0
                    ? `Code expires in ${formatTime(timeLeft)}`
                    : "Code expired"}
                </span>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={timeLeft > 0}
                  className={`flex justify-center items-center gap-1 ${timeLeft > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-black hover:text-green-700 cursor-pointer"
                    }`}
                >
                  Resend Code
                  <RotateCcw size={12} />
                </button>
              </div>

              <div className="pt-4">
                <OtpInput
                  otp={otp}
                  setOtp={setOtp}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-green-400 to-green-500 text-black py-3 mt-4 rounded-lg hover:bg-linear-to-r hover:from-green-500 hover:to-green-400 transition-all duration-500 cursor-pointer"
              >
                Verify OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}