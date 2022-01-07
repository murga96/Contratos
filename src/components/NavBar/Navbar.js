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
                    command: () => {navigate.push(`/TiposDocumentos`)},
                },
                {
                    label: 'Monedas',
                    icon: 'pi pi-fw pi-bookmark',
                    command: () => {navigate.push(`/TiposDocumentos`)},
                },
                {
                    label: 'Puertos',
                    icon: 'pi pi-fw pi-bookmark',
                    command: () => {navigate.push(`/TiposDocumentos`)},
                },
                {
                    label: 'Clasificación de documentos',
                    icon: 'pi pi-fw pi-bookmark',
                    command: () => {navigate.push(`/TiposDocumentos`)},
                },
            ]
        },
        {
            label: 'Configuración',
            icon: 'pi pi-fw pi-cog',
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


                 