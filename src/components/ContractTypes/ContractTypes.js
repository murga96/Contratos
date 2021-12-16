import React, { useEffect, useState } from 'react'
import { Navbar } from '../NavBar/Navbar'
import { useQuery, gql } from "@apollo/client"
import { Table } from '../ui/Table'
import { InputText}  from 'primereact/inputtext'
import { FilterMatchMode}  from 'primereact/api'

export const ContractTypes = () => {
    const filters = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      tipoContrato: { value: null, matchMode: FilterMatchMode.CONTAINS },
      ambasPartes: { value: null, matchMode: FilterMatchMode.CONTAINS },
      encabezado: { value: null, matchMode: FilterMatchMode.CONTAINS },
    }
    let c = [
        {field: "tipoContrato", header: "Tipo Contrato"},
        {field: "ambasPartes", header: "Ambas partes"},
        {field: "encabezado", header: "Encabezado"},
    ]
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
    const Form = () => {
        return (
            <div>
                <span className="p-float-label">
                    <InputText id="username" /* value={value2} onChange={(e) => setValue2(e.target.value)} */ />
                    <label htmlFor="username">Username</label>
                </span>
                <h5>Form</h5>
            </div>
        )
    }

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
                    <Table value={data.findAllTipoContrato} header="Tipos de Contratos" size="small"
                     columns={c} pagination={true} rowNumbers={[10, 20, 30]} selectionType="multiple"
                     sortRemove orderSort={1} fieldSort="tipoContrato" filterDplay="row" filtersValues={filters}
                     edit={true} Form={Form} exportData={true}/>
                ) : console.log("object")
            }        
        </div>
    )
}
