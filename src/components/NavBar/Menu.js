import { onClickTipoContratos } from '../../Database/dbOps';

export const MenuModel = [
        {
            label: 'Nomencladores',
            icon: 'pi pi-fw pi-bookmark',
            items: [
                {
                    label: 'Tipos de Contratos',
                    icon: 'pi pi-fw pi-bookmark',
                    command: onClickTipoContratos,
                },
                {
                    label: 'Clausulas',
                    icon: 'pi pi-fw pi-video'
                },
            ]
        },
    ];
