import React from "react";
import { Navbar } from "../NavBar/Navbar";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  removeSeveralEtapasContratacion,
  removeEtapasContratacion,
  selectAllEtapasContratacion,
  updateEtapasContratacion,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";

export const EtapasContratacion = () => {

  //Table
  const filters = {
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "etapa": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "calculos": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "tiempoMax": { value: null, matchMode: FilterMatchMode.EQUALS },
    "tiempoReal": { value: null, matchMode: FilterMatchMode.EQUALS },
  };
  let c = [
    { field: "etapa", header: "Etapa"},
    { field: "calculos", header: "Cálculo"},
    { field: "tiempoMax", header: "Tiempo Máximo"},
    { field: "tiempoReal", header: "Tiempo Real"},
  ];
  let emptyElement = {"calculos": "", "tiempoMax": "", "tiempoReal": ""}

  //graphQL
  const { data, error, loading } = useQuery(selectAllEtapasContratacion);
  const [updateElement, { loadingU, errorU }] = useMutation(updateEtapasContratacion, {
    refetchQueries: ["selectAllEtapasContratacion"],
  });
  const [removeElement] = useMutation(removeEtapasContratacion, {
    refetchQueries: ["selectAllEtapasContratacion"],
  });
  const [removeSeveralElement] = useMutation(removeSeveralEtapasContratacion, {
    refetchQueries: ["selectAllEtapasContratacion"],
  });
  
  //Form
  //React-hook-form
  const schema = yup.object().shape({
    etapa: yup.string().required("Etapa es requerido"),
    calculos: yup.string(),
    tiempoMax: yup.number().required("Tiempo máximo es requerido").typeError("Tiempo máximo tiene que ser de tipo númerico").integer("Tiempo máximo tiene que ser un número entero")
    .positive("Tiempo máximo tiene que ser un número positivo"),
    tiempoReal: yup.number().required("Tiempo real es requerido").typeError("Tiempo real tiene que ser de tipo númerico").integer("Tiempo real tiene que ser un número entero")
    .positive("Tiempo real tiene que ser un número positivo"),
  });
  
  let dataStruct = [
    {
      id: 1,
      component: "label",
      name: "etapa",
      defaultValue: "Etapa*",
    },
    {
      id: 2,
      component: "InputText",
      name: "etapa",
      defaultValue: "",
    },
    {
      id: 1,
      component: "label",
      name: "calculos",
      defaultValue: "Cálculo",
    },
    {
      id: 2,
      component: "InputText",
      name: "calculos",
      defaultValue: "",
    },
    {
      id: 3,
      component: "label",
      name: "tiempoMax",
      defaultValue: "Tiempo máximo*",
    },
    {
      id: 4,
      component: "InputText",
      name: "tiempoMax",
      defaultValue: "",
    },
    {
      id: 5,
      component: "label",
      name: "tiempoReal",
      defaultValue: "Tiempo real*",
    },
    {
      id: 6,
      component: "InputText",
      name: "tiempoReal",
      defaultValue: "",
    },
  ];
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateElement, "variables": { etapa: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      <Navbar />
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}   
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllEtapasContratacion}
            header="Etapas de Contratación"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="etapa"
            filterDplay="row"
            filtersValues={filters}
            edit={true}
            exportData={true}
            removeOne={ [removeElement, {id: -1}] }
            removeSeveral={ [removeSeveralElement, {id: -1}] }
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

