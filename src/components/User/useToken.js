import { useCallback, useContext, useEffect, useRef } from "react";
import { useTokenExpiration } from "./useTokenExpiration";
import { setContext } from "@apollo/client/link/context";

export function useToken(onTokenInvalid, onRefreshRequired) {
  const accessToken = useRef();
  const { clearAutomaticTokenRefresh, setTokenExpiration } =
    useTokenExpiration(onRefreshRequired);
  //init token with timeout
  const setToken = useCallback(
    (token_expiration, access_token) => {
      localStorage.setItem("token", access_token)
      setTokenExpiration(token_expiration);
    },
    [setTokenExpiration]
  );

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem("token");
  }, []);

  const clearToken = useCallback(async () => {
    localStorage.removeItem("token")
    // clear auto refresh interval
    clearAutomaticTokenRefresh();
  }, [clearAutomaticTokenRefresh]);


  return {
    clearToken,
    setToken,
    isAuthenticated,
  };
}
