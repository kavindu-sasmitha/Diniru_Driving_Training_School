import axios from "axios"

const api = axios.create({
  baseURL: "diniru-driving-training-school-lcrxaih8y.vercel.app/api/v1"
})

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"]

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN")
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))
  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api