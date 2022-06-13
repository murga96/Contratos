import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fireError } from "../utils";
import {roles_pages, unathourized_pages} from "./RolesPages";

export const AuthenticateRoute = ({ component: Component, path }) => {
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("user")) && !unathourized_pages.includes(path)) {
      fireError("El usuario no se encuentra autenticado para acceder a la página");
      navigate("/inicio");
    } else if (
      !roles_pages[
        JSON.parse(localStorage.getItem("user"))?.rol
      ]?.includes(path)
    ) {
      fireError("El rol del usuario no tiene permisos para acceder a la página");
      navigate(-1);
    }
  });

  return JSON.parse(localStorage.getItem("user")) || unathourized_pages.includes(path) ? <Component /> : <></>;
};

export const havePermissionNavBar = (role, navBarItem) => {
  //chequeo que la pagina se puede acceder sin autenticarse
  if(unathourized_pages.includes("/" + navBarItem)) return true 
  if (roles_pages[role]?.includes("/" + navBarItem)) return true;
  else return false;
};
