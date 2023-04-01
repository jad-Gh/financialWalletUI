import { toast } from "react-toastify";

export const errorHandler = (error)=>{
    if (error.response.status === 401){
        window.location.href = "/";
        toast.error("UnAuthorized !");
        return false;
    }

    console.log(error.response)

    if (error?.response?.data?.errors){
        error?.response?.data?.errors.forEach((item)=>{
            toast.error(item)
        })
    } else {
        toast.error("An Error Ocurred !")
    }

    
    
}