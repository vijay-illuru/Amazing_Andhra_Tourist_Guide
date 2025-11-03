import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, {
          credentials: "include", // Important for cookies/auth
        });

        if (!res.ok) {
          let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (parseError) {
            // If response is not JSON, use status text
            const text = await res.text().catch(() => "");
            errorMessage = text || errorMessage;
          }
          console.error(`Fetch error for ${url}:`, errorMessage);
          setError(errorMessage);
          setLoading(false);
          return;
        }

        const result = await res.json();
        setData(result.data || result); // Handle both {data: ...} and direct data
        setLoading(false);
      } catch (err) {
        // Network errors, CORS errors, etc.
        const errorMessage = err.message || "Failed to fetch data";
        console.error(`Network error for ${url}:`, err);
        
        if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
          setError("Cannot connect to server. Please check if the backend is running on http://localhost:8000");
        } else {
          setError(errorMessage);
        }
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);
  
  return {
    data,
    error,
    loading,
  };
};

export default useFetch;
