import { headers } from "next/headers";
import { API_BASE_URL } from "../api-client"
import { auth } from "../auth";

export const getUsers = async()=>{
    const users = await auth.api.listUsers({
    query: {
        sortBy: "name", // The field to sort by.
        sortDirection: "desc", // The direction to sort by.
    },
    // This endpoint requires session cookies.
    headers: await headers(),
});
return users;
}
// get all premium users after Payment
export const getPremiumUserById= async(userId:string)=>{
    const response = await fetch(`${API_BASE_URL}/users/${userId}/premium`);
    return response.json()
}