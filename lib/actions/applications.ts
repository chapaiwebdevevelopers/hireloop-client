import { API_BASE_URL } from "../api-client"

export const updateApplicationStatus = async(id:string,data:{status:string})=>{
    const response= await fetch(`${API_BASE_URL}/applications/${id}`,{
        method:"PATCH",
        headers:{
            'Content-Type':"application/json"
        },
        body:JSON.stringify(data)
    })
    return response.json()

}