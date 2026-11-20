import { API_BASE_URL } from "@/lib/api-client";

export const paymentVerify = async(sessionId:string)=>{
    const response = await fetch(`${API_BASE_URL}/payments/checkout-verify`,{
        method:'POST',
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify({sessionId}),
    })
    return response.json()
}