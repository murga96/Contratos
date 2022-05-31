import { useLazyQuery, useMutation } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContainer } from "unstated-next";
import {
  autenticarUsuario,
  refreshToken,
} from "../../database/GraphQLStatements";
import { useToken } from "./useToken";
// import { AuthEvents } from '../services/AuthEvents';

function useAuth() {
  const [_, setTokenExpiration] = useState(null);
  //   const refreshToken = useCallback(refresh, [])
  const navigate = useNavigate();

  const [autenticacionQuery, { called, refetch }] = useLazyQuery(
    autenticarUsuario,
    {
      fetchPolicy: "network-only",
    }
  );
  const [refreshTokenFunct] = useMutation(refreshToken, {
    fetchPolicy: "network-only",
  });

  const onTokenInvalid = () => {
    alert("El usuario no tiene permiso para acceder al sistema");
    // setUser(null)
    navigate("/login");
  };
  const { setToken, clearToken, isAuthenticated, accessToken } = useToken(
    onTokenInvalid,
    refresh
  );

  //   useEffect(() => {
  //     // try to get new token on first render using refresh token
  //     refreshToken();
  //   }, [refreshToken]);

  useEffect(() => {
    // add listener for login or logout from other tabs
    window.addEventListener("storage", async (event) => {
      if (/* event.key === AuthEvents.LOGOUT && */ isAuthenticated()) {
        await clearToken(false);
        localStorage.clear();
      } /* if (event.key === AuthEvents.LOGIN) */ else {
        refresh();
      }
    });
  }, [clearToken, isAuthenticated, refresh]);

  const logout = useCallback(() => {
    clearToken().finally(() => {
      localStorage.clear();
      navigate("/inicio");
      // fire an event to logout from all tabs
      //   window.localStorage.setItem(AuthEvents.LOGOUT, new Date().toISOString());
    });
  }, [navigate, clearToken]);

  //const register =
  // useCallback();
  // async (username, password) => {
  //   const {
  //     data: {userName, authorities, listPermits, token  },
  //   } = await axios.post('auth/register', {
  //     username: username, password: password
  //   });
  //   setUser({userName, authorities, listPermits});
  //   setToken(tokenExpiration, token);
  //   navigate('/');
  // },
  // [setToken],

  // const login = /* useCallback( */
  const login = async (username, password, tokenExp) => {
    // console.log(called, "called")
    if (!called)
      autenticacionQuery({
        variables: { nombreUsuario: username, contrasena: password },
      })
        .then((resp) => {
          console.log(resp.data);
          if (resp.data?.autenticarUsuarios) {
            setTokenExpiration(tokenExp);
            localStorage.setItem(
              "user",
              JSON.stringify({
                idUsuario: resp.data.autenticarUsuarios.idUsuario,
                idEjecutivo: resp.data.autenticarUsuarios.idEjecutivo,
                nombreUsuario: resp.data.autenticarUsuarios.nombreUsuario,
                rol: resp.data.autenticarUsuarios.usuarioRoles[0].rol.rol,
              })
            );
            setToken(tokenExp, resp.data.autenticarUsuarios.token);
            navigate("/");
          }
        })
        .catch(
          (error) => {
            alert(error.message);
          } /* alert("Credenciales inválidas.") */
        );
    else
      refetch({ nombreUsuario: username, contrasena: password })
        .then((resp) => {
          console.log(resp.data);
          if (resp.data?.autenticarUsuarios) {
            setTokenExpiration(tokenExp);
            localStorage.setItem(
              "user",
              JSON.stringify({
                idUsuario: resp.data.autenticarUsuarios.idUsuario,
                idEjecutivo: resp.data.autenticarUsuarios.idEjecutivo,
                nombreUsuario: resp.data.autenticarUsuarios.nombreUsuario,
                rol: resp.data.autenticarUsuarios.usuarioRoles[0].rol.rol,
              })
            );
            setToken(tokenExp, resp.data.autenticarUsuarios.token);
            navigate("/");
          }
        })
        .catch(
          (error) => {
            alert(error.message);
          } /* alert("Credenciales inválidas.") */
        );
  };
  /* [setToken]
  ) */
  async function refresh() {
    try {
      const { data } = await refreshTokenFunct();
      console.log(data);
      if (data?.refreshToken) {
        localStorage.setItem("token", data.refreshToken.token);
      }
    } catch (error) {
      clearToken();
      localStorage.removeItem("user");
      navigate("/inicio");
      alert(error.message);
    }
  }

  return {
    /* register, */
    login,
    logout,
    refresh,
  };
}

export const AuthContainer = createContainer(useAuth);
