import axios from "axios";

export default axios.create(
    {
        withCredentials: true,
        baseURL: "https://ps-xrmz.onrender.com",
    }
)