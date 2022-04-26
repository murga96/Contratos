import React from "react";
import { useQuery} from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import {
  selectAllBasesGenerales
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router";
import { Button } from "primereact/button";

export const BasesGenerales = () => {
  const navigate = useNavigate()
  const filters = {
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "consecutivo": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "tipoDeContrato.tipoContrato": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "incoterm.abreviatura": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "proveedor.codigo": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "pais.nomb": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "compradores.nombre": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "fecha": { value: null, matchMode: FilterMatchMode.DATE_IS },
  };

  let c = [
    { field: "consecutivo", header: "Consecutivo"},
    { field: "tipoDeContrato.tipoContrato", header: "Tipo de Contrato"},
    { field: "incoterm.abreviatura", header: "Incoterm"},
    { field: "proveedor.codigo", header: "Proveedor"},
    { field: "pais.nomb", header: "País"},
    { field: "compradores.nombre", header: "Comprador"},
    { field: "fecha", header: "Fecha", type: "date"},
  ];
  let emptyElement = {"consecutivo": "", "tipoDeContrato.tipoContrato": "", "incoterm.abreviatura": "", "proveedor.codigo": "", "pais.pais": "",
                       "compradores.nombre": "", "fecha": ""}

  //graphQL
  const { data, error, loading } = useQuery(selectAllBasesGenerales);
  return (
    <div>
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}   
      {error && <h5>{error}</h5>}
      {!(loading || error) ? (
        <div>
          <Table
            value={data?.findAllBasesGenerales}
            header="Bases Generales"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="single"
            sortRemove
            orderSort={1}
            fieldSort="consecutivo"
            filterDplay="row"
            filtersValues={filters}
            edit={true}
            exportData={true}
            emptyElement={emptyElement}
            additionalButtons={[[<Button icon="pi pi-eye" className="p-button-rounded p-button-text" data-pr-tooltip="Ver"/>, (rowData) => navigate(`/BasesGenerales/Detalle/${rowData.idBasesGenerales}`)]]}
            editLinks={["Add","Edit"]}
          />
        </div>
      ) : (
        //poner cargar
        undefined
      )}
    </div>
  );
};
