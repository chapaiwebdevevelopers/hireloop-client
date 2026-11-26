import { TUserRole } from "@/types/types";
import { API_BASE_URL } from "../api-client";


export const updateRole = async (userId: string, role: TUserRole) => {
    const response= await fetch(`${API_BASE_URL}/users/${userId}`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify({role})
    })
    return response.json()
};


