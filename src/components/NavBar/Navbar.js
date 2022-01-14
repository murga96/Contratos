import React from 'react';
import { Menubar } from 'primereact/menubar';
import logo from "../../assets/images/contrato.png"
import { useHistory } from 'react-router';

const end = () => {
    return(
        //TODO Poner usuario
        <div className="flex">
            <i className="pi pi-user mr-2"/>
            <div className="p-text-left">gustavo.murga1996</div>
        </div>
    )
} 

export const Navbar = (url) => {
    const navigate = useHistory()
    const MenuModel = [
        {
            label: 'Bases Generales',
            icon: 'pi pi-fw pi-bookmark',
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


                 