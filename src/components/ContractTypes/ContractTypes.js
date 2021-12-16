import React, { useEffect, useState } from 'react'
import { Navbar } from '../NavBar/Navbar'
import { useQuery, gql } from "@apollo/client"
import { Table } from '../ui/Table'
import { InputText}  from 'primereact/inputtext'
import { Dialog}  from 'primereact/dialog'
import { FilterMatchMode}  from 'primereact/api'
import { classNames}  from 'primereact/utils'
import * as yup from "yup"
import {yupResolver} from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'primereact/button'

export const ContractTypes = () => {
    const [elementDialog, setElementDialog] = useState(true)
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

    //Form
    //React-hook-form
    const schema = yup.object().shape({
        tipoContrato: yup.string().required("Tipo de contrato es requerido"),
        encabezado: yup.string().required("Encabezado es requerido"),
        ambasPartes: yup.string().required("Ambas partes es requerido"),
    })
    const {handleSubmit, control, formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema),
    })

    const handle = ({tipoContrato, ecnabezado, ambasPartes}) => {
        
    }
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const ElementDialog = (tipoContrato, encabezado, ambasPartes) => {
        return (
            <Dialog visible={elementDialog} style={{ width: '450px' }} header="Detalles" modal className="p-fluid" onHide={() => setElementDialog(false)}>
                    <form onSubmit={handleSubmit(handle)}>
                    <span className="p-float-label">
                    <label htmlFor="tipoContrato" className={classNames({ 'p-error': errors.email }, "block text-900 font-medium mb-2")}>Tipo de contrato*</label>
                        <Controller
                         name="tipoContrato"
                         defaultValue={tipoContrato}
                         control={control}
                         render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field}
                             className={classNames({ 'p-invalid': fieldState.invalid}, "w-full")} />
                        )}
                        />
                     </span>
                     <span className="p-float-label">
                    <label htmlFor="encabezado" className={classNames({ 'p-error': errors.email }, "block text-900 font-medium mb-2")}>Encabezado*</label>
                        <Controller
                         name="encabezado"
                         defaultValue={encabezado}
                         control={control}
                         render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field}
                             className={classNames({ 'p-invalid': fieldState.invalid}, "w-full")} />
                        )}
                        />
                     </span>
                     <span className="p-float-label">
                    <label htmlFor="ambasPartes" className={classNames({ 'p-error': errors.email }, "block text-900 font-medium mb-2")}>Ambas partes*</label>
                        <Controller
                         name="ambasPartes"
                         defaultValue={ambasPartes}
                         control={control}
                         render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field}
                             className={classNames({ 'p-invalid': fieldState.invalid}, "w-full")} />
                        )}
                        />
                     </span>
                     <Button label="Guardar" icon="pi pi-times" className="p-button-text" type="submit"/*  onClick={saveElement}  *//>
                     <Button label="Cancelar" icon="pi pi-check" className="p-button-text" onClick={() => setElementDialog(false)} />
                    </form>
                </Dialog>
        )
    }
    const renderData = (/* tipoContrato, ambasPartes, encabezado */) => {
        return (
            <div>
                <Table value={data.findAllTipoContrato} header="Tipos de Contratos" size="small"
                     columns={c} pagination={true} rowNumbers={[10, 20, 30]} selectionType="multiple"
                     sortRemove orderSort={1} fieldSort="tipoContrato" filterDplay="row" filtersValues={filters}
                     edit={true} exportData={true} /* ElementDialog={ElementDialog(null, null, null)} h1={elementDialog} */ />
                
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
                    renderData()
                ) : console.log("object")
            }        
        </div>
    )
}
