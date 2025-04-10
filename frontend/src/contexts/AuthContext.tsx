import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signIn,
  signUp,
  getCurrentUser,
  User,
  AuthResponse,
} from "../services/api";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && !user && !location.pathname.startsWith("/auth")) {
      navigate("/auth/login", { replace: true });
    }

    if (!loading && user && location.pathname.startsWith("/auth")) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);

  const handleAuthResponse = (response: AuthResponse) => {
    const token = response.access_token || response.token;
    if (!token) {
      throw new Error("No token received from server");
    }
    localStorage.setItem("token", token);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await signIn(email, password);
      console.log("Login response:", response);

      handleAuthResponse(response);

      try {
        const userData = await getCurrentUser();
        setUser(userData);
        toast.success("Logged in successfully");
        navigate("/dashboard");
      } catch (userError) {
        console.error("Error fetching user data:", userError);
        setUser({ id: 0, email: email });
        toast.success("Logged in successfully");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await signUp(email, password);
      handleAuthResponse(response);
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (userError) {
        setUser({ id: 0, email: email });
      }
      toast.success("Registered successfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
