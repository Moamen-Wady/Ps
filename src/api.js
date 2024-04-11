import axios from "axios";

export default axios.create(
    {
        withCredentials: true,
        baseURL: "http://localhost:3005",
        // baseURL: "https://ps-xrmz.onrender.com",
    }
)