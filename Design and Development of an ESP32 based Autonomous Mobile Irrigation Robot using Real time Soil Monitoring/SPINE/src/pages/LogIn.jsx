import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import loginImage from "../assets/login.jpg"

const LogIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter your email and password");
      return;
    }

    const result = await login({ email: formData.email, password: formData.password,});
    if (!result.success) {
      return;
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value, }));
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="w-full max-w-3xl rounded-2xl border bg-green-500/8 p-8 max-md:p-4 my-5 max-md:mt-3 grid grid-cols-1 md:grid-cols-2 gap-6 border-gray-500 m-3">

          {/* LEFT SIDE - UNCHANGED */}
          <Link onClick={() => { navigate("/"); scrollTo(0, 0); }} className="flex items-center gap-3 max-md:hidden">
            <img
              className="rounded-2xl"
              src={loginImage}
              alt="leftSideImage"
            />
          </Link>

          {/* RIGHT SIDE */}
          <form
            onSubmit={handleSubmit}
            className="w-full text-center border border-gray-300/40 rounded-2xl px-6 bg-white/45 p-4 "
          >
            <h2 className="text-2xl text-gray-900 font-medium mt-2">
              Sign in to your account
            </h2>

            <p className="text-sm text-gray-500/90 mt-2">
              Welcome back! Please sign in to continue
            </p>

            <div className="flex items-center gap-4 w-full my-5">
              <div className="w-full h-px bg-gray-300/90"></div>

              <p className="w-full text-nowrap text-sm text-black/80">
                Sign In with email
              </p>

              <div className="w-full h-px bg-gray-300/90"></div>
            </div>

            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 text-black/80">
              <svg
                width="16"
                height="11"
                viewBox="0 0 16 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                  fill="#6B7280"
                />
              </svg>

              <input
                type="email"
                name="email"
                placeholder="Email id"
                className="bg-transparent text-black/80 placeholder-black/70 outline-none text-sm w-full h-full"
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative flex items-center mt-4 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <svg
                width="13"
                height="17"
                viewBox="0 0 13 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                  fill="#6B7280"
                />
              </svg>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="bg-transparent text-black/80 placeholder-black/70 outline-none text-sm w-full h-full"
                onChange={handleChange}
                required
              />

              <span
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-5 top-3 cursor-pointer text-black/70 py-0.5"
              >
                {showPassword ? (
                  <Eye size={20} />
                ) : (
                  <EyeOff size={20} />
                )}
              </span>
            </div>

            <div className="w-full flex items-center justify-between mt-5 text-black/70">
              <div className="flex items-center gap-2">
                <input
                  className="h-5"
                  type="checkbox"
                  id="checkbox"
                />

                <label
                  className="text-sm"
                  htmlFor="checkbox"
                >
                  Remember me
                </label>
              </div>

              <Link
                className="text-sm underline"
                to="/signup"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="mt-5 w-full h-11 rounded-full bg-linear-to-r from-green-400 to-green-500 text-black hover:bg-linear-to-r hover:from-green-500 hover:to-green-400 transition-all duration-500 cursor-pointer text-sm"
              onClick={() => scrollTo(0, 0)}
            >
              Log in
            </button>

            <p className="text-gray-500/90 text-sm mt-4">
              Don’t have an account?{" "}
              <Link
                className="text-[#f9570c] underline"
                to="/signup"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
