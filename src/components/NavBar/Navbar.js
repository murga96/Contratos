import React, { useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import logo from "../../assets/images/contrato.png"
import { useHistory } from 'react-router';
import { useStateValue } from '../../StateProvider';
import { Button } from 'primereact/button';

export const Navbar = (url) => {
    const [ {user}, dispatch] = useStateValue()
    const navigate = useHistory()
    const menuUserRef = useRef(null)
    const MenuModel = [
        {
            label: 'Bases Generales',
            icon: 'pi pi-fw pi-bookmark',
            command: () => {navigate.push(`/BasesGenerales`)},
        },
        {
            label: 'Contratos',
            icon: 'pi pi-fw pi-bookmark',
        },
        {
            label: 'Facturas',
            icon: 'pi pi-fw pi-bookmark',
        },
        {
            label: 'Nomencladores',
            icon: 'pi pi-fw pi-bookmark',
            items: [
                {
                    label: 'Clasificaciones',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Tipos de Contratos',
                            icon: 'pi pi-fw pi-bookmark',
                            command: () => {navigate.push(`/TiposContratos`)},
                        },
                        {
                            label: 'Tipos de Clausulas',
                            icon: 'pi pi-fw pi-bookmark',
                            command: () => {navigate.push(`/TiposClausulas`)},
                        },
                        {
                            label: 'Tipos de Documentos',
                            icon: 'pi pi-fw pi-bookmark',
                            command: () => {navigate.push(`/TiposDocumentos`)},
                        },
                        {
                            label: 'Tipos de Compras',
                            icon: 'pi pi-fw pi-bookmark',
                            command: () => {navigate.push(`/TiposCompras`)},
                        },
                        {
                            label: 'Tipos de Contenedores',
                            icon: 'pi pi-fw pi-bookmark',
                            command: () => {navigate.push(`/TiposContenedores`)},
                        },
                    ]
                },
                {
                    label: 'Formas',
                    icon: 'pi pi-fw pi-bookmark',
                   items: [
                    {
                        label: 'Formas de pago',
                        icon: 'pi pi-fw pi-bookmark',
                        command: () => {navigate.push(`/FormasPago`)},
                    },
                    {
                        label: 'Formas de entrega',
                        icon: 'pi pi-fw pi-bookmark',
                        command: () => {navigate.push(`/FormasEntrega`)},
                    },
                   ],
                },
                {
                    label: 'Grupos de compra',
                    icon: 'pi pi-fw pi-bookmark',
                    command: () => {navigate.push(`/GruposCompra`)},
                },
                
                {
                    label: 'Etapas de contratación',
                    icon: 'pi pi-fw pi-bookmark',
                    command: () => {navigate.push(`/EtapasContratacion`)},
                },
                {
                    label: 'Cargos',
                    icon: 'pi pi-fw pi-bookmark',
                    command: () => {navigate.push(`/Cargos`)},
                },
                {
                    label: 'Ejecutivos',
                    icon: 'pi pi-fw pi-bookmark',
                    command: () => {navigate.push(`/Ejecutivos`)},
                },
                {
                    label: 'Incoterms',
                    icon: 'pi pi-fw pi-bookmark',
                    command: () => {navigate.push(`/Incoterms`)},
                },
                {
                    label: 'Monedas',
                    icon: 'pi pi-fw pi-bookmark',
                    command: () => {navigate.push(`/Monedas`)},
                },
                {
                    label: 'Puertos',
                    icon: 'pi pi-fw pi-bookmark',
                    command: () => {navigate.push(`/Puertos`)},
                },
            ]
        },
        {
            label: 'Configuración',
            icon: 'pi pi-fw pi-cog',
            items:[
                {
                    label: 'Usuarios',
                    icon: 'pi pi-fw pi-bookmark',
                    command: () => {navigate.push(`/Usuarios`)},
                },
            ],
        },
    ];
    const menuUser = [
        {
            label: "Cambiar contraseña",
            icon: 'pi pi-key',
            command: () => {navigate.push(`/CambiarContraseña`)},
        }
    ]
    const end = () => {
        console.log(user, "user")
        return(
            //TODO Poner usuario en el almacenamiento local
            <div className="flex align-items-center">
                <Menu model={menuUser} ref={menuUserRef} popup/>
                <Button  className="p-button-sm p-button-rounded p-button-text" icon="pi pi-user" onClick={(event) => menuUserRef.current.toggle(event)}/>
                {/* <i className="pi pi-user mr-2" onClick={() => navigate.push()}/> */}
                <div className="flex p-text-left">{user?.nombreUsuario}</div>
            </div>
        )
    } 
    //TODO
    // let start = null;
    // <Link to="/">
        const start = <img alt="logo" src={logo} height="40" className="mr-2"></img>;
    // </Link>   
    return (
        <div>
            <div className="card mb-6">
                <Menubar model={MenuModel} start={start} end={end}/>
            </div>
        </div>
    );
}


                 