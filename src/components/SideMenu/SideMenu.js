import React from 'react'
import { PanelMenu } from "primereact/panelmenu"

export const SideMenu = () => {
    const sideMenuModel = [
        {
            label: 'Nomencladores',
            icon: 'pi pi-fw pi-bookmark',
            item: [{
                label: 'Nomencladores',
                icon: 'pi pi-fw pi-bookmark',
            }]
        },
    ];

    return (
        <div className="flex flex-column w-2 align-content-left">
            <PanelMenu model= {sideMenuModel}/>
        </div>
    )
}
