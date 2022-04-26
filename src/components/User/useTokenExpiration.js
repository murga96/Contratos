import { useEffect, useRef, useState } from "react";

export function useTokenExpiration(onTokenRefreshRequired) {
  const timeoutRef = useRef();
  const [tokenExpiration, setTokenExpiration] = useState(null);

  useEffect(() => {
    // get a new access token with the refresh token when it expires
    if (tokenExpiration) {
      console.log(tokenExpiration, "entro")
      const now = new Date();
      timeoutRef.current = window.setInterval(async () => {
        console.log("timer")
        onTokenRefreshRequired();
      }, tokenExpiration * 1000);
    }

    return () => {
      window.clearTimeout(timeoutRef.current);
    };
  }, [onTokenRefreshRequired, tokenExpiration]);

  const clearAutomaticTokenRefresh = () => {
    window.clearTimeout(timeoutRef.current);
    setTokenExpiration(undefined);
  };

  return {
    clearAutomaticTokenRefresh,
    setTokenExpiration,
  };
}
