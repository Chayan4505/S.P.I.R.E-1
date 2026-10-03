import { createContext, useState, useContext, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // SESSION RESTORE
  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadUser();
    };
    init();
    return () => {
    };
  }, []);

  // LOGIN
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password, }, { withCredentials: true, });
      setUser(res.data.user);
      toast.success(res.data.message);
      navigate("/");
      return {
        success: true,
        user: res.data.user,
      };
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP / REGISTER
  const signup = async ({ name, email, password }) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      toast.success(res.data.message);
      return {
        success: true,
        message: res.data.message,
      };
    } catch (err) {
      console.log(err.response?.data?.message);
      toast.error(
        err.response?.data?.message || "Signup failed"
      );
      return {
        success: false,
        message: err.response?.data?.message || "Signup failed",
      };
    }
  };

  // VERIFY EMAIL OTP
  const verifyEmailOtp = async ({ email, otp }) => {
    try {
      const res = await api.post("/auth/verify-email", { email, otp, }, { withCredentials: true, });
      setUser(res.data.user);
      toast.success(res.data.message);
      return {
        success: true,
        user: res.data.user,
        message: res.data.message,
      };
    } catch (err) {
      const message = err.response?.data?.message || "OTP verification failed";
      toast.error(message);
      return {
        success: false,
        message,
      };
    }
  };

  // RESEND OTP
  const resendOtp = async (email) => {
    try {
      const res = await api.post("/auth/resend-otp", { email, });
      toast.success(res.data.message);
      return {
        success: true,
        message: res.data.message,
      };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to resend OTP";
      toast.error(message);
      return {
        success: false,
        message,
      };
    }
  };

  // LOGOUT
  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout", {}, { withCredentials: true, });
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  // FORCE LOGOUT
  const hardLogout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, verifyEmailOtp, resendOtp, logout, hardLogout, loadUser, }}>
      {children}
    </AuthContext.Provider>
  );
};