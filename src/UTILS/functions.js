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

export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export const get_YYYY_MM_DD = (timestamp)=>{
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
}