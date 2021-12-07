import React, { useEffect, useState } from 'react'
import { Navbar } from '../NavBar/Navbar'
import { DataTable } from "primereact/datatable"
import { Column } from 'primereact/column'
import { useQuery, gql } from "@apollo/client"
import { Dropdown} from "primereact/dropdown"
import {FilterMatchMode, FilterOperator, locale, addLocale} from "primereact/api"
import { InputText } from 'primereact/inputtext'

export const ContractTypes = () => {
    const [contractTypes, setContractTypes] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'tipoContrato': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'ambasPartes': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'encabezado': { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const textEditor = (options) => {
        return <InputText type="text" className="w-full" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />
    }
    const onRowEditComplete1 = (e) => {
        console.log("object")
    }
    const {data, error, loading} = useQuery(gql`
      query {
        findAllTipoContrato{
          idTipoContrato
        tipoContrato
          encabezado
          ambasPartes
          visible
        }
    }`)
    const header = (<div className="table-header">Tipos de Contratos</div>)
    return (
        <div>
            <Navbar/>
            {
                loading && <h5>Loading...</h5>
                
            }
            {
                error && <h5>{error}</h5>
            }
            {
                !(loading || error) ? (
                    <div className="card mx-3">
                    <DataTable
                     value={data.findAllTipoContrato} /* dataKey="idTipoContrato" */ /* size="small"  */ responsiveLayout="scroll"
                     paginator paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                     currentPageReportTemplate={`{first} - {last} of {totalRecords}`}  className="p-mt-6" 
                     rows={10} rowsPerPageOptions={[10, 20, 30]} 
                     header={header} footer={`Filas: ${data.findAllTipoContrato ? data.findAllTipoContrato.length : 0}`}
                     /* selectionMode="checkbox" */ selection={selectedProduct} onSelectionChange={e => setSelectedProduct(e.value)}
                     removableSort sortField="tipoContrato" sortOrder={1} filterDisplay="row" filters={filters}
                    editMode="row" onRowEditComplete={onRowEditComplete1}>
                    {/* <Column selectionMode="multiple"/> */}
                    {/* <Column field="idTipoContrato" header="idTipoContrato" hidden={true}/> */}
                    <Column field="tipoContrato" header="TipoContrato" /* sortable filter */ editor={(options) => textEditor(options)} />
                    <Column field="encabezado" header="Encabezado" /* sortable filter  */ editor={(options) => textEditor(options)}/>
                    <Column field="ambasPartes" header="Ambas Partes" /* sortable filter */ editor={(options) => textEditor(options)}/>
                    <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}/>
                    </DataTable>
                    </div>
                ) : console.log("object")
            }
            
        </div>
    )
}
