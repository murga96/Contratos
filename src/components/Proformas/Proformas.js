import React from "react";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode, FilterService, FilterOperator } from "primereact/api";
import {
  selectAllProforma,
  selectAllIncoterm,
  selectAllTipoContrato,
  removeProforma,
  removeSeveralProforma,
  createProforma,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import moment from "moment";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import * as yup from "yup"

export const Proformas = () => {
  const navigate = useNavigate();
  const [proformas, setProformas] = useState([]);

  //graphQL
  const { data, error, loading } = useQuery(selectAllProforma, {
    onCompleted: (data) => {
      setProformas(JSON.parse(JSON.stringify(data?.findAllProforma)));
    },
    // onError: (error) => console.log(error),
    fetchPolicy: "network-only",
  });
  const [updateProforma] = useMutation(createProforma, {
    refetchQueries: ["selectAllProforma"],
  });
  const { data: findAllTipoContrato, loading: loadingTC } = useQuery(
    selectAllTipoContrato
  );
  const { data: findAllIncoterm, loading: loadingInc } =
    useQuery(selectAllIncoterm);
  const [remove] = useMutation(removeProforma, {
    refetchQueries: ["selectAllProforma"],
  });
  const [removeSeveral] = useMutation(removeSeveralProforma, {
    refetchQueries: ["selectAllProforma"],
  });

  FilterService.register("filterTipoContrato", (value, filters) => {
    let ret = false;
    if (filters && value && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.tipoContrato === value) ret = true;
      });
    } else {
      ret = true;
    }
    return ret;
  });
  const RepresentativeFilterTemplate = ({ options, onChange }) => {
    return (
      <MultiSelect
        value={options.value}
        options={findAllTipoContrato?.findAllTipoContrato}
        onChange={onChange}
        optionLabel="tipoContrato"
        placeholder="Selecciona los tipos de contratos"
        className="p-column-filter"
      />
    );
  };
  FilterService.register("filterIncoterm", (value, filters) => {
    let ret = false;
    if (filters && value /* && value.length > 0 */ && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.abreviatura === value) ret = true;
      });
    } else {
      ret = true;
    }
    return ret;
  });
  const RepresentativeFilterTemplate1 = ({ options, onChange }) => {
    return (
      <MultiSelect
        value={options.value}
        options={findAllIncoterm?.findAllIncoterm}
        onChange={onChange}
        optionLabel="abreviatura"
        placeholder="Seleccione los incoterms"
        className="p-column-filter"
      />
    );
  };
  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombreProfoma: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "tipoDeContrato.tipoContrato": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "incoterm.abreviatura": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    activa: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    cMarcoF: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
  };

  let c = [
    { field: "nombreProfoma", header: "Nombre" },
    {
      field: "tipoDeContrato.tipoContrato",
      header: "Tipo de Contrato",
      filterElement: RepresentativeFilterTemplate,
      filterMatchModeOptions: [
        { label: "Tipo de Contrato", value: "filterTipoContrato" },
      ],
      filterField: "tipoDeContrato.tipoContrato",
    },
    {
      field: "incoterm.abreviatura",
      header: "Incoterm",
      filterElement: RepresentativeFilterTemplate1,
      filterMatchModeOptions: [{ label: "Incoterm", value: "filterIncoterm" }],
      filterField: "incoterm.abreviatura",
    },
    {
      field: "activa",
      header: "Activa",
      filterElement1: (options) => {
        return (
          <TriStateCheckbox
            value={options.value}
            onChange={(e) => options.filterApplyCallback(e.value)}
          />
        );
      },
    },
    {
      field: "cMarcoF",
      header: "Marco Financiero",
      filterElement1: (options) => {
        return (
          <TriStateCheckbox
            value={options.value}
            onChange={(e) => options.filterApplyCallback(e.value)}
          />
        );
      },
    },
  ];
  let emptyElement = {
    nombreProfoma: "",
    "idTipoContrato": "",
    "idIncoterm": "",
    "activa": false,
    "cMarcoF": false,
  };
  useEffect(() => {
    proformas.map((bg) => {
      bg.fecha = moment(bg.fecha, moment.ISO_8601).toDate();
      return bg;
    });
  });

  const schema = yup.object().shape({
    idTipoContrato: yup
      .number()
      .typeError("Seleccione un tipo de contrato")
      .required("Seleccione un tipo de contrato"),
    nombreProfoma: yup.string().required("Nombre es requerido"),
    activa: yup.boolean(),
    cMarcoF: yup.boolean(),
    idIncoterm: yup.number().typeError("Seleccione una condición de compra"),
  });

  const dataStruct = [
    {
      id: 1,
      component: "InputText",
      name: "nombreProfoma",
      defaultValue: "",
      label: "Nombre*",
      fieldLayout: { className: "col-12" },
    },
    {
      id: 1,
      component: "Dropdown",
      name: "idTipoContrato",
      defaultValue: "",
      label: "Tipo de contrato*",
      props: {
        options: findAllTipoContrato?.findAllTipoContrato,
        optionLabel: "tipoContrato",
        optionValue: "idTipoContrato",
        placeholder: "Seleccione un tipo de contrato",
        filter: true,
      },
      fieldLayout: { className: "col-12" },
    },
    {
      id: 8,
      component: "Dropdown",
      name: "idIncoterm",
      defaultValue: "",
      label: "Condición de Compra*",
      props: {
        options: findAllIncoterm?.findAllIncoterm,
        optionLabel: "abreviatura",
        optionValue: "idIncoterm",
        placeholder: "Seleccione una condición de compra",
        filter: true,
      },
      fieldLayout: { className: "col-12" },
    },
    {
      id: 9,
      component: "CheckBox",
      name: "activa",
      defaultValue: "",
      label: "Activa",
      fieldLayout: { className: "col-4" },
    },
    {
      id: 9,
      component: "CheckBox",
      name: "cMarcoF",
      defaultValue: false,
      label: "Marco financiero",
      fieldLayout: { className: "col-12" },
    },
  ];




  const formProps = {"data": dataStruct, "schema": schema, "handle": updateProforma, "variables": { createProformaInput: {} }, "buttonsNames": ["Guardar", "Cancelar"]}

  return (
    <div>
      {loading && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {error && <h5>{error}</h5>}
      {!(loading || error) ? (
        <div>
          <Table
            value={proformas}
            header="Proformas"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="nombreProfoma"
            // filterDplay="menu"
            // filtersValues={filters}
            edit={true}
            exportData={true}
            emptyElement={emptyElement}
            removeOne={[remove, { id: -1 }]}
            removeSeveral={[removeSeveral, { id: -1 }]}
            formProps={formProps}
            additionalButtons={[
              [
                <Button
                icon="pi pi-eye"
                className="p-button-rounded p-button-text"
                data-pr-tooltip="Ver clausulas"
                />,
                (rowData) =>
                navigate(
                  `/Proformas/Detalle/${rowData.idProforma}`
                ),
                ],
            ]}
            // editLinks={["Add", "Edit"]}
          />
        </div>
      ) : //poner cargar
      undefined}
    </div>
  );
};
