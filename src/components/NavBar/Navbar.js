import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { MenuModel } from './Menu';


export const Navbar = () => {    
    const start = <img alt="logo" src="showcase/images/logo.png" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} height="40" className="p-mr-2"></img>;
    const end = <InputText placeholder="Search" type="text" />;
    return (
        <div>
            <div className="card">
                <Menubar model={MenuModel} start={start} end={end}/>
            </div>
        </div>
    );
}


                 