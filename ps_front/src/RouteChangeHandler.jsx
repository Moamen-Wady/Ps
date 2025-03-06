import { useEffect } from "react";
import { useLocation } from "react-router";

export default function RouteChangeHandler({ setLoading }) {
  let location = useLocation();
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}
