import api from "./api";


export const register = async (studentData: {
  name: string;
  email: string;
  phoneNumber: string;
  nicNumber: string;
  address: string; 
  password: string;
}) => {
  
  const res = await api.post("/auth/register", studentData);
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};


export const getMyDetails = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};