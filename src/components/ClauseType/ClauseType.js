import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  removeSeveralTiposDeClausulas,
  removeTiposDeClausulas,
  selectAllTiposDeClausulas,
  updateTiposDeClausulas,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";

export const ClauseTypes = () => {

  //Table
  const filters = {
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "nombre": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "orden": { value: null, matchMode: FilterMatchMode.EQUALS },
    "basesG": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "compras": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "cMarco": { value: null, matchMode: FilterMatchMode.EQUALS },
    "excepcional": { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let c = [
    { field: "nombre", header: "Nombre"},
    { field: "orden", header: "Orden"},
    { field: "basesG", header: "Bases Generales"},
    { field: "compras", header: "Compras"},
    { field: "cMarco", header: "Contrato Marco"},
    { field: "excepcional", header: "Excepcional"},
  ];
  let emptyElement = {"nombre": "", "orden": "", "basesG": false, "compras": false, "cMarco": false, "excepcional": false}

  //graphQL
  const { data, error, loading } = useQuery(selectAllTiposDeClausulas);
  const [updateTC, { loadingU, errorU }] = useMutation(updateTiposDeClausulas, {
    refetchQueries: ["selectAllTiposDeClausulas"],
  });
  const [removeTC] = useMutation(removeTiposDeClausulas, {
    refetchQueries: ["selectAllTiposDeClausulas"],
  });
  const [removeSeverTC] = useMutation(removeSeveralTiposDeClausulas, {
    refetchQueries: ["selectAllTiposDeClausulas"],
  });

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    nombre: yup.string().required("Nombre es requerido"),
    orden: yup.number().required("Orden es requerido").typeError("Orden tiene que ser de tipo númerico").integer("Orden tiene que ser un número entero")
                      .positive("Orden tiene que ser un número positivo"),
    basesG: yup.bool(),
    compras: yup.bool(),
    cMarco: yup.bool(),
    excepcional: yup.bool()
  });
  
  let dataStruct = [
    {
      id: 1,
      component: "label",
      name: "nombre",
      defaultValue: "Nombre*",
    },
    {
      id: 2,
      component: "InputText",
      name: "nombre",
      defaultValue: "",
    },
    {
      id: 3,
      component: "label",
      name: "orden",
      defaultValue: "Orden*",
    },
    {
      id: 4,
      component: "InputText",
      name: "orden",
      defaultValue: "",
    },
    {
      id: 5,
      component: "label",
      name: "basesG",
      defaultValue: "Bases Generales",
    },
    {
      id: 6,
      component: "CheckBox",
      name: "basesG",
      defaultValue: "",
    },
    {
      id: 7,
      component: "label",
      name: "compras",
      defaultValue: "Compras",
    },
    {
      id: 8,
      component: "CheckBox",
      name: "compras",
      defaultValue: "",
    },
    {
      id: 9,
      component: "label",
      name: "cMarco",
      defaultValue: "Contrato Marco",
    },
    {
      id: 10,
      component: "CheckBox",
      name: "cMarco",
      defaultValue: "",
    },
    {
      id: 11,
      component: "label",
      name: "excepcional",
      defaultValue: "Excepcional",
    },
    {
      id: 12,
      component: "CheckBox",
      name: "excepcional",
      defaultValue: "",
    },
  ];
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateTC, "variables": { tipoClausula: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}   
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllTiposDeClausulas}
            header="Tipos de Claúsulas"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="nombre"
            filterDplay="row"
            filtersValues={filters}
            edit={true}
            exportData={true}
            removeOne={ [removeTC, {id: -1}] }
            removeSeveral={ [removeSeverTC, {id: -1}] }
            formProps={formProps}
            emptyElement={emptyElement}
          />
        </div>
      ) : (
        //poner cargar
        undefined
      )}
    </div>
  );
};

