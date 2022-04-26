import { useLazyQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContainer } from "unstated-next";
import { autenticarUsuario } from "../../database/GraphQLStatements";
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
      localStorage.clear()
      navigate("/login");
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
     const login = async(username, password, tokenExp) => {
      // console.log(called, "called")
      if (!called)
      autenticacionQuery({
        variables: { nombreUsuario: username, contrasena: password },
      }).then((resp) => {
        console.log(resp.data);
        console.log(resp.data.autenticarUsuarios.usuarioRoles[0].rol.rol)
        if (resp.data.autenticarUsuarios) {
          setTokenExpiration(tokenExp);
          localStorage.setItem("user", JSON.stringify({
            idUsuario: resp.data.autenticarUsuarios.idUsuario,
            idEjecutivo: resp.data.autenticarUsuarios.idEjecutivo,
            nombreUsuario: resp.data.autenticarUsuarios.nombreUsuario,
            rol: /* {
              idRol: resp.data.autenticarUsuarios[0].rol.idRol, */
              /* rol: */ resp.data.autenticarUsuarios.usuarioRoles[0].rol.rol,
            // }
            //TODO poner roles
          }));
            setToken(tokenExp, resp.data.autenticarUsuarios.token);
            navigate("/");
          }
        }).catch(error => alert(error.message)/* alert("Credenciales inválidas.") */);
      else
        refetch({ nombreUsuario: username, contrasena: password }).then((resp) => {
          console.log(resp.data);
          if (resp.data.autenticarUsuarios) {
            setTokenExpiration(tokenExp);
            localStorage.setItem("user", {
              idUsuario: resp.data.autenticarUsuarios.idUsuario,
              idEjecutivo: resp.data.autenticarUsuarios.idEjecutivo,
              nombreUsuario: resp.data.autenticarUsuarios.nombreUsuario,
              //TODO poner roles
            });
            setToken(tokenExp, resp.data.autenticarUsuarios.token);
            navigate("/");
          }
        }).catch(error => alert("Credenciales inválidas."));
    }
    /* [setToken]
  ) */;

  async function refresh() {
    // try {
    //     const {
    //       data: { token },
    //     } = await axios.post('auth/refresh', {
    //         token: accessToken.current
    //     });
    //     console.log(token)
    //     setToken(tokenExpiration, token);
    //     //TODO hacer refresh al principio pa coger los datos si no ha expirado
    //     // console.log("hay k hacer refresh al principio")
    // } catch (error) {
    //     clearToken()
    //     setUser(null);
    //     navigate('/login');
    //     console.log(error)
    // }
  }

  return {
    /* register, */
    login,
    logout,
    refresh,
  };
}

export const AuthContainer = createContainer(useAuth);
