import { useContext } from "react"
import { AuthContex } from "../context/authContext"
export const useAuth = () => { 
    const context = useContext(AuthContex)
    
    if (!context) {
        throw new Error("useAuth must be used whithn an Authprovider")
    }
    return context
}