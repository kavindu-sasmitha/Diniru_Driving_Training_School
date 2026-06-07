import {  createContext, useEffect, useState } from "react";
import { getMyDetails } from "../service/authService";

export const AuthContex = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
      setLoading(true);
      getMyDetails()
        .then((res) => {
          if (res?.data) setUser(res.data);
          else setUser(null);
        })
        .catch((err) => {
          console.log(err);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContex.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContex.Provider>
  );
};
