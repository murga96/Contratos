import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { MenuModel } from './Menu';
import logo from "../../assets/images/contrato.png"

const end = () => {
    return(
        //TODO Poner usuario
        <div className="flex">
            <i className="pi pi-user mr-2"/>
            <div className="p-text-left">gustavo.murga1996</div>
        </div>
    )
} 

export const Navbar = () => {    
    
    const start = <img alt="logo" src={logo} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} height="40" className="p-mr-2"></img>;
    return (
        <div>
            <div className="card">
                <Menubar model={MenuModel} start={start} end={end}/>
            </div>
        </div>
    );
}


                 