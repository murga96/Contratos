import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode, FilterService, FilterOperator } from "primereact/api";
import * as yup from "yup";
import {
  createProformaClausula,
  removeProformasClausulas,
  removeSeveralProformasClausulas,
  // selectAllProforma,
  selectAllProformaClausulas,
  selectAllTiposDeClausulas,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";
import { MultiSelect } from "primereact/multiselect";

export const ProformaClausulas = () => {
  //graphQL
  const { data, error, loading } = useQuery(selectAllProformaClausulas);
  const [updateTC, { loadingU, errorU }] = useMutation(createProformaClausula, {
    refetchQueries: ["selectAllProformaClausulas"],
  });
  const [removeTC] = useMutation(removeProformasClausulas, {
    refetchQueries: ["selectAllProformaClausulas"],
  });
  const [removeSeverTC] = useMutation(removeSeveralProformasClausulas, {
    refetchQueries: ["selectAllProformaClausulas"],
  });
  const tipoClausula = useQuery(selectAllTiposDeClausulas);
  // const proformas = useQuery(selectAllProforma);

  //Table
  FilterService.register("filterArray", (value, filters) => {
    let ret = false;
    if (filters && value && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.nombreProfoma === value) ret = true;
      });
    } else {
      ret = true;
    }
    return ret;
  });
  const RepresentativeFilterTemplate = ({ options, onChange }) => {
    // return (
    //   <MultiSelect
    //     value={options.value}
    //     options={proformas?.data?.findAllProforma}
    //     onChange={onChange}
    //     optionLabel="nombreProfoma"
    //     placeholder="Seleccione alguna proforma"
    //     className="p-column-filter"
    //   />
    // );
  };
  FilterService.register("filterArray1", (value, filters) => {
    let ret = false;
    if (filters && value /* && value.length > 0 */ && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.nombre === value) ret = true;
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
        options={tipoClausula?.data?.findAllTiposDeClausulas}
        onChange={onChange}
        optionLabel="nombre"
        placeholder="Seleccione algún tipo de clausula"
        className="p-column-filter"
      />
    );
  };
  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    orden: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    clausula: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "proformas.nombreProfoma": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "tiposDeClausulas.nombre": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
  };
  let c = [
      {
        field: "tiposDeClausulas.nombre",
        header: "Tipo de Clausula",
        filterElement: RepresentativeFilterTemplate1,
        filterMatchModeOptions: [{ label: "Tipos de clausulas", value: "filterArray1" }],
        filterField: "tiposDeClausulas.nombre",
      },
    { field: "orden", header: "Orden" },
    {
      field: "proformas.nombreProfoma",
      header: "Proforma",
      filterElement: RepresentativeFilterTemplate,
      filterMatchModeOptions: [{ label: "Proformas", value: "filterArray" }],
      filterField: "proformas.nombreProfoma",
    },
    { field: "clausula", header: "Clausula" },
  ];
  let emptyElement = {
    "tiposDeClausulas.nombre": "",
    orden: "",
    "proformas.nombreProfoma": "",
    clausula: "",
  };

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    "idTipoClausula": yup.number().typeError("Seleccione un tipo de clausula"),
    orden: yup
      .number()
      .typeError("Orden es requerido"),
      idProforma: yup.number().typeError("Seleccione una proforma"),
      clausula: yup.string().required("Clausula es requerida"),
    });

    let dataStruct = [
        {
          id: 1,
          component: "Dropdown",
          name: "idTipoClausula",
          label: "Tipo de clausula*",
          defaultValue: 0,
          props: {
            options: tipoClausula.data?.findAllTiposDeClausulas,
            optionLabel: "nombre",
            optionValue: "idTipoClausula",
            placeholder: "Selecciona un tipo de clausula",
            filter:true,
          },
        },
        {
      id: 2,
      component: "InputNumber",
      name: "orden",
      label: "Orden*",
      defaultValue: "",
      props: {
        showButtons: true,
        min: 1,
        allowEmpty: false,
        step: 1,
        type: "int",
      }
    },
    // {
    //     id: 3,
    //     component: "Dropdown",
    //     name: "idProforma",
    //     label: "Proforma*",
    //     defaultValue: 1,
    //     props: {
    //         options: proformas.data?.findAllProforma,
    //         optionLabel: "nombreProfoma",
    //         optionValue: "idProforma",
    //         placeholder: "Selecciona una proforma",
    //         filter: true,
    //     },
    // },
    {
      id: 4,
      component: "InputTextArea",
      name: "clausula",
      label: "Clausula*",
      defaultValue: "",
    },
  ];
  const formProps = {
    data: dataStruct,
    schema: schema,
    handle: updateTC,
    variables: { createProformaClausulaInput: {} },
    buttonsNames: ["Guardar", "Cancelar"],
  };
  return (
    <div>
      {loading && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {error && <h5 style={{ margin: "100px" }}>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllProformaClausulas}
            header="Clausulas de proformas"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="proformas.nombreProfoma"
            filterDplay="menu"
            filtersValues={filters}
            edit={true}
            exportData={true}
            removeOne={[removeTC, { id: -1 }]}
            removeSeveral={[removeSeverTC, { id: -1 }]}
            formProps={formProps}
            emptyElement={emptyElement}
          />
        </div>
      ) : //poner cargar
      undefined}
    </div>
  );
};
