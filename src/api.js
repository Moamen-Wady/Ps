import axios from "axios";

export default axios.create(
    {
        withCredentials: true,
        baseURL: "http://localhost:3005",
        // baseURL: "https://ps-uxz6.onrender.com",
    }
)