import axios from "axios";







const api = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
    headers:{
        "Content-Type": "application/json"
    },
    withCredentials: false    
});





export default api;