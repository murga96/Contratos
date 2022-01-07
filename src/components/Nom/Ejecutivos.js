import React from "react";
import { Navbar } from "../NavBar/Navbar";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  removeSeveralEjecutivo,
  removeEjecutivo,
  selectAllEjecutivos,
  updateEjecutivo,
  selectAllCargo,
  selectAllGrupos,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from 'primereact/progressspinner';

export const Ejecutivos = () => {

  //Table
  const filters = {
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "nombre": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "correo": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "cargo.cargo": { value: null, matchMode: FilterMatchMode.CONTAINS },
    // "grupo.grupos": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "activo": { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let c = [
    { field: "nombre", header: "Nombre"},
    { field: "correo", header: "Correo"},
    { field: "cargo.cargo", header: "Cargo"},
    // { field: "grupo.grupos", header: "Grupo"},
    { field: "activo", header: "Activo"},
  ];
  let emptyElement = {"nombre": "", "cargo": ""/* , "grupo": ""*/,  "activo": false}

  //graphQL
  const { data, error, loading } = useQuery(selectAllEjecutivos);
  const [updateTC, { loadingU, errorU }] = useMutation(updateEjecutivo, {
    refetchQueries: ["selectAllEjecutivos"],
  });
  const [removeTC] = useMutation(removeEjecutivo, {
    refetchQueries: ["selectAllEjecutivos"],
  });
  const [removeSeverTC] = useMutation(removeSeveralEjecutivo, {
    refetchQueries: ["selectAllEjecutivos"],
  });
  const cargos = useQuery(selectAllCargo);
  const grupos = useQuery(selectAllGrupos);

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    nombre: yup.string().required("Nombre es requerido"),
    cargo: yup.object(),
    // grupo: yup.string().required("Grupo es requerido"),
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
      name: "cargo",
      defaultValue: "Cargo",
    },
    {
      id: 4,
      component: "Dropdown",
      name: "cargo",
      defaultValue: "",
      props: {options: cargos.data?.findAllCargos,  optionLabel: "cargo", placeholder: "Selecciona un cargo"}
    },
    {
      id: 5,
      component: "label",
      name: "grupo",
      defaultValue: "Grupo",
    },
    {
        id: 6,
        component: "Dropdown",
        name: "grupo",
        defaultValue: "",
        props: {options: grupos.data?.findAllGrupos,  optionLabel: "grupos", placeholder: "Selecciona un grupo"}
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
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateTC, "variables": { ejecutivo: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      <Navbar />
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}      
      {error && <h5 style={{margin: "100px"}}>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data.findAllEjecutivos}
            header="Ejecutivos"
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

