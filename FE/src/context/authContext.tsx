import { createContext, useEffect, useState } from "react";
import { getMyDetails } from "../service/authService";

export const AuthContex = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN"); // ✅ Key name fix
    if (token) {
      setLoading(true);
      getMyDetails()
        .then((res) => {
          // authService: return res.data — එතකොට මේකේ res = { user: {...} } හෝ directly user object
          const userData = res?.user || res?.data || res;
          if (userData) setUser(userData);
          else setUser(null);
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("ACCESS_TOKEN"); // ✅ Invalid token clear කරනවා
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  // ✅ Logout function — context ඇතුළෙන් use කරන්න
  const logout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    setUser(null);
  };

  return (
    <AuthContex.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContex.Provider>
  );
};