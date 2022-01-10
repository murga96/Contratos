import React from "react";
import { Navbar } from "../NavBar/Navbar";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  updatePuerto,
  selectAllPuertos,
  removePuerto,
  removeSeveralPuerto,
  selectAllPaises,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from 'primereact/progressspinner';

export const Puertos = () => {

  //Table
  const filters = {
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "nombre": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "pais.nomb": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "deposito": { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let c = [
    { field: "nombre", header: "Nombre"},
    { field: "pais.nomb", header: "País"},
    { field: "deposito", header: "Depósito"},
  ];
  let emptyElement = {"nombre": "", "pais": "", "deposito": ""}

  //graphQL
  const { data, error, loading } = useQuery(selectAllPuertos);
  const [updateTC, { loadingU, errorU }] = useMutation(updatePuerto, {
    refetchQueries: ["selectAllPuertos"],
  });
  const [removeTC] = useMutation(removePuerto, {
    refetchQueries: ["selectAllPuertos"],
  });
  const [removeSeverTC] = useMutation(removeSeveralPuerto, {
    refetchQueries: ["selectAllPuertos"],
  });

  const paises = useQuery(selectAllPaises);

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    nombre: yup.string().required("Nombre es requerido"),
    idPais: yup.number().required("País es requerido"),
    deposito: yup.string()/* .required("Depósito es requerido") */,
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
        name: "idPais",
        defaultValue: "País*",
      },
      {
        id: 4,
        component: "Dropdown",
        name: "idPais",
        defaultValue: "",
        props: {options: paises.data?.findAllPaises,  optionLabel: "nomb", optionValue: "pais", placeholder: "Seleccione un país"}

      },
    {
      id: 5,
      component: "label",
      name: "deposito",
      defaultValue: "Depósito",
    },
    {
      id: 6,
      component: "InputText",
      name: "deposito",
      defaultValue: "",
    },
  ];
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateTC, "variables": { puerto: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      <Navbar />
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}      
      {error && <h5 style={{margin: "100px"}}>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllPuertos}
            header="Puertos"
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

