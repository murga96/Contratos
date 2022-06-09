import React, { useRef, useState } from "react";
import { Menubar } from "primereact/menubar";
import { Menu } from "primereact/menu";
import logo from "../../assets/images/contrato.png";
import { useNavigate, Link } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { Button } from "primereact/button";
import { Icon } from "@iconify/react";
import { AuthContainer } from "../User/AuthContainer";
import { havePermissionNavBar } from "../User/ProtectedRoute";
import { has } from "lodash";

export const Navbar = (url) => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const { logout } = AuthContainer.useContainer();
  const navigate = useNavigate();
  const menuUserRef = useRef(null);
  const menuTemplate = (item, options, arrow) => {
    return (
      <a
        className={options.className}
        target={item.target}
        onClick={options.onClick}
      >
        {item.icon && item.icon}
        <span className={options.labelClassName}>{item.label}</span>
        {arrow ? (
          <Icon
            icon="ep:arrow-down"
            vAlign="bottom"
            style={{ fontSize: "20px", marginLeft: "0.5rem" }}
          />
        ) : undefined}
      </a>
    );
  };
  let MenuModel = [
    havePermissionNavBar(user?.rol, "BasesGenerales") && {
      label: "Bases Generales",
      icon: "pi pi-fw pi-bookmark",
      command: () => {
        navigate(`/BasesGenerales`);
      },
    },
    havePermissionNavBar(user?.rol, "Contratos") && {
      label: "Contratos",
      icon: "pi pi-fw pi-bookmark",
    },
    havePermissionNavBar(user?.rol, "Facturas") && {
      label: "Facturas",
      icon: "pi pi-fw pi-bookmark",
    },
    {
      label: "Nomencladores",
      icon: "pi pi-fw pi-bookmark",
      items: [
        {
          label: "Clasificaciones",
          icon: "pi pi-fw pi-bookmark",
          items: [
            havePermissionNavBar(user?.rol, "TiposContratos") && {
              label: "Tipos de Contratos",
              icon: "pi pi-fw pi-bookmark",
              command: () => {
                navigate(`/TiposContratos`);
              },
            },
            {
              label: "Tipos de Clausulas",
              icon: "pi pi-fw pi-bookmark",
              command: () => {
                navigate(`/TiposClausulas`);
              },
            },
            {
              label: "Tipos de Documentos",
              icon: "pi pi-fw pi-bookmark",
              command: () => {
                navigate(`/TiposDocumentos`);
              },
            },
            {
              label: "Tipos de Compras",
              icon: "pi pi-fw pi-bookmark",
              command: () => {
                navigate(`/TiposCompras`);
              },
            },
            {
              label: "Tipos de Contenedores",
              icon: "pi pi-fw pi-bookmark",
              command: () => {
                navigate(`/TiposContenedores`);
              },
            },
          ],
        },
        {
          label: "Formas",
          icon: "pi pi-fw pi-bookmark",
          items: [
            havePermissionNavBar(user?.rol, "FormasPago") &&{
              label: "Formas de pago",
              icon: "pi pi-fw pi-bookmark",
              command: () => {
                navigate(`/FormasPago`);
              },
            },
            havePermissionNavBar(user?.rol, "FormasEntrega") &&{
              label: "Formas de entrega",
              icon: "pi pi-fw pi-bookmark",
              command: () => {
                navigate(`/FormasEntrega`);
              },
            },
          ],
        },
        {
          label: "Proformas",
          icon: "pi pi-fw pi-bookmark",
          items: [
            havePermissionNavBar(user?.rol, "Proformas") &&{
              label: "Proformas",
              icon: "pi pi-fw pi-bookmark",
              command: () => {
                navigate(`/Proformas`);
              },
            },
            havePermissionNavBar(user?.rol, "ProformasClausulas") &&{
              label: "Clausulas de proformas",
              icon: "pi pi-fw pi-bookmark",
              command: () => {
                navigate(`/ProformasClausulas`);
              },
            },
          ],
        },
        havePermissionNavBar(user?.rol, "GruposCompra") && {
          label: "Grupos de compra",
          icon: "pi pi-fw pi-bookmark",
          command: () => {
            navigate(`/GruposCompra`);
          },
        },
        havePermissionNavBar(user?.rol, "EtapasContratacion") && {
          label: "Etapas de contratación",
          icon: "pi pi-fw pi-bookmark",
          command: () => {
            navigate(`/EtapasContratacion`);
          },
        },
        havePermissionNavBar(user?.rol, "Cargos") && {
          label: "Cargos",
          icon: "pi pi-fw pi-bookmark",
          command: () => {
            navigate(`/Cargos`);
          },
        },
        havePermissionNavBar(user?.rol, "Ejecutivos") && {
          label: "Ejecutivos",
          icon: "pi pi-fw pi-bookmark",
          command: () => {
            navigate(`/Ejecutivos`);
          },
        },
        havePermissionNavBar(user?.rol, "Compradores") && {
          label: "Compradores",
          icon: "pi pi-fw pi-bookmark",
          command: () => {
            navigate(`/Compradores`);
          },
        },
        havePermissionNavBar(user?.rol, "Incoterms") && {
          label: "Incoterms",
          icon: "pi pi-fw pi-bookmark",
          command: () => {
            navigate(`/Incoterms`);
          },
        },
        havePermissionNavBar(user?.rol, "Monedas") && {
          label: "Monedas",
          icon: "pi pi-fw pi-bookmark",
          command: () => {
            navigate(`/Monedas`);
          },
        },
        havePermissionNavBar(user?.rol, "Puertos") && {
          label: "Puertos",
          icon: "pi pi-fw pi-bookmark",
          command: () => {
            navigate(`/Puertos`);
          },
        },
      ],
    },
    {
      label: "Configuración",
      icon: "pi pi-fw pi-cog",
      items: [
        havePermissionNavBar(user?.rol, "Usuarios") && {
          label: "Usuarios",
          icon: "pi pi-fw pi-bookmark",
          command: () => {
            navigate(`/Usuarios`);
          },
        },
      ],
    },
  ];
  const menuUser = [
    {
      label: "Contraseña",
      command: () => {
        navigate(`/CambiarContrasenna`);
      },
      icon: (
        <Icon
          icon="carbon:password"
          style={{ fontSize: "24px", marginRight: "0.5rem" }}
        />
      ),
      template: (item, options) => menuTemplate(item, options),
    },
    {
      label: user ? "Salir" : "Entrar",
      command: () => {
        if (user) {
          logout();
        } else {
          navigate(`/inicio`);
        }
      },
      icon: (
        <Icon
          icon={user ? "carbon:logout" : "carbon:login"}
          style={{ fontSize: "24px", marginRight: "0.5rem" }}
        />
      ),
      template: (item, options) => menuTemplate(item, options),
    },
  ];
  const end = () => {
    if (user && menuUser.length === 2) {
      menuUser.unshift({
        separator: true,
      });
      menuUser.unshift({
        label: user.nombreUsuario,
        className: "flex justify-content-center text-pink-900",
        icon: (
          <Icon
            icon="la:user-check"
            style={{ fontSize: "24px", marginRight: "0.5rem" }}
          />
        ),
        template: (item, options) => menuTemplate(item, options),
      });
    }
    return (
      <div className="flex align-items-center menu-end">
        <Menu model={menuUser} ref={menuUserRef} popup />
        <Button
          className="p-button p-button-rounded p-button-text text-700"
          icon="pi pi-user"
          onClick={(event) => menuUserRef.current.toggle(event)}
        />
        <i
          className="pi pi-chevron-down text-700"
          onClick={(event) => menuUserRef.current.toggle(event)}
        />
      </div>
    );
  };
  const start = () => {
    return (
      <Link to="/">
        <img
          alt="logo"
          src={logo}
          height="40"
          className="mr-2"
          onClick={() => navigate("/")}
        ></img>
      </Link>
    );
  };
  
  const recursiveMenuCheck = (item) => {
    if (Object.keys(item).includes("items")/* has(item, "items") */) {
        item.items = item.items.filter((i) => i);
        item.items.forEach( (i) => recursiveMenuCheck(i))      
    }else {
        return ;
    }
  }

  //setting permissions
  const checkPermissionsNavBar = () => {
      //eliminar los falsos primer nivel
      MenuModel = MenuModel.filter((item) => item);
      MenuModel = MenuModel.map((item) => {
          recursiveMenuCheck(item)
          if(item.items?.length === 0) item = false
          MenuModel = MenuModel.filter((item) => item);
          return item
        });
  };
  checkPermissionsNavBar();

  return (
    <div>
      <div className="card mb-6">
        <Menubar model={MenuModel} start={start} end={end} />
      </div>
    </div>
  );
};
