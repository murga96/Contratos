import { onClickTipoContratos } from '../../database/dbOps';

export const MenuModel = [
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
                    command: onClickTipoContratos,
                },
                {
                    label: 'Tipos de Clausulas',
                    icon: 'pi pi-fw pi-bookmark'
                },
                {
                    label: 'Tipos de Documentos',
                    icon: 'pi pi-fw pi-bookmark'
                },
                {
                    label: 'Cargos',
                    icon: 'pi pi-fw pi-bookmark'
                },
                {
                    label: 'Ejecutivos',
                    icon: 'pi pi-fw pi-bookmark'
                },
                {
                    label: 'Incoterms',
                    icon: 'pi pi-fw pi-bookmark'
                },
                {
                    label: 'Monedas',
                    icon: 'pi pi-fw pi-bookmark'
                },
                {
                    label: 'Puertos',
                    icon: 'pi pi-fw pi-bookmark'
                },
                {
                    label: 'Clasificación de documentos',
                    icon: 'pi pi-fw pi-bookmark'
                },
            ]
        },
        {
            label: 'Configuración',
            icon: 'pi pi-fw pi-cog',
        },
    ];
