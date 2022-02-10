import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  removeSeveralIncoterm,
  removeIncoterm,
  selectAllIncoterm,
  updateIncoterm,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from 'primereact/progressspinner';

export const Incoterms = () => {

  //Table
  const filters = {
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "nombre": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "abreviatura": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "nota": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "activo": { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let c = [
    { field: "nombre", header: "Nombre"},
    { field: "abreviatura", header: "Abreviatura"},
    { field: "nota", header: "Nota"},
    { field: "activo", header: "Activo"},
  ];
  let emptyElement = {"nombre": "", "abreviatura": "", "nota": "",  "activo": false}

  //graphQL
  const { data, error, loading } = useQuery(selectAllIncoterm);
  const [updateTC, { loadingU, errorU }] = useMutation(updateIncoterm, {
    refetchQueries: ["selectAllIncoterm"],
  });
  const [removeTC] = useMutation(removeIncoterm, {
    refetchQueries: ["selectAllIncoterm"],
  });
  const [removeSeverTC] = useMutation(removeSeveralIncoterm, {
    refetchQueries: ["selectAllIncoterm"],
  });

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    nombre: yup.string().required("Nombre es requerido"),
    abreviatura: yup.string().required("Abreviatura es requerido"),
    nota: yup.string().required("Nota es requerido"),
    activo: yup.bool(),
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
      name: "abreviatura",
      defaultValue: "abreviatura*",
    },
    {
      id: 4,
      component: "InputText",
      name: "abreviatura",
      defaultValue: "",
    },
    {
      id: 5,
      component: "label",
      name: "nota",
      defaultValue: "Nota*",
    },
    {
      id: 6,
      component: "InputText",
      name: "nota",
      defaultValue: "",
    },
    {
      id: 7,
      component: "label",
      name: "activo",
      defaultValue: "Activo",
    },
    {
      id: 8,
      component: "CheckBox",
      name: "activo",
      defaultValue: "",
    },
  ];
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateTC, "variables": { incoterm: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}      
      {error && <h5 style={{margin: "100px"}}>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllIncoterm}
            header="Incoterms"
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

