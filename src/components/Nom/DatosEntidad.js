import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Table } from "../ui/Table";
import * as yup from "yup";
import {
  createDatosEntidad,
  removeDatosEntidad,
  removeSeveralDatosEntidad,
  selectAllDatosEntidades,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";

export const DatosEntidad = () => {
  //Table
  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    codigo: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    codigo: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    nombre: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    compaIa: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    agenciaUsd: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    codAgenciaUsd: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    cuentaUsd: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    faxAgenciaUsd: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    agenciaMn: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    codAgenciaMn: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    cuentaMn: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    faxAgenciaMn: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    codigoEnt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    codigoMincex: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    licCComercio: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
  };
  let c = [
    { field: "codigo", header: "Código" },
    { field: "nombre", header: "Nombre" },
    { field: "compaIa", header: "Compañía" },
    { field: "agenciaUsd", header: "Agencia USD" },
    { field: "codAgenciaUsd", header: "Sucursal USD" },
    { field: "cuentaUsd", header: "Cuenta USD" },
    { field: "faxAgenciaUsd", header: "Fax USD" },
    { field: "agenciaMn", header: "Agencia MN" },
    { field: "codAgenciaMn", header: "Sucursal MN" },
    { field: "cuentaMn", header: "Cuenta MN" },
    { field: "faxAgenciaMn", header: "Fax MN" },
    { field: "codigoEnt", header: "Código REEUP" },
    { field: "codigoMincex", header: "Código NIT" },
    { field: "licCComercio", header: "Licencia comercio" },
  ];
  let emptyElement = {
    codigo: -1,
    nombre: "",
    compaIa: "",
    codigo: "",
    agenciaUsd: "",
    codAgenciaUsd: "",
    cuentaUsd: "",
    faxAgenciaUsd: "",
    agenciaMn: "",
    codAgenciaMn: "",
    cuentaMn: "",
    faxAgenciaMn: "",
    codigoEnt: "",
    codigoMincex: "",
    licCComercio: "",
  };

  //graphQL
  const { data, error, loading } = useQuery(selectAllDatosEntidades);
  const [updateElement, { loadingU, errorU }] = useMutation(
    createDatosEntidad,
    {
      refetchQueries: ["findAllDatosEntidad"],
    }
  );
  const [removeElement] = useMutation(removeDatosEntidad, {
    refetchQueries: ["findAllDatosEntidad"],
  });
  const [removeSeveralElement] = useMutation(removeSeveralDatosEntidad, {
    refetchQueries: ["findAllDatosEntidad"],
  });

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    codigo: yup.number().required("Código es requerido"),
    nombre: yup.string().required("Nombre es requerido"),
    compaIa: yup.string().required("Compañía es requerido"),
    cuentaUsd: yup.string().required("Cuenta USD es requerido"),
    codAgenciaUsd: yup.string().required("Código USD es requerido"),
    agenciaUsd: yup.string().required("Agencia USD es requerido"),
    faxAgenciaUsd: yup.string().required("Fax USD es requerido"),
    cuentaMn: yup.string().required("Cuenta MN es requerido"),
    codAgenciaMn: yup.string().required("Sucursal MN es requerido"),
    agenciaMn: yup.string().required("Agencia MN es requerido"),
    faxAgenciaMn: yup.string().required("Fax MN es requerido"),
    codigoEnt: yup.string().required("Código REEUP es requerido"),
    codigoMincex: yup.string().required("Código NIT es requerido"),
    licCComercio: yup.string().required("Licencia comercio es requerido"),
  });

  let dataStruct = [
    {
      id: 1,
      component: "InputNumber",
      name: "codigo",
      label: "Código*",
      defaultValue: "",
      props: {
        showButtons: true,
        min: 1,
        allowEmpty: false,
        step: 1,
        type: "int",
      },
    },
    {
      id: 1,
      component: "InputText",
      name: "nombre",
      label: "Nombre*",
      defaultValue: "",
    },
    {
      id: 2,
      component: "InputText",
      label: "Compañía*",
      name: "compaIa",
      defaultValue: "",
    },
    {
      id: 2,
      component: "InputText",
      label: "Agencia USD*",
      name: "agenciaUsd",
      defaultValue: "",
    },
    {
      id: 2,
      component: "InputText",
      label: "Sucursal USD*",
      name: "codAgenciaUsd",
      defaultValue: "",
    },
    {
      id: 2,
      component: "InputText",
      label: "Cuenta USD*",
      name: "cuentaUsd",
      defaultValue: "",
    },
    {
      id: 2,
      component: "InputText",
      label: "Fax USD*",
      name: "faxAgenciaUsd",
      defaultValue: "",
    },
    {
      id: 2,
      component: "InputText",
      label: "Agencia MN*",
      name: "agenciaMn",
      defaultValue: "",
    },
    {
      id: 2,
      component: "InputText",
      label: "Sucursal MN*",
      name: "codAgenciaMn",
      defaultValue: "",
    },
    {
      id: 2,
      component: "InputText",
      label: "Cuenta MN*",
      name: "cuentaMn",
      defaultValue: "",
    },
    {
      id: 2,
      component: "InputText",
      label: "Fax MN*",
      name: "faxAgenciaMn",
      defaultValue: "",
    },
    {
      id: 2,
      component: "InputText",
      label: "Código REEUP*",
      name: "codigoEnt",
      defaultValue: "",
    },
    {
      id: 2,
      component: "InputText",
      label: "Código NIT*",
      name: "codigoMincex",
      defaultValue: "",
    },
    {
      id: 2,
      component: "InputText",
      label: "Licencia comercio*",
      name: "licCComercio",
      defaultValue: "",
    },
  ];
  const formProps = {
    data: dataStruct,
    schema: schema,
    handle: updateElement,
    variables: { createDatosEntidadInput: {} },
    buttonsNames: ["Guardar", "Cancelar"],
  };
  return (
    <div>
      {loading && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllDatosEntidad}
            header="Datos de Entidad"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="nombre"
            filterDplay="menu"
            filtersValues={filters}
            edit={true}
            exportData={true}
            removeOne={[removeElement, { id: -1 }]}
            removeSeveral={[removeSeveralElement, { id: -1 }]}
            formProps={formProps}
            emptyElement={emptyElement}
          />
        </div>
      ) : //poner cargar
      undefined}
    </div>
  );
};
