
import { API_BASE_URL } from "../api-client"



// get all premium users after Payment
export const getPremiumUserById= async(userId:string)=>{
    const response = await fetch(`${API_BASE_URL}/users/${userId}/premium`);
    return response.json()
}